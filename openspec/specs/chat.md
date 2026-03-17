# Specs - Chat Copilot


## RF-020 Chat culinário

Dado que o usuário envia uma mensagem de texto

Quando POST /api/chat/copilot

Então o sistema deve enviar a mensagem para Gemini API

E a IA deve retornar JSON

Formato esperado:

{
  "type": "text" | "recipe" | "menu",
  "data": {}
}

Então o backend deve validar o JSON

E retornar HTTP 200


Se requisição inválida

Então retornar HTTP 400


Se erro na IA

Então retornar HTTP 504



## RF-021 Resposta tipo texto

Se type = "text"

Formato esperado:

{
  "type": "text",
  "data": {
    "message": string
  }
}

Mensagem deve ser texto simples

Não pode conter campos extras



## RF-022 Resposta tipo receita

Se type = "recipe"

Formato deve seguir recipe spec

Campos obrigatórios:

- title
- category
- yield_amount
- yield_unit
- ingredients
- steps


Formato esperado:

{
  "type": "recipe",
  "data": {
    "title": string,
    "category": string,
    "yield_amount": number,
    "yield_unit": string,
    "ingredients": [],
    "steps": []
  }
}


Se formato inválido

Então retornar HTTP 502



## RF-023 Resposta tipo menu

Se type = "menu"

Formato deve seguir menu spec

Formato esperado:

{
  "type": "menu",
  "data": {
    "menus": [
      {
        "entrada": { "name": string, "is_new": boolean },
        "principal": { "name": string, "is_new": boolean },
        "sobremesa": { "name": string, "is_new": boolean }
      }
    ]
  }
}


Se formato inválido

Então retornar HTTP 502



## RF-024 Transformar chat em receita

Dado que a IA gerou sugestão de prato

Quando o usuário solicita gerar receita

Então o sistema deve chamar Gemini novamente

E gerar JSON no formato recipe spec

Então validar com Pydantic

E retornar RecipeDraft



## RF-025 Contexto do chat

O chat deve manter contexto

Contexto pode conter:

- mensagens anteriores
- menu atual
- receitas do banco

O contexto deve ser enviado para IA

IA deve respeitar contexto



## RF-026 Validação

Todas respostas devem ser JSON

Todos campos devem seguir schema

Campos extras não são permitidos

Campos obrigatórios não podem faltar



## RF-027 Segurança

Chat não pode executar código

Chat não pode acessar banco diretamente

Chat só responde via backend

Backend valida toda resposta da IA