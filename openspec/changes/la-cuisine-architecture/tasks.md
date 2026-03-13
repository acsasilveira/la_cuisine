---
title: "LaCuisine Implementation Tasks"
status: "proposed"
type: "tasks"
---

# Implementation Plan

This document outlines the step-by-step implementation tasks for the LaCuisine architecture.

## Phase 1: Setup & Infrastructure
- [ ] Initialize Next.js project with TailwindCSS and simple design system (colors, typography).
- [ ] Initialize FastAPI project with Poetry/venv and basic project structure.
- [ ] Set up PostgreSQL database (Supabase/Neon) and run initial migrations (`recipes`, `ingredients`, etc.).
- [ ] Configure environment variables for both Front and Back (`DATABASE_URL`, `GEMINI_API_KEY`).

## Phase 2: Core Domain (Backend)
- [ ] Create SQLAlchemy/SQLModel models for the database schema.
- [ ] Implement basic CRUD endpoints for Recipes (`GET /recipes`, `POST /recipes`, `GET /recipes/{id}`).
- [ ] Implement basic CRUD endpoints for Ingredients.

## Phase 3: AI Integration (The "Mágicas")
- [ ] Create Google Cloud Project, enable Gemini API, and get API Key.
- [ ] Implement Python service class for Gemini interaction (`google-genai` SDK).
- [ ] **Task 3.1: Digitador Universal**
    - [ ] Create prompt template for extracting recipe data from images.
    - [ ] Create endpoint `POST /recipes/analyze-image` that accepts a file, calls Gemini, and returns the structured JSON.
- [ ] **Task 3.2: Sommelier de Menus**
    - [ ] Create endpoint `POST /menus/suggest` that receives a base recipe ID.
    - [ ] Implement logic to fetch user's recipes and send context to Gemini for menu suggestions.
- [ ] **Task 3.3: Copiloto Criativo**
    - [ ] Create endpoint `POST /chat/copilot` for interactive ingredient-based suggestions.

## Phase 4: Frontend Implementation (Next.js)
- [ ] Create Application Shell (Sidebar, Header, Main Content Area).
- [ ] **Task 4.1: Recipe Catalog**
    - [ ] List View: Display recipes with images and basic info.
    - [ ] Detail View: Show full technical sheet.
- [ ] **Task 4.2: Recipe Creation Flow (AI-Powered)**
    - [ ] Build upload component for images.
    - [ ] Build form that auto-fills based on the `analyze-image` endpoint response.
    - [ ] Allow manual adjustments and final save.
- [ ] **Task 4.3: Menu Planner**
    - [ ] UI for selecting a base recipe and requesting suggestions.
    - [ ] Display Gemini's suggested menus with justifications.

## Phase 5: Polish & Deployment
- [ ] Add loading states and error handling for AI requests.
- [ ] Deploy Next.js to Vercel.
- [ ] Deploy FastAPI to Render/Railway.
- [ ] Final end-to-end testing.
