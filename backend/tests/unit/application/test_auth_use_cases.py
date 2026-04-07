"""
🔴 RED: Testes para use cases de autenticação (Register + Login).
"""
import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4


class TestRegisterUseCase:
    """Testes para o caso de uso de registro."""

    @pytest.mark.asyncio
    async def test_registro_sucesso(self):
        from app.application.use_cases.auth_use_cases import RegisterUseCase

        mock_repo = AsyncMock()
        mock_user = MagicMock()
        mock_user.id = uuid4()
        mock_user.email = "chef@lacuisine.com"
        mock_user.full_name = "Chef Silva"
        mock_repo.create.return_value = mock_user
        mock_repo.get_by_email.return_value = None  # email não existe

        use_case = RegisterUseCase(repository=mock_repo)
        result = await use_case.execute(
            email="chef@lacuisine.com",
            password="senhaforte123",
            full_name="Chef Silva",
        )
        assert result is not None
        assert result.email == "chef@lacuisine.com"
        mock_repo.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_registro_email_duplicado(self):
        from app.application.use_cases.auth_use_cases import RegisterUseCase

        mock_repo = AsyncMock()
        mock_repo.get_by_email.return_value = MagicMock()  # email já existe

        use_case = RegisterUseCase(repository=mock_repo)
        with pytest.raises(ValueError, match="Email já cadastrado"):
            await use_case.execute(
                email="chef@lacuisine.com",
                password="senhaforte123",
                full_name="Chef Silva",
            )


class TestLoginUseCaseUpdated:
    """Testes para o LoginUseCase atualizado (busca do banco)."""

    @pytest.mark.asyncio
    async def test_login_sucesso(self):
        from app.application.use_cases.auth_use_cases import LoginUseCase
        from app.infrastructure.auth.password import hash_password

        hashed = hash_password("senhaforte123")

        mock_repo = AsyncMock()
        mock_user = MagicMock()
        mock_user.id = uuid4()
        mock_user.email = "chef@lacuisine.com"
        mock_user.hashed_password = hashed
        mock_repo.get_by_email.return_value = mock_user

        use_case = LoginUseCase(
            repository=mock_repo,
            secret="test-secret",
        )
        result = await use_case.execute(
            email="chef@lacuisine.com",
            password="senhaforte123",
        )
        assert result is not None
        assert "access_token" in result
        assert result["user_email"] == "chef@lacuisine.com"

    @pytest.mark.asyncio
    async def test_login_email_inexistente(self):
        from app.application.use_cases.auth_use_cases import LoginUseCase

        mock_repo = AsyncMock()
        mock_repo.get_by_email.return_value = None

        use_case = LoginUseCase(
            repository=mock_repo,
            secret="test-secret",
        )
        result = await use_case.execute(
            email="naoexiste@email.com",
            password="qualquer",
        )
        assert result is None

    @pytest.mark.asyncio
    async def test_login_senha_incorreta(self):
        from app.application.use_cases.auth_use_cases import LoginUseCase
        from app.infrastructure.auth.password import hash_password

        mock_repo = AsyncMock()
        mock_user = MagicMock()
        mock_user.hashed_password = hash_password("senhaCorreta")
        mock_repo.get_by_email.return_value = mock_user

        use_case = LoginUseCase(
            repository=mock_repo,
            secret="test-secret",
        )
        result = await use_case.execute(
            email="chef@lacuisine.com",
            password="senhaErrada",
        )
        assert result is None
