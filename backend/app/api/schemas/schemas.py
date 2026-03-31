"""Schemas Pydantic para request/response da API de receitas."""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.recipe import (
    IngredientBase,
    RecipeBase,
    RecipeIngredientBase,
    RecipeStepBase,
)


# ---- Recipe Schemas ----

class RecipeIngredientCreate(BaseModel):
    """Schema para criar ingrediente de receita."""
    name: str
    amount: float
    unit: str
    notes: str | None = None


class RecipeStepCreate(BaseModel):
    """Schema para criar passo de receita."""
    step_number: int
    instruction: str


class RecipeCreate(RecipeBase):
    """Schema para criar uma receita."""
    ingredients: list[RecipeIngredientCreate] = []
    steps: list[RecipeStepCreate] = []


class RecipeResponse(RecipeBase):
    """Schema de resposta de receita."""
    id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class RecipeDraft(BaseModel):
    """Schema de rascunho de receita (retornado pela IA)."""
    title: str
    category: str
    yield_amount: float
    yield_unit: str
    ingredients: list[dict] = []
    steps: list[str] = []


# ---- Menu Schemas ----

class MenuSuggestRequest(BaseModel):
    """Schema de requisição para sugestão de menu."""
    recipe_id: UUID
    category: str


class MenuItem(BaseModel):
    """Schema de item de menu."""
    name: str
    is_new: bool


class MenuEntry(BaseModel):
    """Schema de entrada de menu."""
    entrada: MenuItem
    principal: MenuItem
    sobremesa: MenuItem
    justificativa: str = ""


class MenuResponse(BaseModel):
    """Schema de resposta de menu."""
    menus: list[MenuEntry]


# ---- Chat Schemas ----

class ChatRequest(BaseModel):
    """Schema de requisição de chat."""
    message: str
    context: dict | None = None


class ChatResponse(BaseModel):
    """Schema de resposta de chat."""
    type: str
    data: dict


# ---- Auth Schemas ----

class LoginRequest(BaseModel):
    """Schema de requisição de login."""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Schema de resposta de token."""
    access_token: str
    token_type: str = "bearer"
