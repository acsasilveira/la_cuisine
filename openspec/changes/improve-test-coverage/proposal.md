## Why

A atual cobertura de testes do sistema é de 74%. Embora seja um número considerável, existem áreas críticas, como o módulo de Menus, o Roteador de Chat e partes do Repositório de Receitas, que possuem cobertura abaixo do desejado (chegando a 0% em algumas entidades de menu). Aumentar a cobertura para acima de 80-85% garantirá maior estabilidade, facilitará refatorações futuras e reduzirá a incidência de bugs em produção, especialmente em funcionalidades core como a integração com IA e gestão de cardápios.

## What Changes

- Adição de testes unitários para a entidade `Menu`.
- Implementação de testes de integração para `MenuRepository`.
- Criação de testes E2E para o `menu_router`.
- Expansão dos testes do `chat_router` para cobrir cenários de erro da IA (Timeout, Formato Inválido).
- Adição de testes para casos de borda (edge cases) e tratamentos de erro em `RecipeRepository`.
- Melhoria da cobertura em `main.py` testando inicialização e rotas de saúde.

## Capabilities

### New Capabilities
- `test-coverage-enforcement`: Estabelecimento de uma base de testes sólida para o módulo de Menus e segurança na integração com IA.

### Modified Capabilities
- `user-auth`: Garantir que os fluxos de autenticação continuem 100% cobertos após as mudanças recentes.
- `ai-copilot-assistance`: Aumentar a robustez dos testes de chat, prevendo falhas operacionais do serviço Gemini.

## Impact

- Melhora na confiabilidade do backend.
- Maior facilidade para identificar regressões em futuras mudanças de domínio.
- Não há impacto direto nos usuários finais, exceto por um sistema mais estável e livre de bugs.
