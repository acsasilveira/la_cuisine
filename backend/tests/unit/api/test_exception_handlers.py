"""
Testes para os exception handlers globais definidos no main.py.
"""
import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app

@pytest.fixture
async def exception_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

class TestExceptionHandlers:
    async def test_value_error_handler(self, exception_client):
        # Injetar uma rota temporária que lança ValueError
        @app.get("/test-value-error")
        async def raise_value_error():
            raise ValueError("Erro de validação customizado")
        
        response = await exception_client.get("/test-value-error")
        assert response.status_code == 422
        assert response.json()["detail"] == "Erro de validação customizado"

    async def test_timeout_error_handler(self, exception_client):
        # Injetar uma rota temporária que lança TimeoutError
        @app.get("/test-timeout-error")
        async def raise_timeout_error():
            raise TimeoutError("Timeout na IA")
        
        response = await exception_client.get("/test-timeout-error")
        assert response.status_code == 504
        assert response.json()["detail"] == "Serviço externo não respondeu"
