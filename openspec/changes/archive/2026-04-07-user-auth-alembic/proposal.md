## Why

O backend do LaCuisine possui todo o esqueleto de autenticação JWT (criação/verificação de tokens, hash de senha), mas o login usa `MOCK_USERS` vazio e nenhuma rota está protegida. Além disso, as migrações do banco de dados (Alembic) não estão configuradas, impedindo a criação de tabelas no PostgreSQL real. Sem essas duas peças, o sistema funciona nos testes mas está inutilizável em produção.

## What Changes

- **Novo modelo `UserModel`** no banco de dados com campos email, senha (hash), nome e timestamps
- **Endpoint de registro** (`POST /api/auth/register`) para criar contas de usuário
- **Login real** substituindo `MOCK_USERS` por consulta ao banco de dados
- **Autenticação via HTTP-Only Cookie** — o login seta um cookie `session` com JWT, e todas as requests subsequentes leem esse cookie automaticamente (o frontend não precisa gerenciar tokens)
- **Endpoint de logout** (`POST /api/auth/logout`) que apaga o cookie de sessão
- **Vinculação receita→usuário** (`user_id` nas receitas) para que cada usuário veja apenas suas próprias receitas
- **Configuração do Alembic** com migration inicial (todas as tabelas existentes + tabela users)
- **Testes TDD** para cada camada seguindo o ciclo 🔴 RED → 🟢 GREEN

## Capabilities

### New Capabilities
- `user-auth`: Registro de usuários, login com cookies HTTP-Only persistentes, logout, proteção de rotas via leitura do cookie de sessão, e vinculação de dados ao usuário autenticado

### Modified Capabilities
- `recipe`: Receitas passam a ter `user_id` obrigatório — cada usuário vê apenas suas próprias receitas
- `menu`: Sugestão de menu filtra receitas do usuário autenticado
- `chat`: Chat copiloto requer autenticação

## Impact

- **Banco de dados**: Nova tabela `users`, adição de coluna `user_id` na tabela `recipes` com FK
- **API**: Login retorna `Set-Cookie` em vez de JSON com token. Todas as rotas exceto `/api/auth/register`, `/api/auth/login` e `/health` exigem cookie `session` válido
- **CORS**: Precisa de `allow_credentials=True` para o browser enviar cookies cross-origin
- **Dependências**: Alembic adicionado como dependência de produção
- **Docker**: Container do backend precisa rodar `alembic upgrade head` antes de iniciar
- **Testes**: Fixtures atualizadas para criar usuário de teste e enviar cookie nos requests
