"""
🔴 RED: Testes de integração para UserRepository.
Testes com banco SQLite in-memory para validar CRUD de usuários.
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel


@pytest.fixture
async def async_session():
    """Cria sessão async com SQLite in-memory para testes."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///",
        echo=False,
    )
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async_session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session_factory() as session:
        yield session

    await engine.dispose()


class TestUserRepositoryCreate:
    """Testes para UserRepository.create"""

    @pytest.mark.asyncio
    async def test_criar_usuario(self, async_session):
        from app.infrastructure.database.user_repository import UserRepository

        repo = UserRepository(async_session)
        user = await repo.create({
            "email": "chef@lacuisine.com",
            "full_name": "Chef Silva",
            "hashed_password": "hashed_abc123",
        })
        assert user.email == "chef@lacuisine.com"
        assert user.full_name == "Chef Silva"
        assert user.hashed_password == "hashed_abc123"
        assert user.id is not None

    @pytest.mark.asyncio
    async def test_email_duplicado_levanta_erro(self, async_session):
        from app.infrastructure.database.user_repository import UserRepository

        repo = UserRepository(async_session)
        await repo.create({
            "email": "chef@lacuisine.com",
            "full_name": "Chef Silva",
            "hashed_password": "hashed_abc123",
        })
        with pytest.raises(Exception):
            await repo.create({
                "email": "chef@lacuisine.com",
                "full_name": "Outro Chef",
                "hashed_password": "hashed_xyz",
            })


class TestUserRepositoryGetByEmail:
    """Testes para UserRepository.get_by_email"""

    @pytest.mark.asyncio
    async def test_buscar_usuario_existente(self, async_session):
        from app.infrastructure.database.user_repository import UserRepository

        repo = UserRepository(async_session)
        await repo.create({
            "email": "chef@lacuisine.com",
            "full_name": "Chef Silva",
            "hashed_password": "hashed_abc123",
        })
        user = await repo.get_by_email("chef@lacuisine.com")
        assert user is not None
        assert user.email == "chef@lacuisine.com"

    @pytest.mark.asyncio
    async def test_buscar_email_inexistente(self, async_session):
        from app.infrastructure.database.user_repository import UserRepository

        repo = UserRepository(async_session)
        user = await repo.get_by_email("naoexiste@email.com")
        assert user is None


class TestUserRepositoryGetById:
    """Testes para UserRepository.get_by_id"""

    @pytest.mark.asyncio
    async def test_buscar_usuario_por_id(self, async_session):
        from app.infrastructure.database.user_repository import UserRepository

        repo = UserRepository(async_session)
        created = await repo.create({
            "email": "chef@lacuisine.com",
            "full_name": "Chef Silva",
            "hashed_password": "hashed_abc123",
        })
        user = await repo.get_by_id(created.id)
        assert user is not None
        assert user.id == created.id

    @pytest.mark.asyncio
    async def test_buscar_id_inexistente(self, async_session):
        from uuid import uuid4

        from app.infrastructure.database.user_repository import UserRepository

        repo = UserRepository(async_session)
        user = await repo.get_by_id(uuid4())
        assert user is None
