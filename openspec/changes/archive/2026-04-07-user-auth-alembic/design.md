## Context

O backend LaCuisine já possui toda a estrutura Clean Architecture implementada com TDD (76 testes passando). O esqueleto de autenticação existe (JWT handler + bcrypt), mas o login usa `MOCK_USERS` vazio e nenhuma rota está protegida. O Alembic está como dependência mas não foi configurado (pasta `migrations/` vazia). A aplicação roda via Docker Compose com PostgreSQL.

## Goals / Non-Goals

**Goals:**
- Configurar Alembic com migration inicial para todas as tabelas
- Criar modelo `UserModel` com persistência no PostgreSQL
- Implementar registro e login reais (contra o banco)
- Usar **HTTP-Only Cookie** para manter sessão (sem gerenciamento manual de token no frontend)
- Implementar endpoint de logout que apaga o cookie
- Proteger todas as rotas lendo o cookie de sessão
- Vincular receitas ao usuário autenticado (user_id)
- Manter 100% dos testes existentes passando + novos testes

**Non-Goals:**
- Sistema de roles/permissões (admin vs user) — não necessário
- Recuperação de senha / reset por email
- Refresh token — cookie persistente (1 ano) elimina a necessidade
- Multi-tenancy
- Frontend (será implementado em change futuro)

## Decisions

### 1. HTTP-Only Cookie em vez de header Authorization

**Decisão:** O login retorna `Set-Cookie: session=<JWT>; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000`. O backend lê o cookie em vez do header Authorization para autenticar requests.

**Alternativa descartada:** Token no header Authorization — requer que o frontend salve o token no localStorage (vulnerável a XSS) e envie manualmente em cada request.

**Rationale:**
- Cookie HttpOnly é invisível para JavaScript → proteção contra XSS
- Browser envia automaticamente → frontend não precisa gerenciar tokens
- Max-Age de 1 ano → usuário fica logado até limpar cookies ou fazer logout
- `SameSite=Lax` → proteção básica contra CSRF

### 2. UserModel como SQLModel com herança de UserBase

**Decisão:** Criar `UserBase` (Pydantic) no domínio e `UserModel` (SQLModel, table=True) na infraestrutura, seguindo o mesmo padrão de `RecipeBase` → `RecipeModel`.

**Alternativa descartada:** Criar User direto como SQLModel sem entidade no domínio — quebraria a Clean Architecture.

**Rationale:** Mantém consistência com o padrão já estabelecido no change anterior.

### 3. Dependency `get_current_user` lendo cookie

**Decisão:** Criar uma FastAPI Dependency que extrai o JWT do cookie `session` (via `Request.cookies`), verifica com `verify_token`, busca o usuário no banco pelo `user_id` do payload, e retorna o `UserModel`.

```python
async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_db_session),
) -> UserModel:
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(status_code=401)
    payload = verify_token(token, secret, algorithm)
    user = await user_repo.get_by_id(payload["sub"])
    return user
```

**Alternativa descartada:** `oauth2_scheme` do FastAPI (lê header Authorization) — não funciona com cookies.

**Rationale:** Leitura direta do cookie é simples, explícita e testável.

### 4. CORS com credentials

**Decisão:** Atualizar CORS middleware com `allow_credentials=True` e `allow_origins` com a URL específica do frontend (não wildcard).

**Rationale:** O browser só envia cookies cross-origin se o servidor permitir credentials E especificar a origin exata (não pode ser `*`).

### 5. Alembic com `env.py` apontando para SQLModel metadata

**Decisão:** Configurar `alembic/env.py` para importar `SQLModel.metadata` e usar `target_metadata` com `run_migrations_online()` async.

**Rationale:** Como usamos SQLModel (que é SQLAlchemy por baixo), o Alembic precisa acessar o metadata para auto-gerar migrações.

### 6. Campo `user_id` na tabela recipes (FK → users.id)

**Decisão:** Adicionar `user_id: UUID = Field(foreign_key="users.id")` ao `RecipeModel`.

**Alternativa descartada:** Tabela intermediária user_recipes — desnecessariamente complexa para relação 1:N.

### 7. Endpoint de logout

**Decisão:** `POST /api/auth/logout` que retorna `Set-Cookie: session=; Max-Age=0; HttpOnly; Path=/` para apagar o cookie.

**Rationale:** Simples e efetivo. O browser apaga o cookie automaticamente quando recebe Max-Age=0.

## Risks / Trade-offs

- **[Cookie longa duração]** → Trade-off aceito: token no cookie vale por 1 ano. Se o cookie for comprometido, o atacante tem acesso prolongado. Para projeto acadêmico, é aceitável. Em produção, usaríamos refresh token com rotação.
- **[Testes existentes quebram com auth]** → Mitigação: atualizar fixtures dos testes E2E para criar usuário e enviar cookie. Testes unitários usam mocks e não são afeitados.
- **[CORS mais restritivo]** → Mitigação: configurar `ALLOWED_ORIGINS` no .env com URL do frontend. Em dev, usar `http://localhost:3000`.

## Open Questions

_(Nenhuma — decisão de cookie HTTP-Only foi discutida e acordada com o professor.)_
