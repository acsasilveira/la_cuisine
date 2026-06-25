"""
Testes de roteador para Receitas a fim de validar tratativas de erro.
"""
import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

from app.main import app
from app.api.dependencies.deps import get_ai_service, get_current_user, get_db_session
from app.infrastructure.database.models import UserModel

@pytest.fixture
async def mock_recipe_user():
    return UserModel(id="00000000-0000-0000-0000-000000000001", email="test@test.com", full_name="Chef")

@pytest.fixture
async def recipe_error_client(mock_recipe_user):
    mock_ai = MagicMock()
    
    async def override_db():
        session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        session.execute.return_value = mock_result
        yield session

    app.dependency_overrides[get_ai_service] = lambda: mock_ai
    app.dependency_overrides[get_current_user] = lambda: mock_recipe_user
    app.dependency_overrides[get_db_session] = override_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac, mock_ai
    app.dependency_overrides.clear()

class TestRecipeRouterErrorHandling:
    async def test_analyze_image_invalid_type(self, recipe_error_client):
        client, _ = recipe_error_client
        files = {"file": ("test.txt", b"not an image", "text/plain")}
        response = await client.post("/api/recipes/analyze-image", files=files)
        assert response.status_code == 400
        assert "Arquivo deve ser uma imagem" in response.json()["detail"]

    async def test_analyze_image_ia_error_502(self, recipe_error_client):
        client, mock_ai = recipe_error_client
        mock_ai.analyze_image = AsyncMock(side_effect=ValueError("IA corrompida"))
        files = {"file": ("test.jpg", b"fake binary", "image/jpeg")}
        response = await client.post("/api/recipes/analyze-image", files=files)
        assert response.status_code == 502

    async def test_analyze_image_ia_timeout_504(self, recipe_error_client):
        client, mock_ai = recipe_error_client
        mock_ai.analyze_image = AsyncMock(side_effect=TimeoutError())
        files = {"file": ("test.jpg", b"fake binary", "image/jpeg")}
        response = await client.post("/api/recipes/analyze-image", files=files)
        assert response.status_code == 504

    async def test_crud_not_found_404(self, recipe_error_client):
        client, _ = recipe_error_client
        random_id = uuid4()
        
        # GET
        assert (await client.get(f"/api/recipes/{random_id}")).status_code == 404
        # PUT
        payload = {"title": "X", "category": "main", "yield_amount": 1, "yield_unit": "u"}
        assert (await client.put(f"/api/recipes/{random_id}", json=payload)).status_code == 404
        # DELETE
        assert (await client.delete(f"/api/recipes/{random_id}")).status_code == 404
