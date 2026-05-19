"""
Testes de integração para MenuRepository.
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from uuid import uuid4

from app.infrastructure.database.models import (
    MenuModel,
    MenuItemModel,
    UserModel,
)
from app.infrastructure.database.menu_repository import MenuRepository

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

class TestMenuRepository:
    async def test_criar_menu_com_itens(self, integration_session):
        repo = MenuRepository(integration_session)
        user_id = uuid4()
        menu = await repo.create({
            "title": "Menu de Domingo",
            "occasion": "Almoço em Família",
            "user_id": user_id,
            "items": [
                {"category": "entrada", "recipe_name": "Salada", "is_new": False},
                {"category": "principal", "recipe_name": "Feijoada", "is_new": True},
            ]
        })

        assert menu.id is not None
        assert menu.title == "Menu de Domingo"
        
        # Refetch para garantir que items estão carregados (evitar MissingGreenlet)
        full_menu = await repo.get_by_id(menu.id)
        assert len(full_menu.items) == 2
        assert full_menu.items[0].recipe_name == "Salada"
        assert full_menu.user_id == user_id

    async def test_get_by_id_com_itens(self, integration_session):
        repo = MenuRepository(integration_session)
        created = await repo.create({
            "title": "Menu Especial",
            "items": [{"category": "sobremesa", "recipe_name": "Pudim"}]
        })

        found = await repo.get_by_id(created.id)
        assert found is not None
        assert found.title == "Menu Especial"
        assert len(found.items) == 1

    async def test_list_all_filtrado_por_usuario(self, integration_session):
        repo = MenuRepository(integration_session)
        user1 = uuid4()
        user2 = uuid4()
        
        await repo.create({"title": "Menu User 1", "user_id": user1})
        await repo.create({"title": "Menu User 2", "user_id": user2})

        list1 = await repo.list_all(user_id=user1)
        assert len(list1) == 1
        assert list1[0].title == "Menu User 1"

        list_all = await repo.list_all()
        assert len(list_all) == 2

    async def test_delete_menu_e_itens(self, integration_session):
        repo = MenuRepository(integration_session)
        menu = await repo.create({
            "title": "Menu para Deletar",
            "items": [{"category": "x", "recipe_name": "y"}]
        })
        
        success = await repo.delete(menu.id)
        assert success is True
        
        found = await repo.get_by_id(menu.id)
        assert found is None
