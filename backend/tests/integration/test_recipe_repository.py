"""
🔴 RED: Testes de integração para RecipeRepository.
Usa SQLite async em memória para não depender de PostgreSQL nos testes.
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from uuid import uuid4

# IMPORTANTE: Importar modelos para registrar na metadata do SQLModel
from app.infrastructure.database.models import (  # noqa: F401
    RecipeModel,
    IngredientModel,
    RecipeIngredientModel,
    RecipeStepModel,
)


@pytest.fixture
async def integration_engine():
    """Engine de teste com SQLite async."""
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def integration_session(integration_engine):
    """Sessão de teste com rollback."""
    async_session = sessionmaker(
        integration_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session


class TestRecipeRepositoryCreate:
    """Testes de integração para RecipeRepository.create."""

    async def test_criar_receita_simples(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        recipe = await repo.create({
            "title": "Bolo de Chocolate",
            "category": "dessert",
            "yield_amount": 12.0,
            "yield_unit": "fatias",
        })

        assert recipe.id is not None
        assert recipe.title == "Bolo de Chocolate"
        assert recipe.category == "dessert"
        assert recipe.yield_amount == 12.0

    async def test_criar_receita_com_ingredientes(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        recipe = await repo.create({
            "title": "Salada Caesar",
            "category": "appetizer",
            "yield_amount": 2.0,
            "yield_unit": "porções",
            "ingredients": [
                {"name": "Alface", "amount": 200.0, "unit": "g"},
                {"name": "Croutons", "amount": 50.0, "unit": "g"},
            ],
        })

        assert recipe.id is not None
        assert recipe.title == "Salada Caesar"

    async def test_criar_receita_com_passos(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        recipe = await repo.create({
            "title": "Arroz Branco",
            "category": "main",
            "yield_amount": 4.0,
            "yield_unit": "porções",
            "steps": [
                {"step_number": 1, "instruction": "Lavar o arroz"},
                {"step_number": 2, "instruction": "Refogar com alho"},
            ],
        })

        assert recipe.id is not None


class TestRecipeRepositoryGetById:
    """Testes de integração para RecipeRepository.get_by_id."""

    async def test_receita_encontrada(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        created = await repo.create({
            "title": "Feijoada",
            "category": "main",
            "yield_amount": 8.0,
            "yield_unit": "porções",
        })

        found = await repo.get_by_id(created.id)
        assert found is not None
        assert found.id == created.id
        assert found.title == "Feijoada"

    async def test_receita_nao_encontrada(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        found = await repo.get_by_id(uuid4())
        assert found is None



class TestRecipeRepositoryListAll:
    """Testes de integração para RecipeRepository.list_all."""

    async def test_lista_vazia(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        recipes = await repo.list_all()
        assert recipes == []

    async def test_lista_com_receitas(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository

        repo = RecipeRepository(integration_session)
        await repo.create({
            "title": "Receita 1",
            "category": "main",
            "yield_amount": 4.0,
            "yield_unit": "porções",
        })
        await repo.create({
            "title": "Receita 2",
            "category": "dessert",
            "yield_amount": 6.0,
            "yield_unit": "fatias",
        })

        recipes = await repo.list_all()
        assert len(recipes) == 2

    async def test_lista_filtrada_por_usuario(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        repo = RecipeRepository(integration_session)
        u1, u2 = uuid4(), uuid4()
        
        await repo.create({"title": "R1", "category": "main", "yield_amount": 1, "yield_unit": "u", "user_id": u1})
        await repo.create({"title": "R2", "category": "main", "yield_amount": 1, "yield_unit": "u", "user_id": u2})
        
        filtered = await repo.list_all(user_id=u1)
        assert len(filtered) == 1
        assert filtered[0].title == "R1"


class TestRecipeRepositoryUpdate:
    """Testes de integração para RecipeRepository.update."""

    async def test_update_campos_simples(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        repo = RecipeRepository(integration_session)
        recipe = await repo.create({"title": "Old", "category": "main", "yield_amount": 1, "yield_unit": "u"})
        
        updated = await repo.update(recipe.id, {"title": "New Title", "yield_amount": 5.0})
        assert updated.title == "New Title"
        assert updated.yield_amount == 5.0

    async def test_update_receita_inexistente_retorna_none(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        repo = RecipeRepository(integration_session)
        result = await repo.update(uuid4(), {"title": "X"})
        assert result is None


class TestRecipeRepositoryDelete:
    """Testes de integração para RecipeRepository.delete."""

    async def test_delete_sucesso(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        repo = RecipeRepository(integration_session)
        recipe = await repo.create({"title": "Delete me", "category": "main", "yield_amount": 1, "yield_unit": "u"})
        
        result = await repo.delete(recipe.id)
        assert result is True
        
        found = await repo.get_by_id(recipe.id)
        assert found is None

    async def test_delete_id_inexistente_retorna_false(self, integration_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        repo = RecipeRepository(integration_session)
        result = await repo.delete(uuid4())
        assert result is False
