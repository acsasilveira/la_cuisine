"""Use cases para autenticação."""
from app.domain.ports.repository_ports import UserRepositoryPort
from app.infrastructure.auth.jwt_handler import create_access_token
from app.infrastructure.auth.password import hash_password, verify_password


class RegisterUseCase:
    """Caso de uso: Registrar novo usuário."""

    def __init__(self, repository: UserRepositoryPort):
        self.repository = repository

    async def execute(self, email: str, password: str, full_name: str):
        """Registra um novo usuário com senha hasheada."""
        existing = await self.repository.get_by_email(email)
        if existing:
            raise ValueError("Email já cadastrado")

        hashed = hash_password(password)
        user = await self.repository.create({
            "email": email,
            "full_name": full_name,
            "hashed_password": hashed,
        })
        return user


class LoginUseCase:
    """Caso de uso: Login e geração de token JWT."""

    def __init__(self, repository: UserRepositoryPort, secret: str, algorithm: str = "HS256"):
        self.repository = repository
        self.secret = secret
        self.algorithm = algorithm

    async def execute(self, email: str, password: str) -> dict | None:
        """Busca usuário no banco, verifica senha e retorna token JWT."""
        user = await self.repository.get_by_email(email)
        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        token = create_access_token(
            data={"sub": str(user.id)},
            secret=self.secret,
            algorithm=self.algorithm,
        )
        return {
            "access_token": token,
            "token_type": "bearer",
            "user_email": user.email,
            "user_id": str(user.id),
            "user_full_name": user.full_name,
        }
