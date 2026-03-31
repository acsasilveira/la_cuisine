"""
🔴 RED: Testes unitários para funções de autenticação JWT e hash de senha.
"""
from datetime import timedelta

import pytest


class TestCreateAccessToken:
    """Testes para create_access_token."""

    def test_token_valido_gerado(self):
        from app.infrastructure.auth.jwt_handler import create_access_token

        token = create_access_token(
            data={"sub": "user@example.com"},
            secret="test-secret",
            algorithm="HS256",
        )
        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_contem_claims(self):
        from app.infrastructure.auth.jwt_handler import (
            create_access_token,
            verify_token,
        )

        token = create_access_token(
            data={"sub": "chef@lacuisine.com"},
            secret="test-secret",
            algorithm="HS256",
        )
        payload = verify_token(token, secret="test-secret", algorithm="HS256")
        assert payload["sub"] == "chef@lacuisine.com"

    def test_token_com_expiracao_customizada(self):
        from app.infrastructure.auth.jwt_handler import (
            create_access_token,
            verify_token,
        )

        token = create_access_token(
            data={"sub": "user@test.com"},
            secret="test-secret",
            algorithm="HS256",
            expires_delta=timedelta(hours=2),
        )
        payload = verify_token(token, secret="test-secret", algorithm="HS256")
        assert payload["sub"] == "user@test.com"
        assert "exp" in payload


class TestVerifyToken:
    """Testes para verify_token."""

    def test_token_valido(self):
        from app.infrastructure.auth.jwt_handler import (
            create_access_token,
            verify_token,
        )

        token = create_access_token(
            data={"sub": "valid@user.com"},
            secret="test-secret",
            algorithm="HS256",
        )
        payload = verify_token(token, secret="test-secret", algorithm="HS256")
        assert payload is not None
        assert payload["sub"] == "valid@user.com"

    def test_token_invalido(self):
        from app.infrastructure.auth.jwt_handler import verify_token

        payload = verify_token(
            "token.invalido.aqui", secret="test-secret", algorithm="HS256"
        )
        assert payload is None

    def test_token_expirado(self):
        from app.infrastructure.auth.jwt_handler import (
            create_access_token,
            verify_token,
        )

        token = create_access_token(
            data={"sub": "expired@user.com"},
            secret="test-secret",
            algorithm="HS256",
            expires_delta=timedelta(seconds=-1),
        )
        payload = verify_token(token, secret="test-secret", algorithm="HS256")
        assert payload is None


class TestPasswordHash:
    """Testes para hash de senha."""

    def test_hash_gerado(self):
        from app.infrastructure.auth.password import hash_password

        hashed = hash_password("minha-senha-segura")
        assert isinstance(hashed, str)
        assert hashed != "minha-senha-segura"

    def test_verificacao_correta(self):
        from app.infrastructure.auth.password import hash_password, verify_password

        hashed = hash_password("senha123")
        assert verify_password("senha123", hashed) is True

    def test_senha_errada(self):
        from app.infrastructure.auth.password import hash_password, verify_password

        hashed = hash_password("senha-certa")
        assert verify_password("senha-errada", hashed) is False
