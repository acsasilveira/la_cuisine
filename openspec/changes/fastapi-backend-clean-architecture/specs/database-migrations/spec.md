## ADDED Requirements

### Requirement: Configuração Alembic
O sistema DEVE usar Alembic para gerenciar migrations do banco PostgreSQL.

#### Scenario: Migration inicial criada
- **WHEN** `alembic revision --autogenerate -m "initial"` é executado
- **THEN** DEVE gerar arquivo de migration com as tabelas: recipes, ingredients, recipe_ingredients, recipe_steps

#### Scenario: Migration aplicada
- **WHEN** `alembic upgrade head` é executado
- **THEN** as tabelas DEVEM ser criadas no PostgreSQL com os tipos corretos (UUID, timestamps, FKs)

#### Scenario: Rollback de migration
- **WHEN** `alembic downgrade -1` é executado
- **THEN** a última migration DEVE ser revertida

### Requirement: Modelos SQLModel
Os modelos SQLModel DEVEM corresponder ao schema definido no design.

#### Scenario: Modelo Recipe
- **WHEN** o modelo Recipe é inspecionado
- **THEN** DEVE conter: id (UUID PK), title (str), category (Enum), yield_amount (Decimal), yield_unit (str), prep_time_minutes (int), temperature_type (Enum), image_url (str), created_at (datetime)

#### Scenario: Modelo Ingredient
- **WHEN** o modelo Ingredient é inspecionado
- **THEN** DEVE conter: id (UUID PK), name (str, unique)

#### Scenario: Modelo RecipeIngredient
- **WHEN** o modelo RecipeIngredient é inspecionado
- **THEN** DEVE conter: id (UUID PK), recipe_id (UUID FK), ingredient_id (UUID FK), amount (Decimal), unit (str), notes (str optional)

#### Scenario: Modelo RecipeStep
- **WHEN** o modelo RecipeStep é inspecionado
- **THEN** DEVE conter: id (UUID PK), recipe_id (UUID FK), step_number (int), instruction (text)

### Requirement: Conexão assíncrona com PostgreSQL
O sistema DEVE usar conexão assíncrona com o PostgreSQL via asyncpg + SQLAlchemy async.

#### Scenario: Sessão async funcional
- **WHEN** um use case solicita uma sessão do banco
- **THEN** a sessão DEVE ser async (AsyncSession)
- **THEN** a sessão DEVE ser gerenciada por context manager
