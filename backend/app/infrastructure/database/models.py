"""Modelos SQLModel para o banco de dados PostgreSQL."""
from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from app.domain.entities.recipe import (
    IngredientBase,
    RecipeBase,
    RecipeIngredientBase,
    RecipeStepBase,
)
from app.domain.entities.user import UserBase
from app.domain.enums.recipe_enums import TemperatureType


class UserModel(UserBase, SQLModel, table=True):
    """Modelo de usuário no banco de dados."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True)
    hashed_password: str
    phone: str | None = None
    location: str | None = None
    specialty: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    recipes: list["RecipeModel"] = Relationship(back_populates="owner")


class RecipeModel(RecipeBase, SQLModel, table=True):
    """Modelo de receita no banco de dados."""

    __tablename__ = "recipes"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID | None = Field(default=None, foreign_key="users.id")
    prep_time_minutes: int | None = None
    temperature_type: TemperatureType | None = None
    style: str | None = None
    image_url: str | None = None
    cost_per_serving: float | None = None
    total_cost: float | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    owner: UserModel | None = Relationship(back_populates="recipes")
    ingredients: list["RecipeIngredientModel"] = Relationship(back_populates="recipe")
    steps: list["RecipeStepModel"] = Relationship(back_populates="recipe")


class IngredientModel(IngredientBase, SQLModel, table=True):
    """Modelo de ingrediente no banco de dados."""

    __tablename__ = "ingredients"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True)

    # Relationships
    recipe_ingredients: list["RecipeIngredientModel"] = Relationship(
        back_populates="ingredient"
    )


class RecipeIngredientModel(RecipeIngredientBase, SQLModel, table=True):
    """Modelo de associação receita-ingrediente no banco de dados."""

    __tablename__ = "recipe_ingredients"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    recipe_id: UUID = Field(foreign_key="recipes.id")
    ingredient_id: UUID = Field(foreign_key="ingredients.id")
    cost_per_unit: float | None = None

    # Relationships
    recipe: RecipeModel | None = Relationship(back_populates="ingredients")
    ingredient: IngredientModel | None = Relationship(
        back_populates="recipe_ingredients"
    )


class RecipeStepModel(RecipeStepBase, SQLModel, table=True):
    """Modelo de passo de receita no banco de dados."""

    __tablename__ = "recipe_steps"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    recipe_id: UUID = Field(foreign_key="recipes.id")

    # Relationships
    recipe: RecipeModel | None = Relationship(back_populates="steps")


class MenuModel(SQLModel, table=True):
    """Modelo de menu no banco de dados."""

    __tablename__ = "menus"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    occasion: str | None = None
    user_id: UUID | None = Field(default=None, foreign_key="users.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    items: list["MenuItemModel"] = Relationship(back_populates="menu")


class MenuItemModel(SQLModel, table=True):
    """Modelo de item de menu no banco de dados."""

    __tablename__ = "menu_items"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    menu_id: UUID = Field(foreign_key="menus.id")
    category: str
    recipe_name: str
    is_new: bool = False

    # Relationships
    menu: MenuModel | None = Relationship(back_populates="items")
