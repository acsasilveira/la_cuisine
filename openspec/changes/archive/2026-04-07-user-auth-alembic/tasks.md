## 1. Configuração do Alembic

- [x] 1.1 Executar `alembic init migrations` no diretório backend
- [x] 1.2 Configurar `alembic.ini` com `sqlalchemy.url` apontando para DATABASE_URL
- [x] 1.3 Configurar `migrations/env.py` com SQLModel.metadata e suporte async
- [x] 1.4 Gerar migration inicial com todas as tabelas existentes (recipes, ingredients, recipe_ingredients, recipe_steps, users)
- [x] 1.5 Testar `alembic upgrade head` no PostgreSQL via Docker

## 2. Camada Domain — User — TDD (Red → Green)

- [x] 2.1 🔴 Escrever testes para entidade `UserBase` (email, full_name validação)
- [x] 2.2 🟢 Implementar entidade `UserBase` em `domain/entities/user.py`
- [x] 2.3 🔴 Escrever testes para interface `UserRepositoryPort` (ABC)
- [x] 2.4 🟢 Implementar interface `UserRepositoryPort` em `domain/ports/repository_ports.py`

## 3. Camada Infrastructure — UserRepository — TDD (Red → Green)

- [x] 3.1 🔴 Escrever testes de integração para `UserRepository.create`
- [x] 3.2 🟢 Implementar `UserModel` em `infrastructure/database/models.py`
- [x] 3.3 🟢 Implementar `UserRepository.create`
- [x] 3.4 🔴 Escrever testes para `UserRepository.get_by_email`
- [x] 3.5 🟢 Implementar `UserRepository.get_by_email`
- [x] 3.6 🔴 Escrever testes para `UserRepository.get_by_id`
- [x] 3.7 🟢 Implementar `UserRepository.get_by_id`
- [x] 3.8 Gerar migration do Alembic para tabela `users`

## 4. Camada Application — Use Cases de Auth — TDD (Red → Green)

- [x] 4.1 🔴 Escrever testes para `RegisterUseCase` (sucesso, email duplicado, dados inválidos)
- [x] 4.2 🟢 Implementar `RegisterUseCase`
- [x] 4.3 🔴 Escrever testes para `LoginUseCase` atualizado (buscar do banco, verificar hash)
- [x] 4.4 🟢 Atualizar `LoginUseCase` para usar `UserRepository` em vez de `stored_hash`

## 5. Camada API — Schemas e Dependencies

- [x] 5.1 Criar schemas `UserCreate`, `UserResponse`, `RegisterRequest`
- [x] 5.2 Criar dependency `get_current_user` que lê cookie `session` e valida JWT
- [x] 5.3 🔴 Escrever testes para `get_current_user` (cookie válido, inválido, expirado, ausente)
- [x] 5.4 🟢 Implementar `get_current_user` lendo de `request.cookies.get("session")`

## 6. Camada API — Routers de Auth — TDD (Red → Green)

- [x] 6.1 🔴 Escrever testes E2E para `POST /api/auth/register` (sucesso, email duplicado, dados inválidos)
- [x] 6.2 🟢 Implementar endpoint `register` no `auth_router.py`
- [x] 6.3 🔴 Escrever testes E2E para `POST /api/auth/login` com Set-Cookie na resposta
- [x] 6.4 🟢 Atualizar endpoint `login` para usar banco e setar cookie HttpOnly (session=JWT; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000)
- [x] 6.5 🔴 Escrever testes E2E para `POST /api/auth/logout` (apaga cookie)
- [x] 6.6 🟢 Implementar endpoint `logout` que seta cookie com Max-Age=0

## 7. Vincular Receitas ao Usuário

- [x] 7.1 Adicionar campo `user_id: UUID` (FK) ao `RecipeModel`
- [x] 7.2 Gerar migration do Alembic para coluna `user_id` em recipes
- [x] 7.3 🔴 Escrever testes para `RecipeRepository` filtrar por user_id
- [x] 7.4 🟢 Atualizar `RecipeRepository.list_all` para filtrar por user_id
- [x] 7.5 🟢 Atualizar `RecipeRepository.get_by_id` para verificar user_id
- [x] 7.6 🟢 Atualizar `CreateRecipeUseCase` para receber user_id

## 8. Proteger Rotas Existentes

- [x] 8.1 🔴 Escrever testes E2E para rotas protegidas (recipe, menu, chat retornam 401 sem cookie)
- [x] 8.2 🟢 Adicionar `Depends(get_current_user)` nos routers de recipe, menu e chat
- [x] 8.3 🟢 Atualizar routers para passar user_id aos use cases
- [x] 8.4 Atualizar CORS middleware com `allow_credentials=True`
- [x] 8.5 Atualizar fixtures dos testes E2E para criar usuário e enviar cookie nos requests

## 9. Validação Final

- [x] 9.1 Executar `pytest` completo — todos os testes devem passar
- [x] 9.2 Verificar `docker-compose up` + `alembic upgrade head`
- [x] 9.3 Testar fluxo completo via Swagger: register → login (cookie setado) → CRUD receitas → logout

