## Context

A cobertura de testes atual de 74% revela lacunas significativas no módulo de Menus (0-41%), no Repositório de Receitas (52%) e no serviço de IA (68%). Para atingir uma cobertura segura (>80%), precisamos atacar estes pontos específicos com testes unitários, de integração e ponta-a-ponta (E2E).

## Goals / Non-Goals

**Goals:**
- Implementar testes unitários para a entidade `Menu`.
- Implementar testes de integração para `MenuRepository`.
- Implementar testes E2E para as rotas de Menu (`menu_router`).
- Adicionar testes de tratativa de erro no serviço Gemini e rotas de chat.
- Garantir que caminhos de exceção (rollbacks, 404s) nos repositórios sejam testados.

**Non-Goals:**
- Não testar bibliotecas externas diretamente (ex: drivers do Postgres ou Pydantic interno), focando apenas na nossa lógica.
- Não atingir obrigatoriamente 100% de cobertura (algumas linhas de configuração podem ser ignoradas).

## Decisions

- **Mocking**: Utilizar `unittest.mock` para simular falhas controladas na API do Gemini (Timeout e JSON Corrompido).
- **Test Database**: Continuar utilizando `aiosqlite` (:memory:) para manter a velocidade da suíte de testes.
- **Estrutura**: Criar arquivos de teste dedicados para Menus em `tests/unit/domain`, `tests/integration` e `tests/e2e` para manter o padrão de Clean Architecture.

## Risks / Trade-offs

- **[Risco] Testes Flaky em IA**: Testes que dependem de rede podem falhar.
  - *Mitigação*: Usar Mocks rigorosos para os casos de erro e testes de integração reais apenas para o happy path.
- **[Trade-off] Tempo de Execução**: Mais testes aumentam o tempo de CI.
  - *Mitigação*: O uso de banco em memória (SQLite) e execução assíncrona mantém o tempo sob controle.
