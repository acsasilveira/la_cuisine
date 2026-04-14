"""Implementação concreta do repositório de menus usando SQLModel."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.database.models import MenuModel, MenuItemModel


class MenuRepository:
    """Repositório de menus usando SQLModel/SQLAlchemy async."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, menu_data: dict) -> MenuModel:
        """Cria um novo menu com seus itens."""
        items_data = menu_data.pop("items", [])

        menu = MenuModel(**menu_data)
        self.session.add(menu)
        await self.session.flush()

        for item_data in items_data:
            item = MenuItemModel(menu_id=menu.id, **item_data)
            self.session.add(item)

        await self.session.commit()
        await self.session.refresh(menu)
        return menu

    async def get_by_id(self, menu_id: UUID, user_id: UUID | None = None) -> MenuModel | None:
        """Busca um menu por ID com seus itens."""
        stmt = (
            select(MenuModel)
            .where(MenuModel.id == menu_id)
            .options(selectinload(MenuModel.items))
        )
        if user_id is not None:
            stmt = stmt.where(MenuModel.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self, user_id: UUID | None = None) -> list[MenuModel]:
        """Lista menus, opcionalmente filtrando por usuário."""
        stmt = (
            select(MenuModel)
            .options(selectinload(MenuModel.items))
            .order_by(MenuModel.created_at.desc())
        )
        if user_id is not None:
            stmt = stmt.where(MenuModel.user_id == user_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def delete(self, menu_id: UUID, user_id: UUID | None = None) -> bool:
        """Deleta um menu por ID."""
        menu = await self.get_by_id(menu_id, user_id=user_id)
        if not menu:
            return False

        for item in menu.items:
            await self.session.delete(item)
        await self.session.delete(menu)
        await self.session.commit()
        return True
