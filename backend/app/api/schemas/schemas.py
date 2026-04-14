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
    cost_per_serving: float | None = None
    total_cost: float | None = None


class RecipeUpdate(BaseModel):
    """Schema para atualizar uma receita (todos os campos opcionais)."""
    title: str | None = None
    category: str | None = None
    yield_amount: float | None = None
    yield_unit: str | None = None
    prep_time_minutes: int | None = None
    style: str | None = None
    cost_per_serving: float | None = None
    total_cost: float | None = None
    ingredients: list[RecipeIngredientCreate] | None = None
    steps: list[RecipeStepCreate] | None = None


class IngredientInfo(BaseModel):
    """Schema de informação de ingrediente (nome)."""
    name: str

    model_config = {"from_attributes": True}


class RecipeIngredientResponse(BaseModel):
    """Schema de resposta de ingrediente de receita."""
    amount: float
    unit: str
    notes: str | None = None
    cost_per_unit: float | None = None
    ingredient: IngredientInfo | None = None

    model_config = {"from_attributes": True}


class RecipeStepResponse(BaseModel):
    """Schema de resposta de passo de receita."""
    step_number: int
    instruction: str

    model_config = {"from_attributes": True}


class RecipeResponse(RecipeBase):
    """Schema de resposta de receita."""
    id: UUID
    created_at: datetime
    cost_per_serving: float | None = None
    total_cost: float | None = None
    ingredients: list[RecipeIngredientResponse] = []
    steps: list[RecipeStepResponse] = []

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
    """Schema de resposta de menu (sugestão IA)."""
    menus: list[MenuEntry]


# ---- Menu CRUD Schemas ----

class MenuItemCreate(BaseModel):
    """Schema para criar item de menu."""
    category: str
    recipe_name: str
    is_new: bool = False


class MenuCreate(BaseModel):
    """Schema para criar um menu persistível."""
    title: str
    occasion: str | None = None
    items: list[MenuItemCreate] = []


class MenuItemResponse(BaseModel):
    """Schema de resposta de item de menu."""
    id: UUID
    category: str
    recipe_name: str
    is_new: bool

    model_config = {"from_attributes": True}


class MenuFullResponse(BaseModel):
    """Schema de resposta completa de menu."""
    id: UUID
    title: str
    occasion: str | None = None
    created_at: datetime
    items: list[MenuItemResponse] = []

    model_config = {"from_attributes": True}


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

class RegisterRequest(BaseModel):
    """Schema de requisição de registro."""
    email: str
    password: str
    full_name: str


class LoginRequest(BaseModel):
    """Schema de requisição de login."""
    email: str
    password: str


class UserResponse(BaseModel):
    """Schema de resposta com dados do usuário (sem senha)."""
    id: UUID
    email: str
    full_name: str
    phone: str | None = None
    location: str | None = None
    specialty: str | None = None

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    """Schema para atualizar perfil do usuário."""
    full_name: str | None = None
    phone: str | None = None
    location: str | None = None
    specialty: str | None = None


class MessageResponse(BaseModel):
    """Schema genérico de resposta com mensagem."""
    message: str
