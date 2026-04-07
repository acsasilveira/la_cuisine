## MODIFIED Requirements

### Requirement: Sugestão de Menu com autenticação

O sistema DEVE exigir autenticação para o endpoint POST /api/menus/suggest. A sugestão de menu DEVE considerar apenas as receitas do usuário autenticado.

#### Scenario: Sugestão de menu autenticado
- **WHEN** o usuário autenticado envia POST /api/menus/suggest
- **THEN** o sistema filtra as receitas do banco pelo user_id do token antes de enviar à IA

#### Scenario: Sugestão de menu sem autenticação
- **WHEN** o usuário envia POST /api/menus/suggest sem header Authorization
- **THEN** o sistema retorna HTTP 401
