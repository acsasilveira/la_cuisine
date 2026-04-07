## ADDED Requirements

### Requirement: Análise de imagem de receita via IA
O sistema DEVE permitir enviar uma imagem via `POST /api/recipes/analyze-image` e retornar dados estruturados da receita extraídos pela Gemini API.

#### Scenario: Imagem válida analisada com sucesso
- **WHEN** o usuário envia POST /api/recipes/analyze-image com uma imagem válida (multipart/form-data)
- **THEN** o sistema DEVE enviar a imagem para a Gemini API
- **THEN** a IA DEVE retornar JSON com: title, category, yield_amount, yield_unit, ingredients, steps
- **THEN** o backend DEVE validar o JSON com Pydantic
- **THEN** o sistema DEVE retornar HTTP 200 com RecipeDraft

#### Scenario: Imagem inválida
- **WHEN** o usuário envia arquivo que não é imagem ou arquivo corrompido
- **THEN** o sistema DEVE retornar HTTP 400 com mensagem de erro

#### Scenario: IA retorna formato inválido
- **WHEN** a Gemini API retorna JSON que não segue o schema esperado
- **THEN** o backend DEVE retornar HTTP 502 com mensagem indicando erro de formato

#### Scenario: IA falha ou timeout
- **WHEN** a Gemini API não responde em 10 segundos ou retorna erro
- **THEN** o sistema DEVE retornar HTTP 504

### Requirement: Validação obrigatória da resposta da IA
Toda resposta da Gemini API DEVE ser validada com Pydantic antes de ser retornada ao cliente.

#### Scenario: Campos extras ignorados
- **WHEN** a IA retorna JSON com campos que não existem no schema
- **THEN** o sistema DEVE ignorar os campos extras e retornar apenas os campos definidos

#### Scenario: Campos obrigatórios ausentes
- **WHEN** a IA retorna JSON sem campos obrigatórios (ex: title ausente)
- **THEN** o sistema DEVE retornar HTTP 502
