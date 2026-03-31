"""
🔴 RED: Testes para ports (interfaces) do domínio.
Estes testes DEVEM falhar até que os ports sejam implementados.
"""
import inspect
from abc import ABC

import pytest


class TestRecipeRepositoryPort:
    """Testes para a interface RecipeRepositoryPort."""

    def test_e_classe_abstrata(self):
        from app.domain.ports.repository_ports import RecipeRepositoryPort

        assert issubclass(RecipeRepositoryPort, ABC)

    def test_possui_metodo_create(self):
        from app.domain.ports.repository_ports import RecipeRepositoryPort

        assert hasattr(RecipeRepositoryPort, "create")
        assert inspect.iscoroutinefunction(RecipeRepositoryPort.create) or \
            getattr(RecipeRepositoryPort.create, "__isabstractmethod__", False)

    def test_possui_metodo_get_by_id(self):
        from app.domain.ports.repository_ports import RecipeRepositoryPort

        assert hasattr(RecipeRepositoryPort, "get_by_id")

    def test_possui_metodo_list_all(self):
        from app.domain.ports.repository_ports import RecipeRepositoryPort

        assert hasattr(RecipeRepositoryPort, "list_all")

    def test_nao_pode_instanciar_diretamente(self):
        from app.domain.ports.repository_ports import RecipeRepositoryPort

        with pytest.raises(TypeError):
            RecipeRepositoryPort()


class TestAIServicePort:
    """Testes para a interface AIServicePort."""

    def test_e_classe_abstrata(self):
        from app.domain.ports.service_ports import AIServicePort

        assert issubclass(AIServicePort, ABC)

    def test_possui_metodo_analyze_image(self):
        from app.domain.ports.service_ports import AIServicePort

        assert hasattr(AIServicePort, "analyze_image")

    def test_possui_metodo_suggest_menu(self):
        from app.domain.ports.service_ports import AIServicePort

        assert hasattr(AIServicePort, "suggest_menu")

    def test_possui_metodo_chat(self):
        from app.domain.ports.service_ports import AIServicePort

        assert hasattr(AIServicePort, "chat")

    def test_nao_pode_instanciar_diretamente(self):
        from app.domain.ports.service_ports import AIServicePort

        with pytest.raises(TypeError):
            AIServicePort()
