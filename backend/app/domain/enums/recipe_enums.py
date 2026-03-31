"""Enums do domínio LaCuisine."""
from enum import Enum


class RecipeCategory(str, Enum):
    """Categorias de receitas."""

    APPETIZER = "appetizer"
    MAIN = "main"
    DESSERT = "dessert"
    OTHER = "other"


class TemperatureType(str, Enum):
    """Tipo de temperatura do prato."""

    HOT = "hot"
    COLD = "cold"


class ChatResponseType(str, Enum):
    """Tipos de resposta do chat copiloto."""

    TEXT = "text"
    RECIPE = "recipe"
    MENU = "menu"
