"""Entidades base do domínio LaCuisine (Pydantic BaseModel, sem ORM)."""
from pydantic import BaseModel


class RecipeBase(BaseModel):
    """Entidade base de receita — campos compartilhados."""

    title: str
    category: str
    yield_amount: float
    yield_unit: str


class IngredientBase(BaseModel):
    """Entidade base de ingrediente."""

    name: str


class RecipeIngredientBase(BaseModel):
    """Entidade base de ingrediente de receita (relação N:N)."""

    amount: float
    unit: str
    notes: str | None = None


class RecipeStepBase(BaseModel):
    """Entidade base de passo de receita."""

    step_number: int
    instruction: str
