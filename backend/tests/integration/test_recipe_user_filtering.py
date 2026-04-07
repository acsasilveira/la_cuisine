"""
Testes de integração para RecipeRepository com filtragem por user_id.
Testes com banco SQLite in-memory.
"""
import pytest
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel


@pytest.fixture
async def async_session():
    """Cria sessão async com SQLite in-memory para testes."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///",
        echo=False,
    )
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async_session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session_factory() as session:
        yield session

    await engine.dispose()


class TestRecipeRepositoryUserFiltering:
    """Testes para RecipeRepository filtrando por user_id."""

    @pytest.mark.asyncio
    async def test_criar_receita_com_user_id(self, async_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        from app.infrastructure.database.user_repository import UserRepository

        # Criar usuário
        user_repo = UserRepository(async_session)
        user = await user_repo.create({
            "email": "chef@test.com",
            "full_name": "Chef Teste",
            "hashed_password": "hashed123",
        })

        # Criar receita vinculada ao usuário
        recipe_repo = RecipeRepository(async_session)
        recipe = await recipe_repo.create({
            "title": "Bolo do Chef",
            "category": "dessert",
            "yield_amount": 10,
            "yield_unit": "fatias",
            "user_id": user.id,
        })
        assert recipe.user_id == user.id

    @pytest.mark.asyncio
    async def test_list_all_filtra_por_user_id(self, async_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        from app.infrastructure.database.user_repository import UserRepository

        # Criar dois usuários
        user_repo = UserRepository(async_session)
        user_a = await user_repo.create({
            "email": "chef_a@test.com",
            "full_name": "Chef A",
            "hashed_password": "hashed_a",
        })
        user_b = await user_repo.create({
            "email": "chef_b@test.com",
            "full_name": "Chef B",
            "hashed_password": "hashed_b",
        })

        # Criar receitas de cada usuário
        recipe_repo = RecipeRepository(async_session)
        await recipe_repo.create({
            "title": "Receita A1",
            "category": "main",
            "yield_amount": 4,
            "yield_unit": "porções",
            "user_id": user_a.id,
        })
        await recipe_repo.create({
            "title": "Receita A2",
            "category": "dessert",
            "yield_amount": 8,
            "yield_unit": "fatias",
            "user_id": user_a.id,
        })
        await recipe_repo.create({
            "title": "Receita B1",
            "category": "appetizer",
            "yield_amount": 2,
            "yield_unit": "porções",
            "user_id": user_b.id,
        })

        # Listar receitas do user A
        recipes_a = await recipe_repo.list_all(user_id=user_a.id)
        assert len(recipes_a) == 2
        assert all(r.user_id == user_a.id for r in recipes_a)

        # Listar receitas do user B
        recipes_b = await recipe_repo.list_all(user_id=user_b.id)
        assert len(recipes_b) == 1
        assert recipes_b[0].title == "Receita B1"

        # Listar sem filtro retorna todas
        all_recipes = await recipe_repo.list_all()
        assert len(all_recipes) == 3

    @pytest.mark.asyncio
    async def test_get_by_id_filtra_por_user_id(self, async_session):
        from app.infrastructure.database.recipe_repository import RecipeRepository
        from app.infrastructure.database.user_repository import UserRepository

        # Criar dois usuários
        user_repo = UserRepository(async_session)
        user_a = await user_repo.create({
            "email": "chef_a@filter.com",
            "full_name": "Chef A",
            "hashed_password": "hashed_a",
        })
        user_b = await user_repo.create({
            "email": "chef_b@filter.com",
            "full_name": "Chef B",
            "hashed_password": "hashed_b",
        })

        # Criar receita do user A
        recipe_repo = RecipeRepository(async_session)
        recipe = await recipe_repo.create({
            "title": "Receita Secreta do A",
            "category": "main",
            "yield_amount": 4,
            "yield_unit": "porções",
            "user_id": user_a.id,
        })

        # User A pode ver a receita
        result = await recipe_repo.get_by_id(recipe.id, user_id=user_a.id)
        assert result is not None
        assert result.title == "Receita Secreta do A"

        # User B NÃO pode ver a receita do A
        result = await recipe_repo.get_by_id(recipe.id, user_id=user_b.id)
        assert result is None

        # Sem filtro de user, qualquer um pode ver
        result = await recipe_repo.get_by_id(recipe.id)
        assert result is not None
