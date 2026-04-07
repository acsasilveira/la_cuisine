"""Ports (interfaces) para repositórios do domínio."""
from abc import ABC, abstractmethod
from uuid import UUID


class RecipeRepositoryPort(ABC):
    """Interface abstrata para o repositório de receitas."""

    @abstractmethod
    async def create(self, recipe_data: dict) -> dict:
        """Cria uma nova receita no banco."""
        ...

    @abstractmethod
    async def get_by_id(self, recipe_id: UUID, user_id: UUID | None = None) -> dict | None:
        """Busca uma receita por ID, opcionalmente verificando ownership."""
        ...

    @abstractmethod
    async def list_all(self, user_id: UUID | None = None) -> list[dict]:
        """Lista receitas, opcionalmente filtrando por user_id."""
        ...


class UserRepositoryPort(ABC):
    """Interface abstrata para o repositório de usuários."""

    @abstractmethod
    async def create(self, user_data: dict) -> dict:
        """Cria um novo usuário no banco."""
        ...

    @abstractmethod
    async def get_by_email(self, email: str) -> dict | None:
        """Busca um usuário por email."""
        ...

    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> dict | None:
        """Busca um usuário por ID."""
        ...
