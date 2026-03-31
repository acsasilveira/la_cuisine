"""Configuração da sessão assíncrona do banco de dados."""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)

async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_async_session() -> AsyncSession:  # type: ignore[misc]
    """Gera uma sessão assíncrona do banco de dados."""
    async with async_session_factory() as session:
        yield session
