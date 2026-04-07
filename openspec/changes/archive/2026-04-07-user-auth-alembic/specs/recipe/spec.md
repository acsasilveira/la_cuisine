## MODIFIED Requirements

### Requirement: RF-001 Criar Receita Manualmente

Dado que o usuário está autenticado (cookie session válido) e envia dados válidos no formato RecipeCreate

Quando a requisição POST /api/recipes é feita

Então o sistema DEVE ler o cookie session, extrair user_id do JWT

E vincular a receita ao user_id

E salvar a receita no banco PostgreSQL

E retornar HTTP 201

E retornar JSON no formato RecipeResponse

Se dados inválidos → HTTP 422
Se cookie ausente ou inválido → HTTP 401
Se erro interno → HTTP 500

#### Scenario: Criar receita autenticado
- **WHEN** o usuário autenticado (com cookie session) envia POST /api/recipes com dados válidos
- **THEN** a receita é criada com user_id do token e retorna HTTP 201

#### Scenario: Criar receita sem autenticação
- **WHEN** o usuário envia POST /api/recipes sem cookie session
- **THEN** o sistema retorna HTTP 401

### Requirement: RF-002 Listar receitas

Dado que o usuário está autenticado (cookie session válido)

Quando a requisição GET /api/recipes é feita

Então o sistema DEVE consultar o banco filtrando por user_id do cookie

E retornar apenas as receitas do usuário autenticado

E retornar HTTP 200

#### Scenario: Listar receitas do usuário
- **WHEN** o usuário autenticado envia GET /api/recipes
- **THEN** o sistema retorna apenas as receitas que pertencem ao usuário

#### Scenario: Usuário sem receitas
- **WHEN** o usuário autenticado não possui receitas
- **THEN** o sistema retorna lista vazia com HTTP 200

### Requirement: RF-004 Obter receita por ID

Dado que a receita existe e pertence ao usuário autenticado

Quando GET /api/recipes/{id}

Então o sistema DEVE verificar que a receita pertence ao user_id do cookie

E retornar RecipeResponse com HTTP 200

Se a receita não existir ou pertencer a outro usuário → HTTP 404

#### Scenario: Obter receita própria
- **WHEN** o usuário autenticado busca uma receita que pertence a ele
- **THEN** o sistema retorna a receita com HTTP 200

#### Scenario: Obter receita de outro usuário
- **WHEN** o usuário autenticado busca uma receita que pertence a outro usuário
- **THEN** o sistema retorna HTTP 404

### Requirement: RF-006 Persistência

Receitas DEVEM ser armazenadas em PostgreSQL com coluna user_id (FK → users.id) NOT NULL

#### Scenario: Receita vinculada ao usuário
- **WHEN** uma receita é salva no banco
- **THEN** a coluna user_id contém o UUID do usuário que a criou
