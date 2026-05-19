## Why

Atualmente, o sistema de usuários conta apenas com os atributos básicos de e-mail e nome. Para melhorar a precisão, pertinência e personalização do nosso assistente IA Copilot frente a realidade do chef de cozinha, precisamos adicionar informações complementares, permitindo um direcionamento de receitas, elaboração de menus e respostas que englobem localização regional e a especialidade técnica exata do usuário assinante.

## What Changes

- Inclusão do campo `phone` (telefone) na entidade `User` e no schema persistente do banco da dados SQLModel.
- Inclusão do campo `location` (cidade e estado) na entidade `User`.
- Inclusão do campo `specialty` (especialidade culinária do chef, ex: Confeiteiro, Parrillero, MasterChef, Vegano) na entidade `User`.
- Atualização das rotas e DTOs de Autenticação/Registro para opcionalmente requerer esses campos no payload de sign up.
- **BREAKING**: Injeção primária da `specialty` e da `location` dentro das instruções de sistemas ou do metacontexto nos payloads executados pelo `ChatCopilotUseCase` (Google Gemini API).

## Capabilities

### New Capabilities
- `user-extended-profile`: Ampliação descritiva da identidade base do usuário no domínio, habilitando controle de informações essenciais de negócio gastronômico.
- `ai-context-injection`: Integração de perfil do assinante como preâmbulo em sessões de Copilot, moldando o tom de voz e sugestões ao contexto específico do Chef.

### Modified Capabilities
- `user-auth`: O fluxo de registro inicial e os Schemas de request devem expandir o DTO suportando (ainda que opcionalmente num primeiro momento) os novos itens.
- `ai-copilot-assistance`: A construção dos parâmetros da IA nos Casos de Uso deverá interceptar o objeto usuário da requisição e popular as tags do modelo. 

## Impact

- Banco de dados PostgreSQL sofrendo alteração por arquivo de Migration via Alembic.
- Core Application modificando os schemas em `entities/user.py`.
- Fluxo de uso `app/application/use_cases/ai_use_cases.py` exigindo busca prévia dos dados complementares.
- Frontend necessitará de forms de _onboarding_ ou na tela de _perfil_ para acomodar estes atributos.
