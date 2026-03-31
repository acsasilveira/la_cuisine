"""Router de receitas — endpoints CRUD e análise de imagem."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.deps import get_db_session, get_ai_service
from app.api.schemas.schemas import RecipeCreate, RecipeResponse, RecipeDraft
from app.application.use_cases.recipe_use_cases import (
    CreateRecipeUseCase,
    GetRecipeByIdUseCase,
    ListRecipesUseCase,
)
from app.application.use_cases.ai_use_cases import AnalyzeImageUseCase
from app.infrastructure.database.recipe_repository import RecipeRepository
from app.infrastructure.ai.gemini_service import GeminiAIService

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=RecipeResponse)
async def create_recipe(
    recipe: RecipeCreate,
    session: AsyncSession = Depends(get_db_session),
):
    """Cria uma nova receita."""
    repo = RecipeRepository(session)
    use_case = CreateRecipeUseCase(repository=repo)
    result = await use_case.execute(recipe.model_dump())
    return result


@router.get("", response_model=list[RecipeResponse])
async def list_recipes(
    session: AsyncSession = Depends(get_db_session),
):
    """Lista todas as receitas."""
    repo = RecipeRepository(session)
    use_case = ListRecipesUseCase(repository=repo)
    return await use_case.execute()


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: UUID,
    session: AsyncSession = Depends(get_db_session),
):
    """Obtém uma receita por ID."""
    repo = RecipeRepository(session)
    use_case = GetRecipeByIdUseCase(repository=repo)
    result = await use_case.execute(recipe_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return result


@router.post("/analyze-image", response_model=RecipeDraft)
async def analyze_image(
    file: UploadFile = File(...),
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
