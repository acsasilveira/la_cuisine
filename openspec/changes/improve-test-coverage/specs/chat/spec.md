## MODIFIED Requirements

### Requirement: RF-020 Chat culinário
Dado que o usuário envia uma mensagem de texto, o sistema deve processar via IA e retornar formato JSON. O sistema SHALL tratar falhas na Gemini API Gracefully.

#### Scenario: Chat com resposta válida da IA
- **WHEN** o usuário envia mensagem válida
- **THEN** o sistema retorna JSON 200 com a resposta da IA

#### Scenario: Tratamento de Timeout na IA
- **WHEN** a Gemini API demora mais que o limite configurado
- **THEN** o sistema retorna HTTP 504 com mensagem "IA não respondeu a tempo"

#### Scenario: Tratamento de Formato Inválido da IA
- **WHEN** a IA retorna um JSON que não segue o esquema esperado
- **THEN** o sistema lança ValueError e o roteador retorna HTTP 502
