## ADDED Requirements

### Requirement: Autenticação JWT
O sistema DEVE implementar autenticação via JWT (JSON Web Token) para proteger endpoints da API.

#### Scenario: Login com credenciais válidas
- **WHEN** o usuário envia POST /api/auth/login com email e senha válidos
- **THEN** o sistema DEVE retornar HTTP 200 com access_token e token_type

#### Scenario: Login com credenciais inválidas
- **WHEN** o usuário envia POST /api/auth/login com email ou senha incorretos
- **THEN** o sistema DEVE retornar HTTP 401

#### Scenario: Acesso a endpoint protegido com token válido
- **WHEN** o usuário envia requisição com header `Authorization: Bearer <token_válido>`
- **THEN** o sistema DEVE permitir o acesso ao endpoint

#### Scenario: Acesso a endpoint protegido sem token
- **WHEN** o usuário envia requisição sem header Authorization
- **THEN** o sistema DEVE retornar HTTP 401

#### Scenario: Token expirado
- **WHEN** o usuário envia requisição com token expirado
- **THEN** o sistema DEVE retornar HTTP 401

### Requirement: CORS configurado
O sistema NÃO DEVE usar CORS com wildcard ("*"). DEVE permitir apenas origens configuradas.

#### Scenario: Origem permitida
- **WHEN** requisição vem de origem configurada em ALLOWED_ORIGINS
- **THEN** os headers CORS DEVEM ser adicionados à resposta

#### Scenario: Origem não permitida
- **WHEN** requisição vem de origem não configurada
- **THEN** os headers CORS NÃO DEVEM ser adicionados

### Requirement: Validação de input
Todo input da API DEVE ser validado via Pydantic v2 antes do processamento.

#### Scenario: Input inválido rejeitado
- **WHEN** o usuário envia dados que não passam na validação Pydantic
- **THEN** o sistema DEVE retornar HTTP 422 com detalhes do erro
