"""
🔴 RED: Testes para entidades do domínio.
Estes testes DEVEM falhar até que as entidades sejam implementadas.
"""
from uuid import UUID

import pytest
from pydantic import ValidationError


class TestRecipeBase:
    """Testes para a entidade RecipeBase."""

    def test_criacao_com_dados_validos(self):
        from app.domain.entities.recipe import RecipeBase

        recipe = RecipeBase(
            title="Risotto de Trufa",
            category="main",
            yield_amount=4.0,
            yield_unit="porções",
        )
        assert recipe.title == "Risotto de Trufa"
        assert recipe.category == "main"
        assert recipe.yield_amount == 4.0
        assert recipe.yield_unit == "porções"

    def test_titulo_obrigatorio(self):
        from app.domain.entities.recipe import RecipeBase

        with pytest.raises(ValidationError):
            RecipeBase(
                category="main",
                yield_amount=4.0,
                yield_unit="porções",
            )

    def test_categoria_obrigatoria(self):
        from app.domain.entities.recipe import RecipeBase

        with pytest.raises(ValidationError):
            RecipeBase(
                title="Risotto",
                yield_amount=4.0,
                yield_unit="porções",
            )

    def test_yield_amount_deve_ser_numerico(self):
        from app.domain.entities.recipe import RecipeBase

        with pytest.raises(ValidationError):
            RecipeBase(
                title="Risotto",
                category="main",
                yield_amount="não é número",
                yield_unit="porções",
            )


class TestIngredientBase:
    """Testes para a entidade IngredientBase."""

    def test_criacao_com_nome(self):
        from app.domain.entities.recipe import IngredientBase

        ingredient = IngredientBase(name="Trufa Negra")
        assert ingredient.name == "Trufa Negra"

    def test_nome_obrigatorio(self):
        from app.domain.entities.recipe import IngredientBase

        with pytest.raises(ValidationError):
            IngredientBase()


class TestRecipeIngredientBase:
    """Testes para a entidade RecipeIngredientBase."""

    def test_criacao_com_dados_validos(self):
        from app.domain.entities.recipe import RecipeIngredientBase

        ri = RecipeIngredientBase(
            amount=200.0,
            unit="g",
        )
        assert ri.amount == 200.0
        assert ri.unit == "g"

    def test_notes_opcional(self):
        from app.domain.entities.recipe import RecipeIngredientBase

        ri = RecipeIngredientBase(amount=100.0, unit="ml", notes="fatiado fino")
        assert ri.notes == "fatiado fino"

    def test_sem_notes_retorna_none(self):
        from app.domain.entities.recipe import RecipeIngredientBase

        ri = RecipeIngredientBase(amount=100.0, unit="ml")
        assert ri.notes is None


class TestRecipeStepBase:
    """Testes para a entidade RecipeStepBase."""

    def test_criacao_com_dados_validos(self):
        from app.domain.entities.recipe import RecipeStepBase

        step = RecipeStepBase(step_number=1, instruction="Refogar cebola")
        assert step.step_number == 1
        assert step.instruction == "Refogar cebola"

    def test_step_number_obrigatorio(self):
        from app.domain.entities.recipe import RecipeStepBase

        with pytest.raises(ValidationError):
            RecipeStepBase(instruction="Refogar")

    def test_instruction_obrigatoria(self):
        from app.domain.entities.recipe import RecipeStepBase

        with pytest.raises(ValidationError):
            RecipeStepBase(step_number=1)
