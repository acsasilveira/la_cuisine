## ADDED Requirements

### Requirement: Registro de Usuário
O sistema DEVE permitir a criação de contas de usuário com email, senha e nome completo. O email DEVE ser único no sistema. A senha DEVE ser armazenada como hash bcrypt, nunca em texto puro.

#### Scenario: Registro com dados válidos
- **WHEN** o usuário envia POST /api/auth/register com email, password e full_name válidos
- **THEN** o sistema cria o usuário no banco de dados com senha hasheada e retorna HTTP 201 com os dados do usuário (sem a senha)

#### Scenario: Registro com email duplicado
- **WHEN** o usuário envia POST /api/auth/register com um email já cadastrado
- **THEN** o sistema retorna HTTP 409 com mensagem "Email já cadastrado"

#### Scenario: Registro com dados inválidos
- **WHEN** o usuário envia POST /api/auth/register com campos faltando ou inválidos
- **THEN** o sistema retorna HTTP 422 com detalhes da validação

### Requirement: Login com Cookie HTTP-Only
O sistema DEVE autenticar usuários verificando email e senha contra o banco de dados. Ao autenticar com sucesso, o sistema DEVE setar um cookie `session` com JWT, configurado como HttpOnly, SameSite=Lax, Path=/, Max-Age=31536000 (1 ano).

#### Scenario: Login com credenciais válidas
- **WHEN** o usuário envia POST /api/auth/login com email e senha corretos
- **THEN** o sistema retorna HTTP 200 com dados do usuário e seta o header Set-Cookie: session=<JWT>; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000

#### Scenario: Login com senha incorreta
- **WHEN** o usuário envia POST /api/auth/login com email existente mas senha errada
- **THEN** o sistema retorna HTTP 401 com mensagem "Credenciais inválidas" sem setar cookie

#### Scenario: Login com email inexistente
- **WHEN** o usuário envia POST /api/auth/login com email não cadastrado
- **THEN** o sistema retorna HTTP 401 com mensagem "Credenciais inválidas" (mesma mensagem para não revelar existência do email)

### Requirement: Logout
O sistema DEVE fornecer endpoint de logout que apaga o cookie de sessão.

#### Scenario: Logout com sucesso
- **WHEN** o usuário autenticado envia POST /api/auth/logout
- **THEN** o sistema retorna HTTP 200 e seta Set-Cookie: session=; Max-Age=0; HttpOnly; Path=/ para apagar o cookie

### Requirement: Proteção de Rotas via Cookie
O sistema DEVE proteger todas as rotas da API (exceto register, login e health) lendo o cookie `session` e verificando o JWT contido nele.

#### Scenario: Acesso com cookie válido
- **WHEN** o browser envia uma requisição com cookie session contendo JWT válido
- **THEN** o sistema extrai o user_id do token e permite acesso ao recurso

#### Scenario: Acesso sem cookie
- **WHEN** o browser envia uma requisição sem cookie session
- **THEN** o sistema retorna HTTP 401 com mensagem "Não autenticado"

#### Scenario: Acesso com cookie expirado
- **WHEN** o browser envia uma requisição com cookie session contendo JWT expirado
- **THEN** o sistema retorna HTTP 401 com mensagem "Sessão expirada"

#### Scenario: Acesso com cookie inválido
- **WHEN** o browser envia uma requisição com cookie session contendo JWT malformado
- **THEN** o sistema retorna HTTP 401 com mensagem "Sessão inválida"

### Requirement: Modelo de Usuário
O sistema DEVE armazenar usuários na tabela `users` com os seguintes campos: id (UUID PK), email (unique), hashed_password, full_name, created_at, updated_at.

#### Scenario: Estrutura da tabela users
- **WHEN** o Alembic executa a migration
- **THEN** a tabela `users` é criada com id UUID, email VARCHAR UNIQUE, hashed_password VARCHAR, full_name VARCHAR, created_at TIMESTAMP, updated_at TIMESTAMP

### Requirement: Configuração do Alembic
O sistema DEVE utilizar Alembic para gerenciar migrações do banco de dados. A migration inicial DEVE criar todas as tabelas (recipes, ingredients, recipe_ingredients, recipe_steps, users).

#### Scenario: Migration inicial
- **WHEN** o comando `alembic upgrade head` é executado
- **THEN** todas as tabelas do sistema são criadas no PostgreSQL

#### Scenario: Autogenerate de migrações
- **WHEN** um modelo SQLModel é alterado e `alembic revision --autogenerate` é executado
- **THEN** o Alembic gera um script de migração com as alterações detectadas
