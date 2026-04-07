"""
Testes unitários para a dependency get_current_user.
Testa cookie válido, inválido, expirado e ausente.
"""
import pytest
from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

from fastapi import HTTPException

from app.api.dependencies import deps
from app.infrastructure.auth.jwt_handler import create_access_token


# Test JWT config
TEST_SECRET = "test-secret-deps"
TEST_ALGORITHM = "HS256"


@pytest.fixture(autouse=True)
def configure_test_auth():
    """Configura auth para os testes."""
    original_secret = deps._jwt_secret
    original_algo = deps._jwt_algorithm
    deps._jwt_secret = TEST_SECRET
    deps._jwt_algorithm = TEST_ALGORITHM
    yield
    deps._jwt_secret = original_secret
    deps._jwt_algorithm = original_algo


def make_request(cookie_value=None):
    """Cria um mock de Request com cookie opcional."""
    request = MagicMock()
    if cookie_value:
        request.cookies = {"session": cookie_value}
    else:
        request.cookies = {}
    return request


class TestGetCurrentUser:
    """Testes para get_current_user dependency."""

    @pytest.mark.asyncio
    async def test_cookie_ausente_retorna_401(self):
        request = make_request(cookie_value=None)
        session = AsyncMock()

        with pytest.raises(HTTPException) as exc_info:
            await deps.get_current_user(request=request, session=session)

        assert exc_info.value.status_code == 401
        assert "Não autenticado" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_cookie_invalido_retorna_401(self):
        request = make_request(cookie_value="token-lixo-invalido")
        session = AsyncMock()

        with pytest.raises(HTTPException) as exc_info:
            await deps.get_current_user(request=request, session=session)

        assert exc_info.value.status_code == 401
        assert "Sessão inválida" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_cookie_expirado_retorna_401(self):
        # Criar token com expiração no passado
        token = create_access_token(
            data={"sub": str(uuid4())},
            secret=TEST_SECRET,
            algorithm=TEST_ALGORITHM,
            expires_delta=timedelta(seconds=-10),  # já expirado
        )
        request = make_request(cookie_value=token)
        session = AsyncMock()

        with pytest.raises(HTTPException) as exc_info:
            await deps.get_current_user(request=request, session=session)

        assert exc_info.value.status_code == 401
        assert "Sessão inválida" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_token_sem_sub_retorna_401(self):
        # Token sem campo 'sub'
        token = create_access_token(
            data={"email": "test@test.com"},  # sub ausente
            secret=TEST_SECRET,
            algorithm=TEST_ALGORITHM,
        )
        request = make_request(cookie_value=token)
        session = AsyncMock()

        with pytest.raises(HTTPException) as exc_info:
            await deps.get_current_user(request=request, session=session)

        assert exc_info.value.status_code == 401
        assert "Token inválido" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_usuario_nao_encontrado_retorna_401(self):
        user_id = uuid4()
        token = create_access_token(
            data={"sub": str(user_id)},
            secret=TEST_SECRET,
            algorithm=TEST_ALGORITHM,
        )
        request = make_request(cookie_value=token)
        session = AsyncMock()

        # Mock UserRepository para retornar None
        with patch("app.api.dependencies.deps.UserRepository") as MockRepo:
            mock_repo = MockRepo.return_value
            mock_repo.get_by_id = AsyncMock(return_value=None)

            with pytest.raises(HTTPException) as exc_info:
                await deps.get_current_user(request=request, session=session)

            assert exc_info.value.status_code == 401
            assert "Usuário não encontrado" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_cookie_valido_retorna_user(self):
        user_id = uuid4()
        token = create_access_token(
            data={"sub": str(user_id)},
            secret=TEST_SECRET,
            algorithm=TEST_ALGORITHM,
        )
        request = make_request(cookie_value=token)
        session = AsyncMock()

        # Mock UserRepository para retornar um user
        mock_user = MagicMock()
        mock_user.id = user_id
        mock_user.email = "chef@lacuisine.com"

        with patch("app.api.dependencies.deps.UserRepository") as MockRepo:
            mock_repo = MockRepo.return_value
            mock_repo.get_by_id = AsyncMock(return_value=mock_user)

            result = await deps.get_current_user(request=request, session=session)

            assert result.id == user_id
            assert result.email == "chef@lacuisine.com"
