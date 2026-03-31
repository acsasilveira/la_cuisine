## ADDED Requirements

### Requirement: Testes unitários da camada Domain
Os testes unitários DEVEM cobrir entidades, enums e validações da camada Domain sem dependência de banco ou API.

#### Scenario: Entidade Recipe válida
- **WHEN** uma entidade Recipe é criada com dados válidos
- **THEN** todos os campos DEVEM ser preenchidos corretamente
- **THEN** o id DEVE ser UUID gerado automaticamente

#### Scenario: Entidade Recipe com categoria inválida
- **WHEN** uma entidade Recipe é criada com categoria que não existe no enum
- **THEN** DEVE lançar ValidationError

### Requirement: Testes unitários dos Use Cases
Os testes unitários DEVEM cobrir os use cases da camada Application usando mocks para repositórios.

#### Scenario: Use case CreateRecipe com mock
- **WHEN** o use case CreateRecipe é executado com dados válidos e repositório mockado
- **THEN** o repositório.create DEVE ser chamado uma vez
- **THEN** DEVE retornar a receita criada

#### Scenario: Use case ListRecipes com mock
- **WHEN** o use case ListRecipes é executado com repositório mockado retornando lista
- **THEN** DEVE retornar a lista de receitas

### Requirement: Testes de integração dos repositórios
Os testes de integração DEVEM testar repositórios contra um banco PostgreSQL de teste real.

#### Scenario: Repositório persiste receita
- **WHEN** o repositório RecipeRepository.create é chamado com dados válidos
- **THEN** a receita DEVE ser persistida no banco de teste
- **THEN** RecipeRepository.get_by_id DEVE retornar a receita persistida

#### Scenario: Fixture de banco de teste
- **WHEN** os testes de integração executam
- **THEN** DEVE existir uma fixture pytest que cria um banco temporário
- **THEN** cada teste DEVE rodar em uma transação que é revertida após execução

### Requirement: Testes E2E dos endpoints
Os testes E2E DEVEM testar os endpoints FastAPI usando httpx.AsyncClient.

#### Scenario: POST /api/recipes retorna 201
- **WHEN** o teste envia POST /api/recipes com dados válidos via httpx
- **THEN** a resposta DEVE ter status 201
- **THEN** o body DEVE conter id UUID e os dados enviados

#### Scenario: GET /api/recipes retorna lista
- **WHEN** o teste envia GET /api/recipes após criar uma receita
- **THEN** a resposta DEVE ter status 200
- **THEN** o body DEVE conter a receita criada

#### Scenario: POST /api/recipes com dados inválidos retorna 422
- **WHEN** o teste envia POST /api/recipes sem campos obrigatórios
- **THEN** a resposta DEVE ter status 422

### Requirement: Configuração pytest
O sistema DEVE usar pytest com pytest-asyncio e fixtures reutilizáveis.

#### Scenario: Testes executam com sucesso
- **WHEN** `pytest` é executado no diretório backend
- **THEN** todos os testes DEVEM passar
- **THEN** DEVE usar pytest-asyncio para testes async
- **THEN** DEVE usar httpx para testes de API
