"""
🔴 RED + 🟢 GREEN: Testes unitários para Use Cases da camada Application.
Usam mocks para repositórios e serviços.
"""
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest


# ============================================================
# CreateRecipeUseCase
# ============================================================

class TestCreateRecipeUseCase:
    async def test_criar_receita_sucesso(self):
        from app.application.use_cases.recipe_use_cases import CreateRecipeUseCase

        mock_repo = AsyncMock()
        mock_repo.create.return_value = MagicMock(
            id=uuid4(), title="Bolo", category="dessert"
        )

        use_case = CreateRecipeUseCase(repository=mock_repo)
        result = await use_case.execute({
            "title": "Bolo",
            "category": "dessert",
            "yield_amount": 12.0,
            "yield_unit": "fatias",
        })

        mock_repo.create.assert_called_once()
        assert result.title == "Bolo"

    async def test_dados_invalidos_levanta_erro(self):
        from app.application.use_cases.recipe_use_cases import CreateRecipeUseCase

        mock_repo = AsyncMock()
        use_case = CreateRecipeUseCase(repository=mock_repo)

        with pytest.raises(ValueError):
            await use_case.execute({})


# ============================================================
# ListRecipesUseCase
# ============================================================

class TestListRecipesUseCase:
    async def test_lista_com_receitas(self):
        from app.application.use_cases.recipe_use_cases import ListRecipesUseCase

        mock_repo = AsyncMock()
        mock_repo.list_all.return_value = [
            MagicMock(title="R1"),
            MagicMock(title="R2"),
        ]

        use_case = ListRecipesUseCase(repository=mock_repo)
        result = await use_case.execute()

        assert len(result) == 2
        mock_repo.list_all.assert_called_once()

    async def test_lista_vazia(self):
        from app.application.use_cases.recipe_use_cases import ListRecipesUseCase

        mock_repo = AsyncMock()
        mock_repo.list_all.return_value = []

        use_case = ListRecipesUseCase(repository=mock_repo)
        result = await use_case.execute()

        assert result == []


# ============================================================
# GetRecipeByIdUseCase
# ============================================================

class TestGetRecipeByIdUseCase:
    async def test_receita_encontrada(self):
        from app.application.use_cases.recipe_use_cases import GetRecipeByIdUseCase

        recipe_id = uuid4()
        mock_repo = AsyncMock()
        mock_repo.get_by_id.return_value = MagicMock(id=recipe_id, title="Feijoada")

        use_case = GetRecipeByIdUseCase(repository=mock_repo)
        result = await use_case.execute(recipe_id)

        assert result is not None
        assert result.title == "Feijoada"

    async def test_receita_nao_encontrada(self):
        from app.application.use_cases.recipe_use_cases import GetRecipeByIdUseCase

        mock_repo = AsyncMock()
        mock_repo.get_by_id.return_value = None

        use_case = GetRecipeByIdUseCase(repository=mock_repo)
        result = await use_case.execute(uuid4())

        assert result is None


# ============================================================
# AnalyzeImageUseCase
# ============================================================

class TestAnalyzeImageUseCase:
    async def test_analise_sucesso(self):
        from app.application.use_cases.ai_use_cases import AnalyzeImageUseCase

        mock_ai = AsyncMock()
        mock_ai.analyze_image.return_value = {
            "title": "Bolo", "category": "dessert",
            "yield_amount": 12, "yield_unit": "fatias",
            "ingredients": [], "steps": [],
        }

        use_case = AnalyzeImageUseCase(ai_service=mock_ai)
        result = await use_case.execute(b"image-bytes")

        assert result["title"] == "Bolo"
        mock_ai.analyze_image.assert_called_once_with(b"image-bytes")

    async def test_ia_falha(self):
        from app.application.use_cases.ai_use_cases import AnalyzeImageUseCase

        mock_ai = AsyncMock()
        mock_ai.analyze_image.side_effect = TimeoutError("timeout")

        use_case = AnalyzeImageUseCase(ai_service=mock_ai)
        with pytest.raises(TimeoutError):
            await use_case.execute(b"image-bytes")


# ============================================================
# SuggestMenuUseCase
# ============================================================

class TestSuggestMenuUseCase:
    async def test_sugestao_sucesso(self):
        from app.application.use_cases.ai_use_cases import SuggestMenuUseCase

        mock_ai = AsyncMock()
        mock_repo = AsyncMock()
        mock_repo.list_all.return_value = [MagicMock(title="Salada")]
        mock_repo.get_by_id.return_value = MagicMock(title="Frango")
        mock_ai.suggest_menu.return_value = {
            "menus": [{"entrada": {"name": "Salada", "is_new": False},
                       "principal": {"name": "Frango", "is_new": False},
                       "sobremesa": {"name": "Pudim", "is_new": True},
                       "justificativa": "Equilibrado"}]
        }

        use_case = SuggestMenuUseCase(ai_service=mock_ai, repository=mock_repo)
        result = await use_case.execute(recipe_id=uuid4(), category="main")

        assert "menus" in result

    async def test_ia_falha(self):
        from app.application.use_cases.ai_use_cases import SuggestMenuUseCase

        mock_ai = AsyncMock()
        mock_repo = AsyncMock()
        mock_repo.list_all.return_value = []
        mock_repo.get_by_id.return_value = MagicMock(title="Teste")
        mock_ai.suggest_menu.side_effect = TimeoutError("timeout")

        use_case = SuggestMenuUseCase(ai_service=mock_ai, repository=mock_repo)
        with pytest.raises(TimeoutError):
            await use_case.execute(recipe_id=uuid4(), category="main")


# ============================================================
# ChatCopilotUseCase
# ============================================================

class TestChatCopilotUseCase:
    async def test_resposta_text(self):
        from app.application.use_cases.ai_use_cases import ChatCopilotUseCase

        mock_ai = AsyncMock()
        mock_ai.chat.return_value = {
            "type": "text", "data": {"message": "Use azeite."}
        }

        use_case = ChatCopilotUseCase(ai_service=mock_ai)
        result = await use_case.execute("Que óleo usar?")

        assert result["type"] == "text"

    async def test_resposta_com_contexto(self):
        from app.application.use_cases.ai_use_cases import ChatCopilotUseCase

        mock_ai = AsyncMock()
        mock_ai.chat.return_value = {
            "type": "recipe", "data": {"title": "Pasta"}
        }

        context = {"previous_messages": ["Oi"]}
        use_case = ChatCopilotUseCase(ai_service=mock_ai)
        result = await use_case.execute("Me sugira algo", context=context)

        mock_ai.chat.assert_called_once_with("Me sugira algo", context=context)


# ============================================================
# LoginUseCase
# ============================================================

class TestLoginUseCase:
    async def test_credenciais_validas(self):
        from app.application.use_cases.auth_use_cases import LoginUseCase
        from app.infrastructure.auth.password import hash_password

        # Mock Repository
        mock_repo = AsyncMock()
        mock_repo.get_by_email.return_value = MagicMock(
            email="chef@lacuisine.com",
            hashed_password=hash_password("senha123")
        )

        use_case = LoginUseCase(
            repository=mock_repo,
            secret="test-secret",
            algorithm="HS256",
        )

        result = await use_case.execute(
            email="chef@lacuisine.com",
            password="senha123",
        )

        assert result is not None
        assert "access_token" in result
        mock_repo.get_by_email.assert_called_once_with("chef@lacuisine.com")

    async def test_credenciais_invalidas(self):
        from app.application.use_cases.auth_use_cases import LoginUseCase
        from app.infrastructure.auth.password import hash_password

        # Mock Repository
        mock_repo = AsyncMock()
        mock_repo.get_by_email.return_value = MagicMock(
            email="chef@lacuisine.com",
            hashed_password=hash_password("senha-certa")
        )

        use_case = LoginUseCase(
            repository=mock_repo,
            secret="test-secret",
            algorithm="HS256",
        )

        result = await use_case.execute(
            email="chef@lacuisine.com",
            password="senha-errada",
        )

        assert result is None

    async def test_usuario_nao_encontrado(self):
        from app.application.use_cases.auth_use_cases import LoginUseCase

        # Mock Repository
        mock_repo = AsyncMock()
        mock_repo.get_by_email.return_value = None

        use_case = LoginUseCase(
            repository=mock_repo,
            secret="test-secret",
            algorithm="HS256",
        )

        result = await use_case.execute(
            email="nao-existe@test.com",
            password="senha",
        )

        assert result is None

