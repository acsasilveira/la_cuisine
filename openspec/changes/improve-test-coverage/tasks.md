## 1. Testes de Domínio e Entidades

- [ ] 1.1 Criar `tests/unit/domain/test_menu_entities.py` para validar as classes `MenuBase` e `MenuItemBase`.

## 2. Testes de Integração e Persistência

- [ ] 2.1 Criar `tests/integration/test_menu_repository.py` cobrindo CRUD completo de menus.
- [ ] 2.2 Adicionar testes de falha e rollback em `tests/integration/test_recipe_repository.py`.

## 3. Testes de API e E2E (Módulo de Menus)

- [ ] 3.1 Criar `tests/e2e/test_menu_api.py` testando endpoints de criação, listagem e exclusão de menus.
- [ ] 3.2 Garantir que filtros de `user_id` nos menus estão sendo respeitados.

## 4. Testes de IA e Chat (Tratativa de Erros)

- [ ] 4.1 Criar `tests/unit/application/test_chat_use_cases.py` mockando o `AIServicePort` para simular Timeouts e JSONs corrompidos.
- [ ] 4.2 Adicionar testes no `chat_router.py` (via E2E ou unitário) para validar os status HTTP 502 e 504.

## 5. Cobertura Técnica Geral

- [ ] 5.1 Adicionar testes para o arquivo `main.py` validando rotas de `/health` e middlewares (se aplicável).
- [ ] 5.2 Revisar caminhos de exceção não testados (blocos `except`) nos roteadores de receitas.
