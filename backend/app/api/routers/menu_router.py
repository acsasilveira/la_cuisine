"""Router de menus — endpoints CRUD e sugestão de menu com IA (protegidos por auth)."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.deps import get_db_session, get_ai_service, get_current_user
from app.api.schemas.schemas import (
    MenuSuggestRequest,
    MenuResponse,
    MenuCreate,
    MenuFullResponse,
)
from app.application.use_cases.ai_use_cases import SuggestMenuUseCase
from app.application.use_cases.menu_use_cases import (
    CreateMenuUseCase,
    ListMenusUseCase,
    GetMenuByIdUseCase,
    DeleteMenuUseCase,
)
from app.infrastructure.database.models import UserModel
from app.infrastructure.database.recipe_repository import RecipeRepository
from app.infrastructure.database.menu_repository import MenuRepository

router = APIRouter(prefix="/api/menus", tags=["menus"])


# ---- CRUD de Menus ----

@router.post("", status_code=status.HTTP_201_CREATED, response_model=MenuFullResponse)
async def create_menu(
    menu: MenuCreate,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Cria um novo menu vinculado ao usuário autenticado."""
    repo = MenuRepository(session)
    use_case = CreateMenuUseCase(repository=repo)
    data = menu.model_dump()
    data["user_id"] = current_user.id
    result = await use_case.execute(data)
    return await repo.get_by_id(result.id)


@router.get("", response_model=list[MenuFullResponse])
async def list_menus(
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Lista menus do usuário autenticado."""
    repo = MenuRepository(session)
    use_case = ListMenusUseCase(repository=repo)
    return await use_case.execute(user_id=current_user.id)


@router.get("/{menu_id}", response_model=MenuFullResponse)
async def get_menu(
    menu_id: UUID,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Obtém um menu por ID."""
    repo = MenuRepository(session)
    use_case = GetMenuByIdUseCase(repository=repo)
    result = await use_case.execute(menu_id, user_id=current_user.id)
    if result is None:
        raise HTTPException(status_code=404, detail="Menu não encontrado")
    return result


@router.delete("/{menu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu(
    menu_id: UUID,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Exclui um menu do usuário autenticado."""
    repo = MenuRepository(session)
    use_case = DeleteMenuUseCase(repository=repo)
    deleted = await use_case.execute(menu_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Menu não encontrado")


# ---- Sugestão de Menu via IA ----

@router.post("/suggest", response_model=MenuResponse)
async def suggest_menu(
    request: MenuSuggestRequest,
    current_user: UserModel = Depends(get_current_user),
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
