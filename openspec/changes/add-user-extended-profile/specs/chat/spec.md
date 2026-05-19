## MODIFIED Requirements

### Requirement: RF-025 Contexto do chat
O chat deve manter contexto e diretivas primárias. Contexto pode conter mensagens anteriores, menu atual, receitas do banco e necessariamente a especialidade/localidade amarrada ao perfil do usuário atual que fez a requisição. O contexto deve ser enviado para IA. IA deve respeitar contexto e as minúcias geográficas ou regionais do `User`.

#### Scenario: Envio de metadados do Chef para contexto da IA
- **WHEN** o cliente interage com a rota do Chat Copilot enviando mensagens (POST /api/chat/copilot)
- **THEN** o controlador de backend extrai os dados do Usuário, processa a variável `specialty` e `location`, e os injeta transparentemente como preâmbulo no prompt Gemini para garantir personalização.
