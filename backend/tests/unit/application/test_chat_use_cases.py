"""
Testes unitários para ChatCopilotUseCase com Mocks para simular erros da IA.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.application.use_cases.ai_use_cases import ChatCopilotUseCase
from app.domain.ports.service_ports import AIServicePort

@pytest.fixture
def mock_ai_service():
    return MagicMock(spec=AIServicePort)

@pytest.fixture
def chat_use_case(mock_ai_service):
    return ChatCopilotUseCase(ai_service=mock_ai_service)

class TestChatCopilotUseCaseErrors:
    async def test_execute_com_sucesso(self, chat_use_case, mock_ai_service):
        mock_ai_service.chat = AsyncMock(return_value={"type": "text", "data": {"message": "Olá"}})
        
        result = await chat_use_case.execute("Oi")
        
        assert result["type"] == "text"
        mock_ai_service.chat.assert_called_once_with("Oi", context=None)

    async def test_execute_com_perfil_usuario(self, chat_use_case, mock_ai_service):
        mock_ai_service.chat = AsyncMock(return_value={"type": "text", "data": {"message": "Olá"}})
        
        await chat_use_case.execute("Oi", specialty="Massas", location="Roma")
        
        # Verificar injeção de contexto
        args, kwargs = mock_ai_service.chat.call_args
        assert kwargs["context"]["user_profile"]["specialty"] == "Massas"
        assert kwargs["context"]["user_profile"]["location"] == "Roma"

    async def test_handle_ai_timeout(self, chat_use_case, mock_ai_service):
        mock_ai_service.chat = AsyncMock(side_effect=TimeoutError("IA demorou"))
        
        with pytest.raises(TimeoutError):
            await chat_use_case.execute("Oi")

    async def test_handle_ai_invalid_format(self, chat_use_case, mock_ai_service):
        mock_ai_service.chat = AsyncMock(side_effect=ValueError("JSON Inválido"))
        
        with pytest.raises(ValueError):
            await chat_use_case.execute("Oi")
