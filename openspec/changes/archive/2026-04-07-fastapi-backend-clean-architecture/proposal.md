## Why

O projeto LaCuisine possui especificações detalhadas (proposal, design, specs) mas ainda não tem implementação de backend. É necessário criar toda a estrutura do servidor FastAPI com PostgreSQL seguindo **Clean Architecture** e **TDD** (Test-Driven Development) para garantir código testável, desacoplado e de fácil manutenção desde o início. A abordagem TDD garante que cada camada seja desenvolvida com testes automatizados antes da implementação, reduzindo bugs e facilitando refatorações futuras.

## What Changes

- **Novo projeto backend Python** com estrutura Clean Architecture (Domain → Application → Infrastructure → API)
- **Configuração do ambiente**: `pyproject.toml`, dependências (FastAPI, SQLModel, Pydantic v2, Alembic, pytest, httpx)
- **Camada Domain**: Entidades (`Recipe`, `Ingredient`, `RecipeIngredient`, `RecipeStep`), enums, interfaces de repositório (ports)
- **Camada Application**: Use cases para CRUD de receitas, análise de imagem com IA, sugestão de menus, chat copiloto
- **Camada Infrastructure**: Repositórios SQLModel/PostgreSQL, integração Gemini API, configuração Alembic para migrations
- **Camada API**: Routers FastAPI, schemas de request/response, middleware de autenticação JWT, tratamento de erros
- **Configuração TDD**: pytest + pytest-asyncio + httpx para testes de integração, fixtures de banco, factories de dados
- **Docker**: `Dockerfile` para o backend, serviço `postgres` no `docker-compose.yml`
- **Variáveis de ambiente**: `.env.example` com `DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`
- **Segurança**: Autenticação JWT, CORS configurado (sem wildcard), validação de inputs/outputs com Pydantic

## Capabilities

### New Capabilities
- `backend-project-setup`: Estrutura do projeto FastAPI com Clean Architecture e configuração inicial (pyproject.toml, Docker, .env)
- `recipe-crud-api`: Endpoints CRUD de receitas (POST, GET, GET by ID) com validação Pydantic e persistência PostgreSQL
- `image-analysis-api`: Endpoint de análise de imagem de receita via Gemini API com retorno estruturado
- `menu-suggestion-api`: Endpoint de sugestão de menus com IA baseado nas receitas do banco
- `chat-copilot-api`: Endpoint de chat culinário com respostas tipadas (text/recipe/menu) e contexto
- `auth-jwt`: Autenticação JWT com middleware FastAPI
- `database-migrations`: Configuração Alembic com modelos SQLModel e migrations iniciais
- `tdd-test-suite`: Suíte de testes com pytest, fixtures, factories e testes para cada camada

### Modified Capabilities
_(Nenhuma capability existente é modificada — todas as specs atuais permanecem como referência)_

## Impact

- **Código novo**: Todo o diretório `backend/` será criado do zero
- **APIs**: Todos os endpoints definidos nas specs (recipe, menu, chat) serão implementados
- **Dependências**: Python 3.11+, FastAPI, SQLModel, Pydantic v2, Alembic, google-genai, PyJWT, pytest, httpx
- **Infra**: Docker e docker-compose serão necessários; PostgreSQL como banco de dados
- **Frontend**: Nenhum impacto direto — o frontend consumirá a API via OpenAPI gerado automaticamente
