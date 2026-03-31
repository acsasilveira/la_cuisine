## ADDED Requirements

### Requirement: Sugestão de menu com IA
O sistema DEVE permitir gerar sugestões de menu via `POST /api/menus/suggest` usando a Gemini API e receitas existentes no banco.

#### Scenario: Menu gerado com sucesso
- **WHEN** o usuário envia POST /api/menus/suggest com uma receita base (recipe_id e category)
- **THEN** o sistema DEVE carregar receitas existentes do banco
- **THEN** o sistema DEVE enviar contexto (receitas + receita base) para a Gemini API
- **THEN** a IA DEVE retornar JSON com menus contendo entrada, principal, sobremesa e justificativa
- **THEN** o sistema DEVE retornar HTTP 200 com lista de menus

#### Scenario: Receitas existentes priorizadas
- **WHEN** o menu é gerado e existem receitas suficientes no banco
- **THEN** a IA DEVE priorizar receitas existentes (is_new: false)

#### Scenario: IA sugere receitas novas
- **WHEN** não existem receitas suficientes no banco para completar o menu
- **THEN** a IA PODE sugerir receitas novas (is_new: true)
- **THEN** receitas novas NÃO DEVEM ter id

#### Scenario: Receitas novas não são salvas automaticamente
- **WHEN** o menu contém receitas com is_new: true
- **THEN** o sistema NÃO DEVE persistir essas receitas no banco automaticamente

#### Scenario: Erro de validação
- **WHEN** os dados de entrada são inválidos
- **THEN** o sistema DEVE retornar HTTP 422

#### Scenario: IA falha
- **WHEN** a Gemini API falha ou retorna formato inválido
- **THEN** o sistema DEVE retornar HTTP 504 (falha) ou HTTP 502 (formato inválido)

### Requirement: Formato de resposta do menu
A resposta do endpoint de menu DEVE seguir o schema definido.

#### Scenario: Schema do menu
- **WHEN** o endpoint retorna um menu
- **THEN** cada item do menu DEVE conter: name (string), is_new (boolean)
- **THEN** cada menu DEVE conter: entrada, principal, sobremesa, justificativa
