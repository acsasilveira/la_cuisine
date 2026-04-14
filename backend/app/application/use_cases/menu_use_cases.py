"""Use cases para operações de menus."""
from uuid import UUID


class CreateMenuUseCase:
    """Caso de uso: Criar menu."""

    def __init__(self, repository):
        self.repository = repository

    async def execute(self, data: dict):
        """Executa a criação de um menu."""
        return await self.repository.create(data)


class ListMenusUseCase:
    """Caso de uso: Listar menus."""

    def __init__(self, repository):
        self.repository = repository

    async def execute(self, user_id: UUID | None = None):
        """Executa a listagem de menus."""
        return await self.repository.list_all(user_id=user_id)


class GetMenuByIdUseCase:
    """Caso de uso: Obter menu por ID."""

    def __init__(self, repository):
        self.repository = repository

    async def execute(self, menu_id: UUID, user_id: UUID | None = None):
        """Executa a busca de menu por ID."""
        return await self.repository.get_by_id(menu_id, user_id=user_id)


class DeleteMenuUseCase:
    """Caso de uso: Deletar menu."""

    def __init__(self, repository):
        self.repository = repository

    async def execute(self, menu_id: UUID, user_id: UUID | None = None) -> bool:
        """Executa a exclusão de um menu."""
        return await self.repository.delete(menu_id, user_id=user_id)
