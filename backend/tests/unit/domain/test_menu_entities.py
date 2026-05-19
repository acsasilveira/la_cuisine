"""
Testes unitários para as entidades de Menu.
"""
import pytest
from pydantic import ValidationError
from app.domain.entities.menu import MenuBase, MenuItemBase

class TestMenuBase:
    def test_criacao_menu_valido(self):
        menu = MenuBase(title="Jantar Romântico", occasion="Aniversário")
        assert menu.title == "Jantar Romântico"
        assert menu.occasion == "Aniversário"

    def test_criacao_menu_sem_ocasiao(self):
        menu = MenuBase(title="Almoço Rápido")
        assert menu.title == "Almoço Rápido"
        assert menu.occasion is None

    def test_titulo_obrigatorio(self):
        with pytest.raises(ValidationError):
            MenuBase(occasion="Teste")

class TestMenuItemBase:
    def test_criacao_item_valido(self):
        item = MenuItemBase(category="Entrada", recipe_name="Bruschetta", is_new=True)
        assert item.category == "Entrada"
        assert item.recipe_name == "Bruschetta"
        assert item.is_new is True

    def test_item_is_new_default_false(self):
        item = MenuItemBase(category="Principal", recipe_name="Risotto")
        assert item.is_new is False

    def test_campos_obrigatorios(self):
        with pytest.raises(ValidationError):
            MenuItemBase(category="Sobremesa")
        with pytest.raises(ValidationError):
            MenuItemBase(recipe_name="Pudim")
