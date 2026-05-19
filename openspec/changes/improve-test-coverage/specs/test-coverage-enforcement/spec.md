## ADDED Requirements

### Requirement: Cobertura de Testes para Entidade Menu
O sistema DEVE possuir testes unitários que validem a criação e validação de dados das entidades de Menu.

#### Scenario: Validação de dados válidos do Menu
- **WHEN** uma instância de MenuBase é criada com título e ocasião válidos
- **THEN** a instância deve ser criada sem erros de validação

### Requirement: Testes de Integração para MenuRepository
O sistema DEVE possuir testes que validem as operações de CRUD no banco de dados para os Menus e seus itens.

#### Scenario: Persistência de Menu com itens
- **WHEN** o MenuRepository.create é chamado com um dicionário de dados de menu
- **THEN** o menu e seus itens devem ser salvos no banco de dados e recuperáveis via ID

### Requirement: Testes E2E para Menu API
O sistema DEVE possuir testes que simulem o fluxo completo de um usuário criando e listando seus menus via API.

#### Scenario: Fluxo completo de criação de menu autenticado
- **WHEN** um usuário autenticado envia um POST para /api/menus
- **THEN** o sistema deve retornar 201 e o menu deve estar disponível na listagem do usuário
