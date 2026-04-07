"""Implementação concreta do repositório de usuários."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.ports.repository_ports import UserRepositoryPort
from app.infrastructure.database.models import UserModel


class UserRepository(UserRepositoryPort):
    """Repositório de usuários usando SQLModel/SQLAlchemy."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_data: dict) -> UserModel:
        """Cria um novo usuário no banco."""
        user = UserModel(**user_data)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get_by_email(self, email: str) -> UserModel | None:
        """Busca um usuário por email."""
        stmt = select(UserModel).where(UserModel.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: UUID) -> UserModel | None:
        """Busca um usuário por ID."""
        stmt = select(UserModel).where(UserModel.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
