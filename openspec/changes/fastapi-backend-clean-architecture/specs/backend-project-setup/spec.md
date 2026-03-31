## ADDED Requirements

### Requirement: Inicialização do projeto FastAPI
O sistema DEVE criar um projeto FastAPI com estrutura Clean Architecture contendo as camadas: Domain, Application, Infrastructure e API.

#### Scenario: Estrutura de diretórios criada
- **WHEN** o projeto é inicializado
- **THEN** o diretório `backend/app/` DEVE conter os subdiretórios `domain/`, `application/`, `infrastructure/` e `api/`

#### Scenario: FastAPI executa com sucesso
- **WHEN** o comando `uvicorn app.main:app` é executado
- **THEN** o servidor DEVE iniciar na porta 8000
- **THEN** o endpoint `/docs` DEVE retornar a documentação OpenAPI

### Requirement: Configuração de dependências
O sistema DEVE usar `pyproject.toml` com as dependências: FastAPI 0.104+, SQLModel 0.0.14+, Pydantic v2, Alembic, uvicorn.

#### Scenario: Dependências instaladas
- **WHEN** `pip install -e .` é executado no diretório backend
- **THEN** todas as dependências DEVEM ser instaladas sem erros

### Requirement: Variáveis de ambiente
O sistema DEVE ler configurações via variáveis de ambiente usando Pydantic Settings.

#### Scenario: Variáveis carregadas do .env
- **WHEN** o backend inicia com um arquivo `.env` contendo `DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`
- **THEN** o objeto Settings DEVE conter os valores corretos

#### Scenario: Variável obrigatória ausente
- **WHEN** o backend inicia sem `DATABASE_URL`
- **THEN** o sistema DEVE lançar um erro de validação antes de iniciar

### Requirement: Docker para desenvolvimento
O sistema DEVE fornecer `Dockerfile` e `docker-compose.yml` para ambiente de desenvolvimento.

#### Scenario: docker-compose sobe os serviços
- **WHEN** `docker-compose up` é executado
- **THEN** os serviços `backend` e `postgres` DEVEM iniciar
- **THEN** o backend DEVE se conectar ao PostgreSQL
