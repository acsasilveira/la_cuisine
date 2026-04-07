## ADDED Requirements

### Requirement: Criar receita manualmente
O sistema DEVE permitir criar uma receita via `POST /api/recipes` com validação Pydantic v2.

#### Scenario: Receita criada com sucesso
- **WHEN** o usuário envia POST /api/recipes com dados válidos (title, category, yield_amount, yield_unit, ingredients, steps)
- **THEN** o sistema DEVE validar com Pydantic
- **THEN** o sistema DEVE persistir no PostgreSQL
- **THEN** o sistema DEVE retornar HTTP 201 com RecipeResponse (id UUID, title, category, created_at)

#### Scenario: Dados inválidos
- **WHEN** o usuário envia POST /api/recipes com campos obrigatórios ausentes
- **THEN** o sistema DEVE retornar HTTP 422 com detalhes de validação

### Requirement: Listar receitas
O sistema DEVE permitir listar receitas via `GET /api/recipes`.

#### Scenario: Receitas existentes
- **WHEN** o usuário faz GET /api/recipes e existem receitas no banco
- **THEN** o sistema DEVE retornar HTTP 200 com lista de RecipeResponse

#### Scenario: Sem receitas
- **WHEN** o usuário faz GET /api/recipes e não existem receitas
- **THEN** o sistema DEVE retornar HTTP 200 com lista vazia `[]`

### Requirement: Obter receita por ID
O sistema DEVE permitir buscar uma receita específica via `GET /api/recipes/{id}`.

#### Scenario: Receita encontrada
- **WHEN** o usuário faz GET /api/recipes/{id} com um UUID válido existente
- **THEN** o sistema DEVE retornar HTTP 200 com RecipeResponse incluindo ingredients e steps

#### Scenario: Receita não encontrada
- **WHEN** o usuário faz GET /api/recipes/{id} com um UUID que não existe
- **THEN** o sistema DEVE retornar HTTP 404

### Requirement: Validação de entrada e saída
Todos os inputs DEVEM ser validados via Pydantic v2. Todos os outputs DEVEM seguir o schema definido.

#### Scenario: Schema de resposta consistente
- **WHEN** qualquer endpoint de receita retorna dados
- **THEN** a resposta DEVE seguir exatamente o schema RecipeResponse sem campos extras
- **THEN** os tipos DEVEM ser compatíveis com geração de TypeScript via OpenAPI

### Requirement: Persistência com UUID e Foreign Keys
Receitas DEVEM ser armazenadas em PostgreSQL com ID UUID e relacionamentos via Foreign Key.

#### Scenario: Receita com ingredientes e passos
- **WHEN** uma receita é criada com ingredientes e passos
- **THEN** RecipeIngredient DEVE ter FK para Recipe e Ingredient
- **THEN** RecipeStep DEVE ter FK para Recipe
- **THEN** os IDs DEVEM ser UUID gerados automaticamente
