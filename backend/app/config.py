from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuração da aplicação via variáveis de ambiente."""

    # Database
    DATABASE_URL: str

    # Gemini AI
    GEMINI_API_KEY: str

    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # App
    APP_NAME: str = "LaCuisine API"
    DEBUG: bool = False

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()  # type: ignore[call-arg]
