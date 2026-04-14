---
title: "UI Design Specification - LaCuisine"
status: "proposed"
type: "design"
---

# Especificação de Design: Culinary Zen

## 1. Identidade Visual (Design System)

### 1.1 Cores
- **Preto Elegante:** `#111111`
- **Branco:** `#FFFFFF`
- **Cinza:** `#6f6f6f`
- **Bege Claro:** `#F4EFE7`
- **Dourado Suave:** `#C9A46A`

### 1.2 Tipografia
- **Títulos (H1, H2):** `Playfair Display` (Serifada elegante).
- **Subtítulos/Apoio:** `Cormorant Garamond`.
- **Corpo e Interface:** `Montserrat` (Sans-serif geométrica para legibilidade mobile).

## 2. Arquitetura de Telas (Navegação em Camadas)

### 2.1 Tela: O Agente (Home/Chat)
- Chat centralizado sem bolhas pesadas.
- Respostas da IA usando tipografia Montserrat com entrelinha generosa.
- **Cards Interativos:** Componentes de receita que aparecem no chat com botões de "Lápis" e "Check".

### 2.2 Tela: Livro de Receitas
- Grid de duas colunas com fotos grandes.
- Busca conversacional no topo.
- **Smart View:** Clicar numa receita abre um popup/resumo com uma setinha (ícone de expansão) para ver informações financeiras básicas.

### 2.3 Tela: Detalhes da Receita (Modo Cozinhador)
- Imagem de capa -> Nome -> Botão "Ver Detalhes do Preparo" -> Lista de Ingredientes e Modos.
- Botão fixo no rodapé: "Abrir Ficha Técnica".

### 2.4 Tela: Ficha Técnica (Modo Gestor)
- Tabela minimalista com pesos e custos.
- Cálculos automáticos de margem de lucro e custo por porção.
- Edição direta em cada campo.

## 3. Componentes Chave
- **ChatInput:** Com suporte a Drag & Drop (Drop & Chat).
- **RecipeCard:** Com visual "glassmorphism" sutil.
- **FixedNavBar:** Baseada em ícones para evitar conflitos de gestos mobile.
