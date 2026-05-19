## MODIFIED Requirements

### Requirement: Registro de Usuário
O sistema DEVE permitir a criação de contas de usuário com email, senha e nome completo, e DEVE suportar os campos extra opcionais (telefone, localização e especialidade do chef). O email DEVE ser único no sistema. A senha DEVE ser armazenada como hash bcrypt, nunca em texto puro.

#### Scenario: Registro com dados válidos e opcionais
- **WHEN** o usuário envia POST /api/auth/register com email, password e full_name válidos
- **THEN** o sistema aceita também no payload os campos optionals (phone, location, specialty), cria o usuário no banco de dados e retorna HTTP 201 com os dados completos (sem a senha)

#### Scenario: Registro com email duplicado
- **WHEN** o usuário envia POST /api/auth/register com um email já cadastrado
- **THEN** o sistema retorna HTTP 409 com mensagem "Email já cadastrado"

#### Scenario: Registro com dados inválidos
- **WHEN** o usuário envia POST /api/auth/register com campos essenciais faltando ou modelagem inválida
- **THEN** o sistema retorna HTTP 422 com detalhes da validação

### Requirement: Persistência de Usuários
O sistema DEVE armazenar usuários na tabela `users` com os seguintes campos: id (UUID PK), email (unique), hashed_password, full_name, phone, location, specialty, created_at, updated_at.

#### Scenario: Estrutura estendida da tabela users
- **WHEN** o Alembic executa a nova migration de update
- **THEN** a tabela `users` existente é modificada possuindo id UUID, email VARCHAR UNIQUE, hashed_password VARCHAR, full_name VARCHAR, phone VARCHAR, location VARCHAR, specialty VARCHAR, created_at TIMESTAMP, updated_at TIMESTAMP
