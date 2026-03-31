"""Router de menus — endpoint de sugestão de menu com IA."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.deps import get_db_session, get_ai_service
from app.api.schemas.schemas import MenuSuggestRequest, MenuResponse
from app.application.use_cases.ai_use_cases import SuggestMenuUseCase
from app.infrastructure.database.recipe_repository import RecipeRepository

router = APIRouter(prefix="/api/menus", tags=["menus"])


@router.post("/suggest", response_model=MenuResponse)
async def suggest_menu(
    request: MenuSuggestRequest,
    session: AsyncSession = Depends(get_db_session),
):
    """Gera sugestão de menu com IA baseado em receitas disponíveis."""
    repo = RecipeRepository(session)
    ai_service = get_ai_service()
    use_case = SuggestMenuUseCase(ai_service=ai_service, repository=repo)

    try:
        result = await use_case.execute(
            recipe_id=request.recipe_id,
            category=request.category,
        )
        return MenuResponse(**result)
    except ValueError:
        raise HTTPException(status_code=502, detail="IA retornou formato inválido")
    except TimeoutError:
        raise HTTPException(status_code=504, detail="IA não respondeu a tempo")
