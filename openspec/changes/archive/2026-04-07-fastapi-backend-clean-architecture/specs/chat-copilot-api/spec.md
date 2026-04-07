## ADDED Requirements

### Requirement: Chat culinário com IA
O sistema DEVE fornecer um endpoint `POST /api/chat/copilot` que envia mensagens do usuário para a Gemini API e retorna respostas tipadas.

#### Scenario: Resposta tipo texto
- **WHEN** o usuário envia uma mensagem e a IA responde com tipo "text"
- **THEN** o sistema DEVE retornar HTTP 200 com `{ "type": "text", "data": { "message": string } }`

#### Scenario: Resposta tipo receita
- **WHEN** o usuário envia uma mensagem e a IA responde com tipo "recipe"
- **THEN** o sistema DEVE retornar HTTP 200 com `{ "type": "recipe", "data": { RecipeDraft } }`
- **THEN** os campos obrigatórios DEVEM ser: title, category, yield_amount, yield_unit, ingredients, steps

#### Scenario: Resposta tipo menu
- **WHEN** o usuário envia uma mensagem e a IA responde com tipo "menu"
- **THEN** o sistema DEVE retornar HTTP 200 com `{ "type": "menu", "data": { "menus": [...] } }`
- **THEN** o formato DEVE seguir o schema de menu (entrada, principal, sobremesa)

#### Scenario: Requisição inválida
- **WHEN** o usuário envia requisição sem mensagem
- **THEN** o sistema DEVE retornar HTTP 400

#### Scenario: IA falha
- **WHEN** a Gemini API falha
- **THEN** o sistema DEVE retornar HTTP 504

### Requirement: Contexto do chat
O chat DEVE manter contexto entre mensagens na mesma sessão.

#### Scenario: Contexto mantido
- **WHEN** o usuário envia múltiplas mensagens na mesma sessão
- **THEN** o sistema DEVE enviar mensagens anteriores + menu atual + receitas do banco como contexto para a IA
- **THEN** a IA DEVE respeitar o contexto fornecido

### Requirement: Transformar chat em receita
O sistema DEVE permitir que uma sugestão do chat seja convertida em receita.

#### Scenario: Sugestão convertida
- **WHEN** o usuário solicita gerar receita a partir de uma sugestão do chat
- **THEN** o sistema DEVE chamar a Gemini API novamente com o contexto
- **THEN** a IA DEVE retornar JSON no formato RecipeDraft
- **THEN** o backend DEVE validar com Pydantic e retornar RecipeDraft

### Requirement: Segurança do chat
O chat NÃO DEVE executar código, acessar o banco diretamente, ou retornar dados não validados.

#### Scenario: Resposta sempre validada
- **WHEN** a IA retorna qualquer resposta
- **THEN** o backend DEVE validar o JSON com Pydantic antes de retornar
- **THEN** se o formato for inválido, DEVE retornar HTTP 502
