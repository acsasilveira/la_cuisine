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
    async def get_by_id(self, recipe_id: UUID) -> dict | None:
        """Busca uma receita por ID."""
        ...

    @abstractmethod
    async def list_all(self) -> list[dict]:
        """Lista todas as receitas."""
        ...
