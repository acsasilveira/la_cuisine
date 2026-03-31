"""Router de autenticação — endpoint de login JWT."""
from fastapi import APIRouter, HTTPException, status

from app.api.schemas.schemas import LoginRequest, TokenResponse
from app.application.use_cases.auth_use_cases import LoginUseCase

router = APIRouter(prefix="/api/auth", tags=["auth"])

# NOTA: Em produção, buscar hash do banco. Para MVP, usar hash hardcoded ou banco.
# Este é o placeholder — será integrado com User model no futuro.
MOCK_USERS = {}


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Autentica usuário e retorna token JWT."""
    from app.config import settings
    from app.infrastructure.auth.password import hash_password

    # Em produção, buscar do banco
    stored_hash = MOCK_USERS.get(request.email)
    if stored_hash is None:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    use_case = LoginUseCase(
        secret=settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )

    result = await use_case.execute(
        email=request.email,
        password=request.password,
        stored_hash=stored_hash,
    )

    if result is None:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return TokenResponse(**result)
