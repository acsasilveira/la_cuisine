---
title: "LaCuisine Architecture & Design Proposal"
status: "proposed"
type: "architecture"
---

# LaCuisine - Proposta de Arquitetura e Engenharia

## 1. Objetivo

A aplicação LaCuisine é um sistema web para chefs autônomos que desejam:

- Gerenciar receitas
- Gerar fichas técnicas automaticamente
- Criar menus equilibrados
- Utilizar IA para auxiliar criação culinária

O sistema deve ser confiável, estruturado e compatível com geração automática de código via IA (OpenSpec).

---

## 2. Stack Tecnológica

### Backend

- Python 3.11+
- FastAPI 0.104+
- Pydantic v2
- SQLModel
- PostgreSQL 14+
- Alembic migrations

### Frontend

- Next.js 14+
- TypeScript
- TailwindCSS
- shadcn/ui
- React Query (TanStack)

### IA

- Google Gemini 1.5 Flash
- API REST
- JSON structured output obrigatório

### Infra

- Docker obrigatório
- Variáveis via .env
- Deploy compatível com Supabase / Neon / Railway / Render

---

## 3. Casos de Uso Core

### 3.1 RF-001 Criar Receita Manualmente

O sistema deve permitir criar receitas com:

- Nome
- Categoria
- Rendimento
- Ingredientes
- Passos
- Imagem do Prato

### 3.2 RF-002 Criar Receita por Imagem

Dado que o usuário envia uma imagem

Quando chama POST /api/recipes/analyze-image

Então o sistema deve retornar JSON estruturado

Campos obrigatórios:

- title
- category
- yield
- ingredients
- steps
- image_url

Se imagem inválida → HTTP 400  
Se IA falhar → HTTP 504

---

### 3.3 RF-003 Gerar Menu com IA

Dado que o usuário seleciona uma receita

Quando chama POST /api/menus/suggest

Então retorna lista de menus com:

- entrada
- principal
- sobremesa
- justificativa

---

### 3.4 RF-004 Chat Copiloto

Dado que o usuário envia texto

Quando chama POST /api/chat/copilot

Então retorna sugestão culinária

Se aprovado → pode virar receita

---

## 4. Modelo de Dados Inicial

Tabela recipes

- id UUID
- title string
- category enum
- yield_amount number
- yield_unit string
- image_url string
- created_at datetime

Tabela ingredients

Tabela recipe_ingredients

Tabela recipe_steps

---

## 5. Requisitos Não Funcionais

RNF-001 Resposta da IA deve ser < 10s

RNF-002 API deve validar dados via Pydantic

RNF-003 Tipos TS devem ser gerados via OpenAPI

RNF-004 Backend deve usar SQLModel como source of truth

RNF-005 Frontend deve usar shadcn/ui

RNF-006 Docker obrigatório

RNF-007 Variáveis via .env

RNF-008 Não usar any no TypeScript

RNF-009 CORS não pode usar "*"

RNF-010 HTTPS obrigatório em produção

---

## 6. Próximas Fases

1 Setup repo
2 Setup DB
3 CRUD receitas
4 IA integração
5 Frontend
6 Deploy