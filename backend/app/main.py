"""LaCuisine API — Ponto de entrada da aplicação FastAPI."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routers import recipe_router, menu_router, chat_router, auth_router

app = FastAPI(
    title="LaCuisine API",
    description="API para gerenciamento culinário com IA",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
try:
    from app.config import settings
    origins = settings.ALLOWED_ORIGINS
except Exception:
    origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(recipe_router.router)
app.include_router(menu_router.router)
app.include_router(chat_router.router)
app.include_router(auth_router.router)


# Startup: configure DB + Auth
@app.on_event("startup")
async def startup_event():
    """Configura banco de dados e autenticação no startup."""
    try:
        from app.config import settings
        from app.api.dependencies.deps import configure_db, configure_auth

        configure_db(settings.DATABASE_URL)
        configure_auth(settings.JWT_SECRET, settings.JWT_ALGORITHM)
    except Exception as e:
        print(f"⚠️ Config error (ok em testes): {e}")


# Error Handlers
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(TimeoutError)
async def timeout_error_handler(request: Request, exc: TimeoutError):
    return JSONResponse(status_code=504, content={"detail": "Serviço externo não respondeu"})


@app.get("/health")
async def health_check():
    """Endpoint de health check."""
    return {"status": "ok"}
