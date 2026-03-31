"""Dependencies de injeção de dependência do FastAPI."""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.database.recipe_repository import RecipeRepository
from app.infrastructure.ai.gemini_service import GeminiAIService


# Será configurado em main.py; placeholder para testes
_engine = None
_session_factory = None


def configure_db(database_url: str):
    """Configura o engine e session factory do banco."""
    global _engine, _session_factory
    _engine = create_async_engine(database_url, echo=False)
    _session_factory = sessionmaker(
        _engine, class_=AsyncSession, expire_on_commit=False
    )


async def get_db_session():
    """Gera uma sessão assíncrona do banco."""
    if _session_factory is None:
        raise RuntimeError("Database not configured. Call configure_db first.")
    async with _session_factory() as session:
        yield session


async def get_recipe_repository(
    session: AsyncSession = None,
) -> RecipeRepository:
    """Retorna instância do repositório de receitas."""
    # Em uso real, será injetado via Depends(get_db_session)
    return RecipeRepository(session)


def get_ai_service() -> GeminiAIService:
    """Retorna instância do serviço de IA."""
    from app.config import settings
    return GeminiAIService(api_key=settings.GEMINI_API_KEY)
