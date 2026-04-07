"""
🔴 RED: Testes para entidade UserBase do domínio.
Estes testes DEVEM falhar até que a entidade seja implementada.
"""
import pytest
from pydantic import ValidationError


class TestUserBase:
    """Testes para a entidade UserBase."""

    def test_criacao_com_dados_validos(self):
        from app.domain.entities.user import UserBase

        user = UserBase(
            email="chef@lacuisine.com",
            full_name="Chef Silva",
        )
        assert user.email == "chef@lacuisine.com"
        assert user.full_name == "Chef Silva"

    def test_email_obrigatorio(self):
        from app.domain.entities.user import UserBase

        with pytest.raises(ValidationError):
            UserBase(full_name="Chef Silva")

    def test_full_name_obrigatorio(self):
        from app.domain.entities.user import UserBase

        with pytest.raises(ValidationError):
            UserBase(email="chef@lacuisine.com")

    def test_email_invalido_levanta_erro(self):
        from app.domain.entities.user import UserBase

        with pytest.raises(ValidationError):
            UserBase(email="nao-e-email", full_name="Chef")
