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

    async def get_by_id(self, recipe_id: UUID, user_id: UUID | None = None) -> RecipeModel | None:
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
        if user_id is not None:
            stmt = stmt.where(RecipeModel.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self, user_id: UUID | None = None) -> list[RecipeModel]:
        """Lista receitas com ingredientes e passos, opcionalmente filtrando por user."""
        stmt = (
            select(RecipeModel)
            .options(
                selectinload(RecipeModel.ingredients).selectinload(
                    RecipeIngredientModel.ingredient
                ),
                selectinload(RecipeModel.steps),
            )
            .order_by(RecipeModel.created_at.desc())
        )
        if user_id is not None:
            stmt = stmt.where(RecipeModel.user_id == user_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, recipe_id: UUID, data: dict, user_id: UUID | None = None) -> RecipeModel | None:
        """Atualiza uma receita existente."""
        recipe = await self.get_by_id(recipe_id, user_id=user_id)
        if not recipe:
            return None

        # Atualizar campos simples
        simple_fields = {
            "title", "category", "yield_amount", "yield_unit",
            "prep_time_minutes", "temperature_type", "style", "image_url",
            "cost_per_serving", "total_cost",
        }
        for key, value in data.items():
            if key in simple_fields:
                setattr(recipe, key, value)

        # Atualizar ingredientes se fornecidos
        if "ingredients" in data:
            # Remover ingredientes antigos
            for ri in recipe.ingredients:
                await self.session.delete(ri)
            await self.session.flush()

            # Criar novos ingredientes
            for ing_data in data["ingredients"]:
                ingredient_name = ing_data.pop("name", ing_data.get("name"))
                if "name" in ing_data:
                    ingredient_name = ing_data.pop("name")

                stmt = select(IngredientModel).where(IngredientModel.name == ingredient_name)
                result = await self.session.execute(stmt)
                ingredient = result.scalar_one_or_none()

                if not ingredient:
                    ingredient = IngredientModel(name=ingredient_name)
                    self.session.add(ingredient)
                    await self.session.flush()

                recipe_ingredient = RecipeIngredientModel(
                    recipe_id=recipe.id,
                    ingredient_id=ingredient.id,
                    amount=ing_data.get("amount", 0),
                    unit=ing_data.get("unit", ""),
                    notes=ing_data.get("notes"),
                    cost_per_unit=ing_data.get("cost_per_unit"),
                )
                self.session.add(recipe_ingredient)

        # Atualizar passos se fornecidos
        if "steps" in data:
            for step in recipe.steps:
                await self.session.delete(step)
            await self.session.flush()

            for step_data in data["steps"]:
                step = RecipeStepModel(recipe_id=recipe.id, **step_data)
                self.session.add(step)

        await self.session.commit()
        return await self.get_by_id(recipe_id, user_id=user_id)

    async def delete(self, recipe_id: UUID, user_id: UUID | None = None) -> bool:
        """Deleta uma receita por ID."""
        recipe = await self.get_by_id(recipe_id, user_id=user_id)
        if not recipe:
            return False

        # Deletar ingredientes e passos associados
        for ri in recipe.ingredients:
            await self.session.delete(ri)
        for step in recipe.steps:
            await self.session.delete(step)

        await self.session.delete(recipe)
        await self.session.commit()
        return True
