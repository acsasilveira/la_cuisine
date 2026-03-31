"""Use cases para operações com IA."""
from uuid import UUID

from app.domain.ports.repository_ports import RecipeRepositoryPort
from app.domain.ports.service_ports import AIServicePort


class AnalyzeImageUseCase:
    """Caso de uso: Analisar imagem e extrair receita."""

    def __init__(self, ai_service: AIServicePort):
        self.ai_service = ai_service

    async def execute(self, image_bytes: bytes) -> dict:
        """Envia imagem para IA e retorna dados da receita."""
        return await self.ai_service.analyze_image(image_bytes)


class SuggestMenuUseCase:
    """Caso de uso: Sugerir menus com IA."""

    def __init__(self, ai_service: AIServicePort, repository: RecipeRepositoryPort):
        self.ai_service = ai_service
        self.repository = repository

    async def execute(self, recipe_id: UUID, category: str) -> dict:
        """Gera sugestões de menu baseado em receita e receitas disponíveis."""
        base_recipe = await self.repository.get_by_id(recipe_id)
        available = await self.repository.list_all()

        base_dict = {"title": base_recipe.title, "category": category}
        available_dicts = [{"title": r.title} for r in available]

        return await self.ai_service.suggest_menu(base_dict, available_dicts)


class ChatCopilotUseCase:
    """Caso de uso: Chat culinário com IA."""

    def __init__(self, ai_service: AIServicePort):
        self.ai_service = ai_service

    async def execute(self, message: str, context: dict | None = None) -> dict:
        """Processa mensagem de chat e retorna resposta tipada."""
        return await self.ai_service.chat(message, context=context)
