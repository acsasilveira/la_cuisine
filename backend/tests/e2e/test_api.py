"""
🔴 RED: Testes E2E para endpoints da API FastAPI.
Usa httpx.AsyncClient com banco SQLite em memória.
"""
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.infrastructure.database.models import (  # noqa: F401
    RecipeModel, IngredientModel, RecipeIngredientModel, RecipeStepModel,
)
from app.main import app
from app.api.dependencies.deps import get_db_session


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


# ============================================================
# Recipe Endpoints
# ============================================================

class TestRecipeEndpoints:
    async def test_post_recipe_201(self, e2e_client):
        response = await e2e_client.post("/api/recipes", json={
            "title": "Bolo de Chocolate",
            "category": "dessert",
            "yield_amount": 12.0,
            "yield_unit": "fatias",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Bolo de Chocolate"
        assert "id" in data

    async def test_post_recipe_422_dados_invalidos(self, e2e_client):
        response = await e2e_client.post("/api/recipes", json={
            "title": "Sem outros campos",
        })
        assert response.status_code == 422

    async def test_get_recipes_200_lista(self, e2e_client):
        # Criar uma receita primeiro
        await e2e_client.post("/api/recipes", json={
            "title": "Salada",
            "category": "appetizer",
            "yield_amount": 2.0,
            "yield_unit": "porções",
        })
        response = await e2e_client.get("/api/recipes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    async def test_get_recipes_200_lista_vazia(self, e2e_client):
        response = await e2e_client.get("/api/recipes")
        assert response.status_code == 200

    async def test_get_recipe_by_id_200(self, e2e_client):
        # Criar receita
        create_resp = await e2e_client.post("/api/recipes", json={
            "title": "Feijoada",
            "category": "main",
            "yield_amount": 8.0,
            "yield_unit": "porções",
        })
        recipe_id = create_resp.json()["id"]

        response = await e2e_client.get(f"/api/recipes/{recipe_id}")
        assert response.status_code == 200
        assert response.json()["title"] == "Feijoada"

    async def test_get_recipe_by_id_404(self, e2e_client):
        response = await e2e_client.get(
            "/api/recipes/00000000-0000-0000-0000-000000000000"
        )
        assert response.status_code == 404


# ============================================================
# Chat Endpoints
# ============================================================

class TestChatEndpoints:
    async def test_chat_400_mensagem_vazia(self, e2e_client):
        response = await e2e_client.post("/api/chat/copilot", json={
            "message": "",
        })
        assert response.status_code == 400


# ============================================================
# Auth Endpoints
# ============================================================

class TestAuthEndpoints:
    async def test_login_401_usuario_inexistente(self, e2e_client):
        response = await e2e_client.post("/api/auth/login", json={
            "email": "nobody@test.com",
            "password": "wrong",
        })
        assert response.status_code == 401


# ============================================================
# Health Check
# ============================================================

class TestHealthCheck:
    async def test_health_200(self, e2e_client):
        response = await e2e_client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
