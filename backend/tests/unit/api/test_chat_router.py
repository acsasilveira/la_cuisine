"""
Testes de roteador para Chat a fim de validar tratativas de erro (502, 504).
"""
import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.api.dependencies.deps import get_ai_service, get_current_user, get_db_session
from app.infrastructure.database.models import UserModel

@pytest.fixture
async def mock_chef():
    return UserModel(id="00000000-0000-0000-0000-000000000001", email="test@test.com", full_name="Chef")

@pytest.fixture
async def chat_error_client(mock_chef):
    mock_ai = MagicMock()
    
    async def override_db():
        session = AsyncMock()
        yield session

    app.dependency_overrides[get_ai_service] = lambda: mock_ai
    app.dependency_overrides[get_current_user] = lambda: mock_chef
    app.dependency_overrides[get_db_session] = override_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac, mock_ai
    app.dependency_overrides.clear()

class TestChatRouterErrorHandling:
    async def test_chat_502_on_value_error(self, chat_error_client):
        client, mock_ai = chat_error_client
        mock_ai.chat = AsyncMock(side_effect=ValueError("IA doidona"))
        
        response = await client.post("/api/chat/copilot", json={"message": "Oi"})
        
        assert response.status_code == 502
        assert "IA retornou formato inválido" in response.json()["detail"]

    async def test_chat_504_on_timeout(self, chat_error_client):
        client, mock_ai = chat_error_client
        mock_ai.chat = AsyncMock(side_effect=TimeoutError())
        
        response = await client.post("/api/chat/copilot", json={"message": "Oi"})
        
        assert response.status_code == 504
        assert "IA não respondeu a tempo" in response.json()["detail"]
