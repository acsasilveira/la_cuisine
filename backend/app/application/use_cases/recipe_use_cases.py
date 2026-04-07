"""Use cases para operações de receitas."""
from uuid import UUID

from app.domain.ports.repository_ports import RecipeRepositoryPort


class CreateRecipeUseCase:
    """Caso de uso: Criar receita."""

    def __init__(self, repository: RecipeRepositoryPort):
        self.repository = repository

    async def execute(self, data: dict):
        """Executa a criação de uma receita."""
        required_fields = {"title", "category", "yield_amount", "yield_unit"}
        if not required_fields.issubset(data.keys()):
            missing = required_fields - set(data.keys())
            raise ValueError(f"Campos obrigatórios ausentes: {missing}")

        return await self.repository.create(data)


class ListRecipesUseCase:
    """Caso de uso: Listar receitas."""

    def __init__(self, repository: RecipeRepositoryPort):
        self.repository = repository

    async def execute(self, user_id: UUID | None = None):
        """Executa a listagem de receitas, opcionalmente filtrando por user_id."""
        return await self.repository.list_all(user_id=user_id)


class GetRecipeByIdUseCase:
    """Caso de uso: Obter receita por ID."""

    def __init__(self, repository: RecipeRepositoryPort):
        self.repository = repository

    async def execute(self, recipe_id: UUID, user_id: UUID | None = None):
        """Executa a busca de receita por ID, opcionalmente verificando ownership."""
        return await self.repository.get_by_id(recipe_id, user_id=user_id)
