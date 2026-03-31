"""
🔴 RED: Testes para enums do domínio.
Estes testes DEVEM falhar até que os enums sejam implementados.
"""
import pytest


class TestRecipeCategory:
    """Testes para o enum RecipeCategory."""

    def test_categorias_validas_existem(self):
        from app.domain.enums.recipe_enums import RecipeCategory

        assert RecipeCategory.APPETIZER == "appetizer"
        assert RecipeCategory.MAIN == "main"
        assert RecipeCategory.DESSERT == "dessert"
        assert RecipeCategory.OTHER == "other"

    def test_categoria_invalida_levanta_erro(self):
        from app.domain.enums.recipe_enums import RecipeCategory

        with pytest.raises(ValueError):
            RecipeCategory("inexistente")

    def test_todas_categorias_sao_strings(self):
        from app.domain.enums.recipe_enums import RecipeCategory

        for cat in RecipeCategory:
            assert isinstance(cat.value, str)


class TestTemperatureType:
    """Testes para o enum TemperatureType."""

    def test_temperaturas_validas_existem(self):
        from app.domain.enums.recipe_enums import TemperatureType

        assert TemperatureType.HOT == "hot"
        assert TemperatureType.COLD == "cold"

    def test_temperatura_invalida_levanta_erro(self):
        from app.domain.enums.recipe_enums import TemperatureType

        with pytest.raises(ValueError):
            TemperatureType("morno")


class TestChatResponseType:
    """Testes para o enum ChatResponseType."""

    def test_tipos_validos_existem(self):
        from app.domain.enums.recipe_enums import ChatResponseType

        assert ChatResponseType.TEXT == "text"
        assert ChatResponseType.RECIPE == "recipe"
        assert ChatResponseType.MENU == "menu"

    def test_tipo_invalido_levanta_erro(self):
        from app.domain.enums.recipe_enums import ChatResponseType

        with pytest.raises(ValueError):
            ChatResponseType("video")
