"""
Testes E2E para o módulo de Menus.
"""
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from uuid import uuid4

from app.main import app
from app.api.dependencies.deps import get_db_session

# Reutilizando lógica de fixtures para isolamento
@pytest.fixture
async def menu_engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest.fixture
async def menu_session(menu_engine):
    factory = sessionmaker(menu_engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as session:
        yield session

@pytest.fixture
async def menu_client(menu_session):
    async def override_get_db_session():
        yield menu_session
    app.dependency_overrides[get_db_session] = override_get_db_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="https://test") as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest.fixture
async def chef_user(menu_client):
    """Registra e faz login, retorna cookies."""
    payload = {"email": "chef_menu@test.com", "password": "pass", "full_name": "Chef Menu"}
    await menu_client.post("/api/auth/register", json=payload)
    login_resp = await menu_client.post("/api/auth/login", json={"email": "chef_menu@test.com", "password": "pass"})
    return login_resp.cookies

@pytest.fixture
async def auth_menu_client(menu_session, chef_user):
    async def override_get_db_session():
        yield menu_session
    app.dependency_overrides[get_db_session] = override_get_db_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="https://test", cookies=chef_user) as ac:
        yield ac
    app.dependency_overrides.clear()

class TestMenuAPI:
    async def test_create_and_list_menu(self, auth_menu_client):
        # 1. Create
        payload = {
            "title": "Menu Verão",
            "occasion": "Piscina",
            "items": [{"category": "bebida", "recipe_name": "Suco"}]
        }
        resp = await auth_menu_client.post("/api/menus", json=payload)
        assert resp.status_code == 201
        menu_id = resp.json()["id"]

        # 2. List
        list_resp = await auth_menu_client.get("/api/menus")
        assert list_resp.status_code == 200
        assert any(m["id"] == menu_id for m in list_resp.json())

    async def test_get_menu_details(self, auth_menu_client):
        payload = {"title": "Menu X", "items": [{"category": "x", "recipe_name": "y"}]}
        create_resp = await auth_menu_client.post("/api/menus", json=payload)
        menu_id = create_resp.json()["id"]

        resp = await auth_menu_client.get(f"/api/menus/{menu_id}")
        assert resp.status_code == 200
        assert resp.json()["title"] == "Menu X"
        assert len(resp.json()["items"]) == 1

    async def test_delete_menu(self, auth_menu_client):
        payload = {"title": "To Delete", "items": []}
        create_resp = await auth_menu_client.post("/api/menus", json=payload)
        menu_id = create_resp.json()["id"]

        del_resp = await auth_menu_client.delete(f"/api/menus/{menu_id}")
        assert del_resp.status_code == 204

        get_resp = await auth_menu_client.get(f"/api/menus/{menu_id}")
        assert get_resp.status_code == 404

    async def test_get_non_existent_menu_404(self, auth_menu_client):
        resp = await auth_menu_client.get(f"/api/menus/{uuid4()}")
        assert resp.status_code == 404

    async def test_user_isolation(self, menu_client, auth_menu_client):
        """Um usuário não deve acessar menu de outro."""
        # User 1 (auth_menu_client) cria um menu
        payload = {"title": "Menu Privado", "items": []}
        create_resp = await auth_menu_client.post("/api/menus", json=payload)
        menu_id = create_resp.json()["id"]

        # User 2 se registra e logo
        user2_payload = {"email": "hacker@test.com", "password": "pass", "full_name": "Hacker"}
        await menu_client.post("/api/auth/register", json=user2_payload)
        login2 = await menu_client.post("/api/auth/login", json={"email": "hacker@test.com", "password": "pass"})
        
        # Client para User 2
        async with AsyncClient(transport=ASGITransport(app=app), base_url="https://test", cookies=login2.cookies) as client2:
            # Tentar acessar menu do User 1
            resp = await client2.get(f"/api/menus/{menu_id}")
            assert resp.status_code == 404  # Deve retornar 404 por segurança (esconder existência)
            
            # Tentar deletar menu do User 1
            del_resp = await client2.delete(f"/api/menus/{menu_id}")
            assert del_resp.status_code == 404
