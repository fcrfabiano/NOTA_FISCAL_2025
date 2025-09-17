# TESTE TECNICO UNECONT

## Criar uma mini-aplicação de cadastro e listagem de Notas Fiscais

### Entidades

Nota Fiscal

Número da Nota
Cliente
Valor
Data de Emissão

### Repositórios

Nota Fiscal Repositório (InMemory)

### Endpoints

- GET `/notas` -> Listar todas as notas

- Número da Nota
- Cliente
- Valor (formatado como moeda: R$ 0,00)
- Data de Emissão
- Data/Hora de Cadastro (gerada automaticamente no backend).

- POST `/notas` -> Criar uma nova nota

- Número da Nota
- Cliente
- Valor
- Data Emissão

# TODOS

- [ ] Criar estrutura do projeto
    - [ ] Pasta Domain (Entidades, interfaces de repositório)
    - [ ] Pasta Application (DTOs, serviços/UseCases)
    - [ ] Pasta Infrastructure (InMemory repositório)
- [ ] Criar entidade de domínio NotaFiscal
- [ ] Criar interface do repositório NotaFiscal
- [ ] Criar DTO's (criação e listagem)
- [ ] criar Result para retornar dados da API
- [ ] Criar use case para criar nota
- [ ] Implementar o repositório em memória
- [ ] Implementar a API com os endpoints