"""Dependencies de injeção de dependência do FastAPI."""
from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.infrastructure.auth.jwt_handler import verify_token
from app.infrastructure.database.models import UserModel
from app.infrastructure.database.recipe_repository import RecipeRepository
from app.infrastructure.database.user_repository import UserRepository
from app.infrastructure.ai.gemini_service import GeminiAIService


# Será configurado em main.py; placeholder para testes
_engine = None
_session_factory = None
_jwt_secret = None
_jwt_algorithm = "HS256"


def configure_db(database_url: str):
    """Configura o engine e session factory do banco."""
    global _engine, _session_factory
    _engine = create_async_engine(database_url, echo=False)
    _session_factory = sessionmaker(
        _engine, class_=AsyncSession, expire_on_commit=False
    )


def configure_auth(jwt_secret: str, jwt_algorithm: str = "HS256"):
    """Configura o secret e algoritmo JWT."""
    global _jwt_secret, _jwt_algorithm
    _jwt_secret = jwt_secret
    _jwt_algorithm = jwt_algorithm


async def get_db_session():
    """Gera uma sessão assíncrona do banco."""
    if _session_factory is None:
        raise RuntimeError("Database not configured. Call configure_db first.")
    async with _session_factory() as session:
        yield session


async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_db_session),
) -> UserModel:
    """Extrai e valida o JWT do cookie 'session', retorna o UserModel."""
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não autenticado",
        )

    payload = verify_token(token, _jwt_secret, _jwt_algorithm)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sessão inválida",
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )

    repo = UserRepository(session)
    user = await repo.get_by_id(UUID(user_id_str))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado",
        )
    return user


async def get_recipe_repository(
    session: AsyncSession = None,
) -> RecipeRepository:
    """Retorna instância do repositório de receitas."""
    return RecipeRepository(session)


def get_ai_service() -> GeminiAIService:
    """Retorna instância do serviço de IA."""
    from app.config import settings
    return GeminiAIService(api_key=settings.GEMINI_API_KEY)

