---
title: "LaCuisine Architecture & Design Proposal"
status: "proposed"
type: "architecture"
---

# LaCuisine - Proposta de Arquitetura e Engenharia

**Objetivo:** Uma aplicação web voltada para Chefs autônomos que desejam gerenciar suas receitas, gerar fichas técnicas automaticamente através de Inteligência Artificial e construir menus equilibrados utilizando o seu próprio acervo gastronômico.

## 1. Visão Geral

A aplicação deixará de ser apenas um "caderno de receitas digital" para se tornar uma **ferramenta de trabalho crítica** focada em padronização (rendimento, modo de preparo exato, fotos de empratamento) e auxílio criativo (sugestões de harmonização e criação de pratos usando ingredientes disponíveis).

Para atingir esses objetivos mantendo os custos de infraestrutura baixos (foco em APIs gratuitas num momento inicial), propomos a seguinte base tecnológica:

- **Frontend:** Next.js (React)
- **Backend:** Python (FastAPI)
- **IA Generativa:** API Google Gemini (versão free-tier 1.5 Flash - suporte Multimodal para ler imagens de receitas manuscritas e extrair JSONs formatados).
- **Banco de Dados:** PostgreSQL (sugestão inicial de hospedagem *Supabase* ou *Neon* para agilidade e tier gratuito).

## 2. Casos de Uso Core (A "Mágica" da IA)

### 2.1. O "Digitador Universal" (Visão Computacional + Estruturação)
- **Ação:** A Chef tira uma foto de uma receita num caderno antigo ou copia um texto não formatado.
- **Processamento:** O backend envia a imagem/texto ao Google Gemini pedindo a extração dos dados no formato da **Ficha Técnica Operacional**.
- **Resultado:** O frontend exibe um formulário pré-preenchido com Ingredientes (Nome, Qtde, Unidade), Rendimento, Categoria e Modo de Preparo passo a passo. A usuária revisa, adiciona a foto oficial do prato e salva.

### 2.2. O "Sommelier de Menus" (RAG com Receitas Próprias)
- **Ação:** A Chef tem um evento (ex: casamento) e decidiu que a entrada será "Ceviche". Ela precisa de sugestões de Prato Principal e Sobremesa.
- **Processamento:** O backend busca o catálogo de receitas da própria Chef no BD e envia o contexto ao Gemini pedindo sugestões de harmonização que façam sentido gastronômico com a entrada escolhida.
- **Resultado:** O sistema retorna três opções completas de Menu 3 tempos, justificando a escolha baseada nos perfis de sabor (ácido, untuoso, leve, etc.).

### 2.3. O "Copiloto" (Chatbot Auxiliar de Criação)
- **Ação:** Chat interativo onde a Chef insere "Ingredientes X, Y, Z que estão sobrando".
- **Processamento:** A IA gera ideias de pratos inéditos.
- **Resultado:** Se a Chef gostar da ideia, clica num botão "Transformar em Receita", que automaticamente aciona o fluxo 2.1 para gerar a ficha técnica preliminar.

## 3. Estrutura de Modelagem de Dados Inicial (Foco em Ficha Técnica Profissional)

A Ficha Técnica é o coração do sistema. O banco deve suportar:
- **Tabela `Receita`:** ID, Nome, Foto do Empratamento, Categoria (Entrada, Principal, etc), Estilo (Italiano, Contemporâneo, etc), Rendimento, Tempo de Preparo, Temperatura (Quente/Frio).
- **Tabela `Ingrediente_Receita`:** Unindo Ingrediente Base + Receita. Deve conter: Quantidade Bruta, Quantidade Líquida (já considerando o *Fator de Correção*), Unidade de Medida.
- **Tabela `Preparo_Passos`:** ID Receita, Ordem do Passo, Descrição.

*Nota: Num segundo momento, essa estrutura base permitirá adicionar facilmente módulos de custeio estruturado (CMV) e precificação.*

## 4. Próximos Passos (Plano de Implementação)

1. **Setup do Repositório (Monorepo ou Repositórios Separados):**
   - Inicializar `next-app` para o Front.
   - Inicializar ambiente virtual (`venv` / `poetry`) e dependências do `FastAPI` para o Back.
2. **Setup do Banco de Dados:**
   - Criar projeto no Supabase/Neon e definir as *migrations* iniciais.
3. **Integração Básica de IA (Spike):**
   - Criar um script Python isolado para validar a chamada à API do Gemini passando uma foto de receita lixo/teste e confirmando a volta do JSON estruturado.
4. **Construção do CRUD Base:**
   - Frontend e Backend comunicando para Listar, Criar e Editar Receitas.
5. **Integração Front + Back + IA:**
   - Tela de "Adicionar Receita por Foto" acionando o endpoint da API que por sua vez aciona o Gemini.

## Aprovação

Aguarda revisão do usuário para iniciarmos o processo de setup do projeto (Passo 1 do plano).
