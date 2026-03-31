"""Funções de criação e verificação de tokens JWT."""
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt


def create_access_token(
    data: dict,
    secret: str,
    algorithm: str = "HS256",
    expires_delta: timedelta | None = None,
) -> str:
    """Cria um token JWT com os dados fornecidos."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret, algorithm=algorithm)


def verify_token(
    token: str,
    secret: str,
    algorithm: str = "HS256",
) -> dict | None:
    """Verifica e decodifica um token JWT. Retorna None se inválido."""
    try:
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        return payload
    except JWTError:
        return None
