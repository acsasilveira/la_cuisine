# Specs - Menu


## RF-010 Gerar menu com IA

Dado que o usuário seleciona uma receita base

Quando POST /api/menus/suggest

Então o sistema deve carregar receitas do banco

E enviar contexto para Gemini API

E a IA deve retornar JSON estruturado

Formato esperado:

{
  "menus": [
    {
      "entrada": { "name": string, "is_new": boolean },
      "principal": { "name": string, "is_new": boolean },
      "sobremesa": { "name": string, "is_new": boolean },
      "justificativa": string
    }
  ]
}

Então o backend deve validar o JSON

E retornar HTTP 200


Se erro de validação

Então retornar HTTP 422


Se erro na IA

Então retornar HTTP 504



## RF-011 Menu deve priorizar receitas do banco

Dado que existem receitas cadastradas

Quando o menu é gerado

Então o sistema deve enviar receitas existentes para IA

E IA deve priorizar receitas existentes

Receitas existentes devem ter:

"is_new": false



## RF-012 IA pode sugerir receitas novas

Dado que não existem receitas suficientes

Quando o menu é gerado

Então IA pode sugerir receitas novas

Receitas novas devem ter:

"is_new": true

Receitas novas não devem ter id



## RF-013 Receitas novas não devem ser salvas automaticamente

Dado que o menu contém receitas novas

Quando o menu é retornado

Então o sistema não deve salvar no banco

Somente salvar após confirmação do usuário



## RF-014 Ajustar menu via chat

Dado que um menu já foi gerado

E o usuário envia nova instrução

Quando POST /api/chat/copilot

Então o sistema deve enviar:

- menu atual
- mensagem do usuário
- receitas do banco

Para Gemini

E IA deve retornar novo menu

Formato deve seguir RF-010



## RF-015 Chat pode gerar menus

Dado que o usuário envia mensagem

Quando POST /api/chat/copilot

Então a IA pode retornar menu

Resposta deve ser JSON

Formato:

{
  "type": "menu",
  "menus": [
    {
      "entrada": { "name": string, "is_new": boolean },
      "principal": { "name": string, "is_new": boolean },
      "sobremesa": { "name": string, "is_new": boolean }
    }
  ]
}

Se resposta inválida

Então retornar HTTP 502



## RF-016 Chat deve indicar tipo de resposta

Toda resposta do chat deve conter campo:

"type"

Valores permitidos:

"text"
"recipe"
"menu"


Se type = text

{
  "type": "text",
  "message": string
}


Se type = recipe

Deve seguir recipe spec


Se type = menu

Deve seguir RF-015



## RF-017 Validação

Toda resposta da IA deve ser validada

Todo JSON deve seguir schema

Campos extras não são permitidos

Campos obrigatórios não podem faltar



## RF-018 Persistência

Menus não são persistidos automaticamente

Somente receitas confirmadas podem ser salvas

Banco deve ser PostgreSQL

IDs devem ser UUID