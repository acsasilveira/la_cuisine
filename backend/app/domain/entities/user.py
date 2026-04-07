"""Entidade base do domínio para usuários (Pydantic BaseModel, sem ORM)."""
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Entidade base de usuário — campos compartilhados."""

    email: EmailStr
    full_name: str
