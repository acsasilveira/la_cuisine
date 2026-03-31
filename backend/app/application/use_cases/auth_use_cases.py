"""Use cases para autenticação."""
from app.infrastructure.auth.jwt_handler import create_access_token
from app.infrastructure.auth.password import verify_password


class LoginUseCase:
    """Caso de uso: Login e geração de token JWT."""

    def __init__(self, secret: str, algorithm: str = "HS256"):
        self.secret = secret
        self.algorithm = algorithm

    async def execute(
        self, email: str, password: str, stored_hash: str
    ) -> dict | None:
        """Verifica credenciais e retorna token JWT."""
        if not verify_password(password, stored_hash):
            return None

        token = create_access_token(
            data={"sub": email},
            secret=self.secret,
            algorithm=self.algorithm,
        )
        return {"access_token": token, "token_type": "bearer"}
