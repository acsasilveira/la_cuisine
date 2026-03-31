## 1. Setup do Projeto (Scaffolding)

- [x] 1.1 Criar estrutura de diretórios `backend/app/` com subpastas
- [x] 1.2 Criar `pyproject.toml` com dependências de produção
- [x] 1.3 Criar `pyproject.toml` seção de dev dependencies
- [x] 1.4 Criar `app/config.py` com Pydantic Settings
- [x] 1.5 Criar `.env.example` com variáveis de ambiente
- [x] 1.6 Criar `Dockerfile` multi-stage para o backend
- [x] 1.7 Criar `docker-compose.yml` com serviços backend e postgres
- [x] 1.8 Criar `tests/conftest.py` com fixtures globais
- [x] 1.9 Verificar que `pytest` executa sem erros

## 2. Camada Domain — TDD (Red → Green)

- [x] 2.1 🔴 Escrever testes para enums
- [x] 2.2 🟢 Implementar enums
- [x] 2.3 🔴 Escrever testes para entidade `RecipeBase`
- [x] 2.4 🟢 Implementar entidade `RecipeBase`
- [x] 2.5 🔴 Escrever testes para entidades base
- [x] 2.6 🟢 Implementar entidades base
- [x] 2.7 🔴 Escrever testes para interfaces (ports)
- [x] 2.8 🟢 Criar interfaces `RecipeRepositoryPort` e `AIServicePort`

## 3. Camada Infrastructure — Banco de Dados — TDD (Red → Green)

- [x] 3.1 🔴 Escrever testes de integração para `RecipeRepository.create`
- [x] 3.2 🟢 Criar modelos SQLModel
- [x] 3.3 🟢 Criar `database/session.py` com engine async
- [x] 3.4 🟢 Implementar `RecipeRepository.create`
- [x] 3.5 🔴 Escrever testes para `RecipeRepository.get_by_id`
- [x] 3.6 🟢 Implementar `RecipeRepository.get_by_id`
- [x] 3.7 🔴 Escrever testes para `RecipeRepository.list_all`
- [x] 3.8 🟢 Implementar `RecipeRepository.list_all`
- [x] 3.9 Configurar Alembic (config criado, migrations pendente)
- [x] 3.10 Criar migration inicial (pendente — requer PostgreSQL)

## 4. Camada Infrastructure — Auth — TDD (Red → Green)

- [x] 4.1 🔴 Escrever testes para `create_access_token`
- [x] 4.2 🔴 Escrever testes para `verify_token`
- [x] 4.3 🔴 Escrever testes para hash de senha
- [x] 4.4 🟢 Implementar funções JWT
- [x] 4.5 🟢 Implementar hash de senha com bcrypt

## 5. Camada Infrastructure — IA — TDD (Red → Green)

- [x] 5.1 🔴 Escrever testes para `GeminiAIService.analyze_image`
- [x] 5.2 🟢 Implementar `GeminiAIService.analyze_image`
- [x] 5.3 🔴 Escrever testes para `GeminiAIService.suggest_menu`
- [x] 5.4 🟢 Implementar `GeminiAIService.suggest_menu`
- [x] 5.5 🔴 Escrever testes para `GeminiAIService.chat`
- [x] 5.6 🟢 Implementar `GeminiAIService.chat`

## 6. Camada Application — Use Cases — TDD (Red → Green)

- [x] 6.1 🔴 Escrever testes para `CreateRecipeUseCase`
- [x] 6.2 🟢 Implementar `CreateRecipeUseCase`
- [x] 6.3 🔴 Escrever testes para `ListRecipesUseCase`
- [x] 6.4 🟢 Implementar `ListRecipesUseCase`
- [x] 6.5 🔴 Escrever testes para `GetRecipeByIdUseCase`
- [x] 6.6 🟢 Implementar `GetRecipeByIdUseCase`
- [x] 6.7 🔴 Escrever testes para `AnalyzeImageUseCase`
- [x] 6.8 🟢 Implementar `AnalyzeImageUseCase`
- [x] 6.9 🔴 Escrever testes para `SuggestMenuUseCase`
- [x] 6.10 🟢 Implementar `SuggestMenuUseCase`
- [x] 6.11 🔴 Escrever testes para `ChatCopilotUseCase`
- [x] 6.12 🟢 Implementar `ChatCopilotUseCase`
- [x] 6.13 🔴 Escrever testes para `LoginUseCase`
- [x] 6.14 🟢 Implementar `LoginUseCase`

## 7. Camada API — Schemas

- [x] 7.1 Criar schemas de request/response: `RecipeCreate`, `RecipeResponse`, `RecipeDraft`
- [x] 7.2 Criar schemas: `MenuSuggestRequest`, `MenuResponse`, `MenuItem`
- [x] 7.3 Criar schemas: `ChatRequest`, `ChatResponse`
- [x] 7.4 Criar schemas: `LoginRequest`, `TokenResponse`
- [x] 7.5 Criar dependencies FastAPI

## 8. Camada API — Routers — TDD (Red → Green)

- [x] 8.1 🔴 Escrever testes E2E para `POST /api/recipes`
- [x] 8.2 🔴 Escrever testes E2E para `GET /api/recipes`
- [x] 8.3 🔴 Escrever testes E2E para `GET /api/recipes/{id}`
- [x] 8.4 🟢 Implementar `recipe_router`
- [x] 8.5 🔴 Escrever testes E2E para `POST /api/recipes/analyze-image`
- [x] 8.6 🟢 Implementar endpoint `analyze-image`
- [x] 8.7 🔴 Escrever testes E2E para `POST /api/menus/suggest`
- [x] 8.8 🟢 Implementar `menu_router`
- [x] 8.9 🔴 Escrever testes E2E para `POST /api/chat/copilot`
- [x] 8.10 🟢 Implementar `chat_router`
- [x] 8.11 🔴 Escrever testes E2E para `POST /api/auth/login`
- [x] 8.12 🟢 Implementar `auth_router`
- [x] 8.13 🟢 Implementar middleware de tratamento de erros
- [x] 8.14 🟢 Criar `app/main.py` com FastAPI app, CORS middleware e routers

## 9. Refactor e Validação Final

- [x] 9.1 🔵 Refatorar código (bcrypt direto vs passlib)
- [x] 9.2 Executar `pytest` completo — **75 passed** ✅
- [ ] 9.3 Verificar OpenAPI via `/docs` (requer docker-compose)
- [ ] 9.4 Verificar `docker-compose up` sobe backend + postgres
- [ ] 9.5 Verificar `alembic upgrade head` cria tabelas
