"""Ports (interfaces) para serviços externos do domínio."""
from abc import ABC, abstractmethod


class AIServicePort(ABC):
    """Interface abstrata para o serviço de IA."""

    @abstractmethod
    async def analyze_image(self, image_bytes: bytes) -> dict:
        """Analisa uma imagem e extrai dados de receita."""
        ...

    @abstractmethod
    async def suggest_menu(self, base_recipe: dict, available_recipes: list[dict]) -> dict:
        """Sugere menus baseados em uma receita e receitas disponíveis."""
        ...

    @abstractmethod
    async def chat(self, message: str, context: dict | None = None) -> dict:
        """Processa uma mensagem de chat culinário."""
        ...
