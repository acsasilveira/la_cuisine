## MODIFIED Requirements

### Requirement: Chat Copiloto com autenticação

O sistema DEVE exigir autenticação para o endpoint POST /api/chat/copilot. O contexto do chat DEVE ser associado ao usuário autenticado.

#### Scenario: Chat autenticado
- **WHEN** o usuário autenticado envia POST /api/chat/copilot com uma mensagem
- **THEN** o sistema processa a mensagem e retorna a resposta da IA

#### Scenario: Chat sem autenticação
- **WHEN** o usuário envia POST /api/chat/copilot sem header Authorization
- **THEN** o sistema retorna HTTP 401
