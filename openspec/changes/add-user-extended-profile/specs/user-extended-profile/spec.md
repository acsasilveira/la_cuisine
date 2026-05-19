## ADDED Requirements

### Requirement: Atributos Estendidos de Perfil
O sistema DEVE permitir e armazenar informações adicionais ao perfil do usuário (`UserBase`) para suportar a parametrização do assistente baseada em culinária regional e de nicho.

#### Scenario: Armazenamento opcional de dados complementares
- **WHEN** o banco de dados é migrado (Alembic) e a interface do usuário carrega o app
- **THEN** a tabela `users` e o SQLModel aceitarão valores nulláveis ou `str` válidos para `phone`, `location` (cidade/estado) e `specialty` (especialidade culinária)
