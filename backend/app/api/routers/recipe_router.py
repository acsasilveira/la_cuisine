"""Router de receitas — endpoints CRUD e análise de imagem (protegidos por auth)."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.deps import get_db_session, get_ai_service, get_current_user
from app.api.schemas.schemas import RecipeCreate, RecipeUpdate, RecipeResponse, RecipeDraft
from app.application.use_cases.recipe_use_cases import (
    CreateRecipeUseCase,
    GetRecipeByIdUseCase,
    ListRecipesUseCase,
    UpdateRecipeUseCase,
    DeleteRecipeUseCase,
)
from app.application.use_cases.ai_use_cases import AnalyzeImageUseCase
from app.infrastructure.database.models import UserModel
from app.infrastructure.database.recipe_repository import RecipeRepository
from app.infrastructure.ai.gemini_service import GeminiAIService

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=RecipeResponse)
async def create_recipe(
    recipe: RecipeCreate,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Cria uma nova receita vinculada ao usuário autenticado."""
    repo = RecipeRepository(session)
    use_case = CreateRecipeUseCase(repository=repo)
    data = recipe.model_dump()
    data["user_id"] = current_user.id
    result = await use_case.execute(data)
    # Re-fetch com eager loading para incluir ingredients/steps na resposta
    full_recipe = await repo.get_by_id(result.id)
    return full_recipe


@router.get("", response_model=list[RecipeResponse])
async def list_recipes(
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Lista receitas do usuário autenticado."""
    repo = RecipeRepository(session)
    use_case = ListRecipesUseCase(repository=repo)
    return await use_case.execute(user_id=current_user.id)


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: UUID,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Obtém uma receita por ID (apenas se pertencer ao usuário)."""
    repo = RecipeRepository(session)
    use_case = GetRecipeByIdUseCase(repository=repo)
    result = await use_case.execute(recipe_id, user_id=current_user.id)
    if result is None:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return result


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: UUID,
    recipe: RecipeUpdate,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Atualiza uma receita existente do usuário autenticado."""
    repo = RecipeRepository(session)
    use_case = UpdateRecipeUseCase(repository=repo)
    data = recipe.model_dump(exclude_unset=True)
    result = await use_case.execute(recipe_id, data, user_id=current_user.id)
    if result is None:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return result


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: UUID,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Exclui uma receita do usuário autenticado."""
    repo = RecipeRepository(session)
    use_case = DeleteRecipeUseCase(repository=repo)
    deleted = await use_case.execute(recipe_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Receita não encontrada")


@router.post("/analyze-image", response_model=RecipeDraft)
async def analyze_image(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user),
):
    """Analisa uma imagem e extrai dados de receita via IA."""
    # Validar que é imagem
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")

    image_bytes = await file.read()
    ai_service = get_ai_service()
    use_case = AnalyzeImageUseCase(ai_service=ai_service)

    try:
        result = await use_case.execute(image_bytes)
        return RecipeDraft(**result)
    except ValueError:
        raise HTTPException(status_code=502, detail="IA retornou formato inválido")
    except TimeoutError:
        raise HTTPException(status_code=504, detail="IA não respondeu a tempo")
