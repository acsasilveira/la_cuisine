# Specs - Recipes

## RF-001 Criar Receita Manualmente

Dado que o usuário está autenticado (cookie session válido) e envia dados válidos no formato RecipeCreate

Quando a requisição POST /api/recipes é feita

Então o sistema DEVE ler o cookie session, extrair user_id do JWT

E vincular a receita ao user_id

E salvar a receita no banco PostgreSQL

E retornar HTTP 201

E retornar JSON no formato RecipeResponse


Se dados inválidos

Então retornar HTTP 422


Se erro interno

Então retornar HTTP 500



## RF-002 Listar receitas

Dado que o usuário está autenticado (cookie session válido)

Quando a requisição GET /api/recipes é feita

Então o sistema DEVE consultar o banco filtrando por user_id do cookie

E retornar apenas as receitas do usuário autenticado

E retornar HTTP 200


Se não houver receitas

Então retornar lista vazia



## RF-003 Criar receita por imagem

Dado que o usuário envia uma imagem válida

Quando POST /api/recipes/analyze-image

Então o sistema deve enviar a imagem para Gemini API

E a IA deve retornar JSON estruturado

O JSON deve seguir o schema:

- title: string
- category: string
- yield_amount: number
- yield_unit: string
- ingredients: array
- steps: array
- image_url: string


Então o backend deve validar o JSON com Pydantic

E retornar RecipeDraft


Se imagem inválida

Então retornar HTTP 400


Se IA retornar formato inválido

Então retornar HTTP 502


Se IA falhar

Então retornar HTTP 504



## RF-004 Obter receita por ID

Dado que a receita existe e pertence ao usuário autenticado

Quando GET /api/recipes/{id}

Então o sistema DEVE verificar que a receita pertence ao user_id do cookie

E retornar RecipeResponse com HTTP 200


Se não existir

Então retornar HTTP 404



## RF-005 Estrutura de resposta da API

Todas as respostas devem ser JSON

Todas devem seguir schema definido no backend

Nenhuma resposta pode conter campos extras

Tipos devem ser compatíveis com TypeScript

Schemas devem ser gerados pelo OpenAPI



## RF-006 Persistência

Receitas devem ser armazenadas em PostgreSQL com coluna user_id (FK → users.id) NOT NULL

ID deve ser UUID

Relacionamentos devem usar Foreign Key

Migrations devem ser usadas



## RF-007 Validação

Todos inputs devem ser validados

Todos outputs devem ser validados

Dados devem seguir schema Pydantic

Dados inválidos devem retornar erro