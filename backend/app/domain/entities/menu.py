"""Entidade base do domínio para menus (Pydantic BaseModel, sem ORM)."""
from pydantic import BaseModel


class MenuBase(BaseModel):
    """Entidade base de menu — campos compartilhados."""

    title: str
    occasion: str | None = None


class MenuItemBase(BaseModel):
    """Entidade base de item de menu."""

    category: str
    recipe_name: str
    is_new: bool = False
