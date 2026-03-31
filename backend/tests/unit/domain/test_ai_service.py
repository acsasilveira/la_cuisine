"""
🔴 RED: Testes unitários para GeminiAIService.
Usa mocks para a API do Gemini.
"""
import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


class TestGeminiAnalyzeImage:
    """Testes para GeminiAIService.analyze_image."""

    async def test_analise_sucesso(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        mock_response = {
            "title": "Bolo de Cenoura",
            "category": "dessert",
            "yield_amount": 12,
            "yield_unit": "fatias",
            "ingredients": [{"name": "Cenoura", "amount": 300, "unit": "g"}],
            "steps": ["Ralar cenoura", "Misturar ingredientes"],
        }

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service, "_call_gemini", new_callable=AsyncMock, return_value=mock_response
        ):
            result = await service.analyze_image(b"fake-image-bytes")

        assert result["title"] == "Bolo de Cenoura"
        assert result["category"] == "dessert"
        assert len(result["ingredients"]) == 1

    async def test_formato_invalido_retorna_erro(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service,
            "_call_gemini",
            new_callable=AsyncMock,
            return_value={"invalid": "data"},
        ):
            with pytest.raises(ValueError, match="formato"):
                await service.analyze_image(b"fake-image-bytes")

    async def test_timeout_retorna_erro(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service,
            "_call_gemini",
            new_callable=AsyncMock,
            side_effect=TimeoutError("Gemini timeout"),
        ):
            with pytest.raises(TimeoutError):
                await service.analyze_image(b"fake-image-bytes")


class TestGeminiSuggestMenu:
    """Testes para GeminiAIService.suggest_menu."""

    async def test_sugestao_sucesso(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        mock_response = {
            "menus": [
                {
                    "entrada": {"name": "Salada", "is_new": False},
                    "principal": {"name": "Frango", "is_new": False},
                    "sobremesa": {"name": "Pudim", "is_new": True},
                    "justificativa": "Menu equilibrado",
                }
            ]
        }

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service, "_call_gemini", new_callable=AsyncMock, return_value=mock_response
        ):
            result = await service.suggest_menu(
                base_recipe={"title": "Frango Grelhado"},
                available_recipes=[{"title": "Salada"}],
            )

        assert "menus" in result
        assert len(result["menus"]) == 1


class TestGeminiChat:
    """Testes para GeminiAIService.chat."""

    async def test_resposta_tipo_text(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        mock_response = {
            "type": "text",
            "data": {"message": "Sugiro usar azeite extra-virgem."},
        }

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service, "_call_gemini", new_callable=AsyncMock, return_value=mock_response
        ):
            result = await service.chat("Que óleo usar?")

        assert result["type"] == "text"
        assert "message" in result["data"]

    async def test_resposta_tipo_recipe(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        mock_response = {
            "type": "recipe",
            "data": {
                "title": "Pasta al Pesto",
                "category": "main",
                "yield_amount": 2,
                "yield_unit": "porções",
                "ingredients": [],
                "steps": [],
            },
        }

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service, "_call_gemini", new_callable=AsyncMock, return_value=mock_response
        ):
            result = await service.chat("Me sugira uma receita italiana")

        assert result["type"] == "recipe"
        assert result["data"]["title"] == "Pasta al Pesto"

    async def test_resposta_tipo_menu(self):
        from app.infrastructure.ai.gemini_service import GeminiAIService

        mock_response = {
            "type": "menu",
            "data": {
                "menus": [
                    {
                        "entrada": {"name": "Bruschetta", "is_new": True},
                        "principal": {"name": "Risotto", "is_new": True},
                        "sobremesa": {"name": "Tiramisu", "is_new": True},
                    }
                ]
            },
        }

        service = GeminiAIService(api_key="fake-key")
        with patch.object(
            service, "_call_gemini", new_callable=AsyncMock, return_value=mock_response
        ):
            result = await service.chat("Monte um menu italiano")

        assert result["type"] == "menu"
