"""Modelos SQLModel para o banco de dados PostgreSQL."""
from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from app.domain.entities.recipe import (
    IngredientBase,
    RecipeBase,
    RecipeIngredientBase,
    RecipeStepBase,
)


class RecipeModel(RecipeBase, SQLModel, table=True):
    """Modelo de receita no banco de dados."""

    __tablename__ = "recipes"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    prep_time_minutes: int | None = None
    temperature_type: str | None = None
    style: str | None = None
    image_url: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
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
