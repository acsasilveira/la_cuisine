## Context

O LaCuisine é um sistema web SaaS para chefs de cozinha gerenciarem receitas, gerarem fichas técnicas e criarem menus com auxílio de IA. O projeto possui especificações detalhadas (proposal, specs de recipe/menu/chat) mas nenhuma implementação de backend ainda existe.

O backend será construído em **FastAPI + PostgreSQL** seguindo **Clean Architecture** com 4 camadas bem definidas e **TDD** como metodologia de desenvolvimento. Todas as entidades já estão modeladas nas specs existentes.

**Estado atual**: Apenas documentação (openspec, prompts de UI, logos). Sem código de backend.

**Stakeholders**: Desenvolvedores do projeto, chefs de cozinha (usuários finais).

## Goals / Non-Goals

**Goals:**
- Criar estrutura backend completa com Clean Architecture (Domain → Application → Infrastructure → API)
- Implementar modelos SQLModel + schemas Pydantic v2 sem duplicação
- Configurar pipeline TDD com pytest + pytest-asyncio + httpx
- Implementar todos os endpoints definidos nas specs (recipe, menu, chat)
- Integrar Gemini API com validação obrigatória de JSON
- Configurar Docker e docker-compose para ambiente de desenvolvimento
- Configurar Alembic para migrations de banco
- Implementar autenticação JWT

**Non-Goals:**
- Implementação do frontend (Next.js) — será uma change separada
- Deploy em produção — fora do escopo deste change
- Implementação completa de ficha técnica (será iterada no futuro)
- Testes de performance e carga

## Decisions

### Decisão 1: Clean Architecture com 4 Camadas

**Escolha**: Domain → Application → Infrastructure → API

**Alternativas consideradas**:
- **MVC tradicional**: Rejeitada — acoplamento forte entre camadas, difícil de testar
- **Hexagonal Architecture**: Similar, mas Clean Architecture é mais familiar na comunidade Python/FastAPI
- **3 camadas simples**: Rejeitada — não separa regras de negócio de casos de uso

**Racional**: Clean Architecture garante que a camada Domain não depende de FastAPI nem SQLModel, permitindo testar regras de negócio isoladamente.

```
backend/
├── app/
│   ├── domain/           # Entidades, enums, interfaces (ports)
│   │   ├── entities/     # Recipe, Ingredient, RecipeStep, etc.
│   │   ├── enums/        # RecipeCategory, TemperatureType
│   │   └── ports/        # Interfaces abstratas (repositories, services)
│   ├── application/      # Use cases
│   │   ├── use_cases/    # CreateRecipe, ListRecipes, AnalyzeImage, etc.
│   │   └── dtos/         # Data Transfer Objects
│   ├── infrastructure/   # Implementações concretas
│   │   ├── database/     # SQLModel models, repositórios, session
│   │   ├── ai/           # Gemini API client
│   │   └── auth/         # JWT implementation
│   └── api/              # FastAPI routers, schemas, middleware
│       ├── routers/      # recipe_router, menu_router, chat_router
│       ├── schemas/      # Request/Response Pydantic models
│       ├── dependencies/ # Dependency injection
│       └── middleware/    # Auth, error handling
├── migrations/           # Alembic
├── tests/
│   ├── unit/             # Testes de domain e application
│   ├── integration/      # Testes de infrastructure
│   └── e2e/              # Testes de API completos
├── pyproject.toml
├── Dockerfile
└── .env.example
```

### Decisão 2: SQLModel como Source of Truth + Pydantic v2 sem Duplicação

**Escolha**: SQLModel para modelos de banco; Pydantic v2 para request/response schemas. Schemas herdam campos base via mixins.

**Alternativas consideradas**:
- **SQLAlchemy puro + Pydantic separado**: Rejeitada — duplicação de campos garantida
- **SQLModel para tudo**: Rejeitada — SQLModel models não devem ser expostos diretamente na API

**Racional**: SQLModel já usa Pydantic v2 internamente. Criamos classes base compartilhadas para evitar duplicação:

```python
# domain/entities/recipe.py — entidade pura (sem ORM)
class RecipeBase(BaseModel):
    title: str
    category: RecipeCategory
    yield_amount: float
    yield_unit: str

# infrastructure/database/models.py — modelo SQLModel
class RecipeModel(RecipeBase, SQLModel, table=True):
    __tablename__ = "recipes"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# api/schemas/recipe.py — schemas de API
class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: UUID
    created_at: datetime
```

### Decisão 3: TDD com 3 Níveis de Teste

**Escolha**: pytest + pytest-asyncio + httpx com 3 níveis

**Alternativas consideradas**:
- **Apenas testes e2e**: Rejeitada — lentos e não testam camadas isoladas
- **unittest**: Rejeitada — pytest é padrão na comunidade Python moderna

**Estrutura de testes**:
| Nível | O que testa | Banco de dados | Exemplos |
|---|---|---|---|
| Unit | Domain, Use Cases | ❌ Mock | Validação de entidades, lógica de negócio |
| Integration | Repositórios, AI client | ✅ TestDB | CRUD real, Gemini mock |
| E2E | API endpoints | ✅ TestDB | `httpx.AsyncClient` contra a API |

### Decisão 4: Dependency Injection via FastAPI `Depends`

**Escolha**: Usar o sistema de injeção de dependências nativo do FastAPI com `Depends()`.

**Racional**: Permite trocar implementações (ex: repositório real vs. mock para testes) sem alterar código de negócio. Use cases recebem ports (interfaces) no construtor.

### Decisão 5: Gemini API via `google-genai` SDK

**Escolha**: SDK oficial `google-genai` com structured output (JSON schema).

**Racional**: Garante que a IA retorne JSON válido conforme Pydantic model. Em caso de falha, o backend retorna HTTP 502 (formato inválido) ou 504 (timeout).

### Decisão 6: Docker Multi-Stage

**Escolha**: Dockerfile multi-stage para build leve.

**docker-compose.yml** para dev:
- `backend` (FastAPI + uvicorn)
- `postgres` (PostgreSQL 14+)

## Risks / Trade-offs

| Risco | Impacto | Mitigação |
|---|---|---|
| SQLModel não suporta todas features do SQLAlchemy | Médio | Usar SQLAlchemy core para queries complexas quando necessário |
| Gemini API pode retornar JSON inválido | Alto | Validação obrigatória com Pydantic; retry com backoff; fallback 502 |
| Clean Architecture aumenta boilerplate | Baixo | Compensado por testabilidade e manutenibilidade |
| pytest-asyncio pode ter issues com event loop | Médio | Usar `@pytest.mark.asyncio` com scope de sessão; fixtures async |
| Mudanças nas specs da IA são imprevisíveis | Médio | Isolar integração Gemini em adapter; validar output rigorosamente |
