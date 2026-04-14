"""Router de autenticação — register, login (cookie), logout, profile."""
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.deps import get_db_session, get_current_user
from app.api.schemas.schemas import (
    LoginRequest,
    MessageResponse,
    ProfileUpdate,
    RegisterRequest,
    UserResponse,
)
from app.application.use_cases.auth_use_cases import LoginUseCase, RegisterUseCase
from app.infrastructure.database.user_repository import UserRepository
from app.infrastructure.database.models import UserModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Cookie config
COOKIE_MAX_AGE = 60 * 60 * 24 * 365  # 1 ano em segundos


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
async def register(
    request: RegisterRequest,
    session: AsyncSession = Depends(get_db_session),
):
    """Registra um novo usuário."""
    repo = UserRepository(session)
    use_case = RegisterUseCase(repository=repo)

    try:
        user = await use_case.execute(
            email=request.email,
            password=request.password,
            full_name=request.full_name,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    return user


@router.post("/login", response_model=UserResponse)
async def login(
    request: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_db_session),
):
    """Autentica usuário e seta cookie HTTP-Only com JWT."""
    from app.config import settings

    repo = UserRepository(session)
    use_case = LoginUseCase(
        repository=repo,
        secret=settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )

    result = await use_case.execute(
        email=request.email,
        password=request.password,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )

    # Setar cookie HTTP-Only com o JWT
    response.set_cookie(
        key="session",
        value=result["access_token"],
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        samesite="lax",
        path="/",
        secure=False,  # True em produção (HTTPS)
    )

    # Retornar dados do usuário (sem token no body)
    return {
        "id": result["user_id"],
        "email": result["user_email"],
        "full_name": result["user_full_name"],
    }


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response):
    """Faz logout apagando o cookie de sessão."""
    response.delete_cookie(
        key="session",
        httponly=True,
        samesite="lax",
        path="/",
    )
    return {"message": "Logout realizado com sucesso"}


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: UserModel = Depends(get_current_user),
):
    """Retorna os dados do usuário logado."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile: ProfileUpdate,
    current_user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    """Atualiza o perfil do usuário logado."""
    data = profile.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(current_user, key, value)

    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user
