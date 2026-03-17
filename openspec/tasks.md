---
title: "LaCuisine Implementation Tasks"
status: "proposed"
type: "tasks"
---

# Implementation Plan


## Phase 1 — Setup & Infrastructure

### Task 1.1 — Init frontend

- Create Next.js project
- Configure TypeScript
- Configure Tailwind
- Configure shadcn/ui

Acceptance:

- Project runs
- No TypeScript errors


### Task 1.2 — Init backend

- Create FastAPI project
- Create folder structure (domain / api / infrastructure)

Acceptance:

- FastAPI runs
- OpenAPI available


### Task 1.3 — Setup database

- Configure PostgreSQL
- Configure SQLModel
- Create migration

Acceptance:

- DB connection works
- Tables created


### Task 1.4 — Env config

- Create .env
- Add DATABASE_URL
- Add GEMINI_API_KEY

Acceptance:

- Backend reads env
- No hardcoded keys



## Phase 2 — Recipe Domain


### Task 2.1 — Create models

RF-001 RF-002 RF-004

- Create SQLModel Recipe
- Create Pydantic schemas

Acceptance:

- Model matches design
- Schema matches spec


### Task 2.2 — Create recipe endpoints

RF-001 RF-002 RF-004

- POST /api/recipes
- GET /api/recipes
- GET /api/recipes/{id}

Acceptance:

- Returns JSON
- Uses Pydantic
- Validates input


### Task 2.3 — Image analyze endpoint

RF-003

- POST /api/recipes/analyze-image
- Call Gemini
- Validate JSON

Acceptance:

- Returns RecipeDraft
- Invalid image → 400
- Invalid JSON → 502



## Phase 3 — Menu Feature


### Task 3.1 — Menu endpoint

RF-010 RF-011 RF-012

- POST /api/menus/suggest
- Load recipes from DB
- Call Gemini

Acceptance:

- Returns menu JSON
- Matches schema


### Task 3.2 — Menu validation

RF-017 RF-018

- Validate AI response
- Check is_new

Acceptance:

- Invalid JSON → 502
- Valid JSON → 200



## Phase 4 — Chat Copilot


### Task 4.1 — Chat endpoint

RF-020

- POST /api/chat/copilot

Acceptance:

- Returns JSON
- Contains type field


### Task 4.2 — Chat type text

RF-021

Acceptance:

- type=text works


### Task 4.3 — Chat type recipe

RF-022

Acceptance:

- Matches recipe spec


### Task 4.4 — Chat type menu

RF-023

Acceptance:

- Matches menu spec


### Task 4.5 — Context support

RF-025

Acceptance:

- Chat remembers context



## Phase 5 — Frontend


### Task 5.1 — Layout

- Sidebar
- Header

Acceptance:

- App renders


### Task 5.2 — Recipe list

RF-002

Acceptance:

- Shows recipes


### Task 5.3 — Recipe create

RF-001 RF-003

Acceptance:

- Can create
- Can upload image


### Task 5.4 — Menu UI

RF-010

Acceptance:

- Shows menu


### Task 5.5 — Chat UI

RF-020

Acceptance:

- Chat works



## Phase 6 — Deployment


### Task 6.1 — Docker

Acceptance:

- docker-compose runs


### Task 6.2 — Deploy backend

Acceptance:

- API online


### Task 6.3 — Deploy frontend

Acceptance:

- UI online


### Task 6.4 — Final test

Acceptance:

- All RF work