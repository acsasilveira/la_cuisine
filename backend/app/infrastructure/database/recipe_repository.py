"""Implementação concreta do RecipeRepositoryPort usando SQLModel."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.ports.repository_ports import RecipeRepositoryPort
from app.infrastructure.database.models import (
    IngredientModel,
    RecipeIngredientModel,
    RecipeModel,
    RecipeStepModel,
)


class RecipeRepository(RecipeRepositoryPort):
    """Repositório de receitas usando SQLModel/SQLAlchemy async."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, recipe_data: dict) -> RecipeModel:
        """Cria uma nova receita com ingredientes e passos."""
        ingredients_data = recipe_data.pop("ingredients", [])
        steps_data = recipe_data.pop("steps", [])

        recipe = RecipeModel(**recipe_data)
        self.session.add(recipe)
        await self.session.flush()

        # Criar ingredientes e associações
        for ing_data in ingredients_data:
            ingredient_name = ing_data.pop("name")
            # Buscar ou criar ingrediente
            stmt = select(IngredientModel).where(
                IngredientModel.name == ingredient_name
            )
            result = await self.session.execute(stmt)
            ingredient = result.scalar_one_or_none()

            if not ingredient:
                ingredient = IngredientModel(name=ingredient_name)
                self.session.add(ingredient)
                await self.session.flush()

            recipe_ingredient = RecipeIngredientModel(
                recipe_id=recipe.id,
                ingredient_id=ingredient.id,
                **ing_data,
            )
            self.session.add(recipe_ingredient)

        # Criar passos
        for step_data in steps_data:
            step = RecipeStepModel(recipe_id=recipe.id, **step_data)
            self.session.add(step)

        await self.session.commit()
        await self.session.refresh(recipe)
        return recipe

    async def get_by_id(self, recipe_id: UUID) -> RecipeModel | None:
        """Busca uma receita por ID com ingredientes e passos."""
        stmt = (
            select(RecipeModel)
            .where(RecipeModel.id == recipe_id)
            .options(
                selectinload(RecipeModel.ingredients).selectinload(
                    RecipeIngredientModel.ingredient
                ),
                selectinload(RecipeModel.steps),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[RecipeModel]:
        """Lista todas as receitas."""
        stmt = select(RecipeModel).order_by(RecipeModel.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
