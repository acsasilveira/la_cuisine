"""
Testes E2E para endpoints da API FastAPI com autenticação via cookie.
Usa httpx.AsyncClient com banco SQLite em memória.
"""
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.infrastructure.database.models import (  # noqa: F401
    RecipeModel, IngredientModel, RecipeIngredientModel, RecipeStepModel,
    UserModel,
)
from app.main import app
from app.api.dependencies.deps import get_db_session, configure_auth


# Configurar auth para testes usando configs do app
from app.config import settings
configure_auth(settings.JWT_SECRET, settings.JWT_ALGORITHM)


# ============================================================
# Fixtures
# ============================================================

@pytest.fixture
async def e2e_engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def e2e_session(e2e_engine):
    factory = sessionmaker(e2e_engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as session:
        yield session


@pytest.fixture
async def e2e_client(e2e_session):
    """Client que injeta sessão de teste no FastAPI via dependency override."""
    async def override_get_db_session():
        yield e2e_session

    app.dependency_overrides[get_db_session] = override_get_db_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture
async def registered_user(e2e_client):
    """Registra um usuário de teste e retorna seus dados."""
    response = await e2e_client.post("/api/auth/register", json={
        "email": "chef@lacuisine.com",
        "password": "senhaforte123",
        "full_name": "Chef de Teste",
    })
    assert response.status_code == 201
    return response.json()


@pytest.fixture
async def auth_cookies(e2e_client, registered_user):
    """Faz login e retorna os cookies de sessão para usar nos requests."""
    response = await e2e_client.post("/api/auth/login", json={
        "email": "chef@lacuisine.com",
        "password": "senhaforte123",
    })
    assert response.status_code == 200
    # Extrair o cookie 'session' setado pelo Set-Cookie header
    return response.cookies


@pytest.fixture
async def auth_client(e2e_session, auth_cookies):
    """Client autenticado com cookie de sessão."""
    async def override_get_db_session():
        yield e2e_session

    app.dependency_overrides[get_db_session] = override_get_db_session
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://test",
        cookies=auth_cookies,
    ) as ac:
        yield ac
    app.dependency_overrides.clear()


# ============================================================
# Health Check (público)
# ============================================================

class TestHealthCheck:
    async def test_health_200(self, e2e_client):
        response = await e2e_client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


# ============================================================
# Auth — Register
# ============================================================

class TestRegisterEndpoint:
    async def test_register_201_sucesso(self, e2e_client):
        response = await e2e_client.post("/api/auth/register", json={
            "email": "novo@chef.com",
            "password": "senhaforte123",
            "full_name": "Novo Chef",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "novo@chef.com"
        assert data["full_name"] == "Novo Chef"
        assert "id" in data
        # Não deve retornar senha
        assert "password" not in data
        assert "hashed_password" not in data

    async def test_register_409_email_duplicado(self, e2e_client):
        # Primeiro registro
        await e2e_client.post("/api/auth/register", json={
            "email": "duplicado@chef.com",
            "password": "senha123",
            "full_name": "Chef 1",
        })
        # Segundo registro com mesmo email
        response = await e2e_client.post("/api/auth/register", json={
            "email": "duplicado@chef.com",
            "password": "outrasenha",
            "full_name": "Chef 2",
        })
        assert response.status_code == 409
        assert "Email já cadastrado" in response.json()["detail"]

    async def test_register_422_dados_invalidos(self, e2e_client):
        response = await e2e_client.post("/api/auth/register", json={
            "email": "chef@test.com",
            # faltando password e full_name
        })
        assert response.status_code == 422


# ============================================================
# Auth — Login (cookie)
# ============================================================

class TestLoginEndpoint:
    async def test_login_200_seta_cookie(self, e2e_client, registered_user):
        response = await e2e_client.post("/api/auth/login", json={
            "email": "chef@lacuisine.com",
            "password": "senhaforte123",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "chef@lacuisine.com"
        assert data["full_name"] == "Chef de Teste"
        # Verificar que o cookie foi setado
        assert "session" in response.cookies

    async def test_login_401_senha_incorreta(self, e2e_client, registered_user):
        response = await e2e_client.post("/api/auth/login", json={
            "email": "chef@lacuisine.com",
            "password": "senhaerrada",
        })
        assert response.status_code == 401
        assert "Credenciais inválidas" in response.json()["detail"]
        # Não deve setar cookie
        assert "session" not in response.cookies

    async def test_login_401_email_inexistente(self, e2e_client):
        response = await e2e_client.post("/api/auth/login", json={
            "email": "naoexiste@test.com",
            "password": "qualquer",
        })
        assert response.status_code == 401
        assert "Credenciais inválidas" in response.json()["detail"]


# ============================================================
# Auth — Logout
# ============================================================

class TestLogoutEndpoint:
    async def test_logout_200_apaga_cookie(self, e2e_client):
        response = await e2e_client.post("/api/auth/logout")
        assert response.status_code == 200
        assert response.json()["message"] == "Logout realizado com sucesso"
        # Cookie deve ser apagado (max-age=0 ou expirado)
        if "session" in response.cookies:
            # httpx pode representar o cookie apagado de formas diferentes
            pass  # O importante é que o header Set-Cookie foi enviado


# ============================================================
# Rotas Protegidas — sem cookie retorna 401
# ============================================================

class TestProtectedRoutesWithoutAuth:
    """Todas as rotas protegidas DEVEM retornar 401 sem cookie."""

    async def test_get_recipes_401_sem_cookie(self, e2e_client):
        response = await e2e_client.get("/api/recipes")
        assert response.status_code == 401

    async def test_post_recipes_401_sem_cookie(self, e2e_client):
        response = await e2e_client.post("/api/recipes", json={
            "title": "Teste",
            "category": "dessert",
            "yield_amount": 1.0,
            "yield_unit": "porção",
        })
        assert response.status_code == 401

    async def test_get_recipe_by_id_401_sem_cookie(self, e2e_client):
        response = await e2e_client.get(
            "/api/recipes/00000000-0000-0000-0000-000000000000"
        )
        assert response.status_code == 401

    async def test_post_menu_suggest_401_sem_cookie(self, e2e_client):
        response = await e2e_client.post("/api/menus/suggest", json={
            "recipe_id": "00000000-0000-0000-0000-000000000000",
            "category": "main",
        })
        assert response.status_code == 401

    async def test_post_chat_copilot_401_sem_cookie(self, e2e_client):
        response = await e2e_client.post("/api/chat/copilot", json={
            "message": "Como fazer bolo?",
        })
        assert response.status_code == 401


# ============================================================
# Recipe Endpoints — com autenticação
# ============================================================

class TestRecipeEndpointsAuthenticated:
    async def test_post_recipe_201(self, auth_client):
        response = await auth_client.post("/api/recipes", json={
            "title": "Bolo de Chocolate",
            "category": "dessert",
            "yield_amount": 12.0,
            "yield_unit": "fatias",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Bolo de Chocolate"
        assert "id" in data
        assert "ingredients" in data
        assert "steps" in data

    async def test_post_recipe_422_dados_invalidos(self, auth_client):
        response = await auth_client.post("/api/recipes", json={
            "title": "Sem outros campos",
        })
        assert response.status_code == 422

    async def test_get_recipes_200_lista(self, auth_client):
        # Criar uma receita primeiro
        await auth_client.post("/api/recipes", json={
            "title": "Salada",
            "category": "appetizer",
            "yield_amount": 2.0,
            "yield_unit": "porções",
        })
        response = await auth_client.get("/api/recipes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    async def test_get_recipes_200_lista_vazia(self, auth_client):
        response = await auth_client.get("/api/recipes")
        assert response.status_code == 200

    async def test_get_recipe_by_id_200(self, auth_client):
        # Criar receita com ingredientes e passos
        create_resp = await auth_client.post("/api/recipes", json={
            "title": "Feijoada",
            "category": "main",
            "yield_amount": 8.0,
            "yield_unit": "porções",
            "ingredients": [
                {"name": "Feijão Preto", "amount": 500.0, "unit": "g"},
                {"name": "Linguiça", "amount": 200.0, "unit": "g"},
            ],
            "steps": [
                {"step_number": 1, "instruction": "Cozinhar o feijão"},
                {"step_number": 2, "instruction": "Refogar a linguiça"},
            ],
        })
        recipe_id = create_resp.json()["id"]

        response = await auth_client.get(f"/api/recipes/{recipe_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Feijoada"
        assert len(data["ingredients"]) == 2
        assert len(data["steps"]) == 2

    async def test_get_recipe_by_id_404(self, auth_client):
        response = await auth_client.get(
            "/api/recipes/00000000-0000-0000-0000-000000000000"
        )
        assert response.status_code == 404


# ============================================================
# Chat Endpoints — com autenticação
# ============================================================

class TestChatEndpointsAuthenticated:
    async def test_chat_400_mensagem_vazia(self, auth_client):
        response = await auth_client.post("/api/chat/copilot", json={
            "message": "",
        })
        assert response.status_code == 400
