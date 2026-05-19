## 1. Modelagem do Domínio e Banco de Dados

- [x] 1.1 Atualizar o modelo base da entidade de usuários (`app/domain/entities/user.py`) para comportar de modo opcional `phone`, `location` e `specialty`.
- [x] 1.2 Atualizar o modelo SQLModel correspondente para suportar as colunas tipificadas no Postgres.
- [x] 1.3 Gerar o script da migração usando o Alembic (`alembic revision --autogenerate -m "add estended profile cols"`) na pasta do backend.
- [x] 1.4 Aplicar/migrar a infraestrutura do banco de dados no ambiente local rodando `alembic upgrade head`.

## 2. Adaptação do Módulo de Autenticação e Registro

- [x] 2.1 Refatorar os DTOs/Schemas REST da rota `POST /api/auth/register` assegurando mapeamento das novas variáveis.
- [x] 2.2 Ajustar `RegisterUseCase` (`auth_use_cases.py`) para persistir o pacote de informações estendido através do Repository adapter.
- [x] 2.3 Atualizar os testes unitários afetados que possivelmente esperavam construtores de usuário mais curtos.

## 3. Injeção de Contexto no Copilot (Integração IA)

- [x] 3.1 Adaptar as rotas correspondentes de endpoint em `api/` para que puxem os metadados expandidos originados pelo Token Autenticado.
- [x] 3.2 Modificar a assinatura do método `execute` no `ChatCopilotUseCase` inserindo a injeção desses params customizados.
- [x] 3.3 Codificar o adapter ou injetar diretamente no pré-prompt os atributos `specialty` e `location` quando despachar o call final para o Gemini.
