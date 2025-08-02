# Sistema de Gerenciamento de Pessoas

Sistema frontend para gerenciamento de pessoas com integração completa com API REST.

## Funcionalidades

- ✅ **Listagem de pessoas** com busca e filtros
- ✅ **Cadastro de novas pessoas** com validação completa
- ✅ **Edição de pessoas** existentes
- ✅ **Exclusão de pessoas** com confirmação
- ✅ **Validação de CPF** em tempo real
- ✅ **Formatação automática de CPF** (000.000.000-00)
- ✅ **Integração completa com API** (localhost:4001)
- ✅ **Tratamento de erros** da API com mensagens personalizadas
- ✅ **Estados de loading** durante operações
- ✅ **Notificações elegantes** para sucesso e erro
- ✅ **Interface responsiva** com Tailwind CSS
- ✅ **Mapeamento automático** entre formatos da API e frontend
- ✅ **Busca com debounce** (500ms) e requisições para API
- ✅ **Autocomplete** para nacionalidade, naturalidade e sexo
- ✅ **Serviços modulares** por domínio
- ✅ **Cliente HTTP centralizado** com Axios

## Tecnologias Utilizadas

- **React** com TypeScript
- **React Router** para navegação
- **React Hook Form** para formulários
- **Zod** para validação de schemas
- **Tailwind CSS** para estilização
- **React Icons** para ícones
- **Axios** para requisições HTTP

## Estrutura do Projeto

```
app/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx
│   ├── PersonForm.tsx
│   ├── PersonList.tsx
│   ├── Notification.tsx
│   └── AutocompleteInput.tsx
├── contexts/           # Contextos React
│   └── PersonContext.tsx
├── hooks/              # Hooks personalizados
│   ├── useApi.ts
│   └── useDebounce.ts
├── lib/                # Bibliotecas e utilitários
│   └── http.ts         # Cliente HTTP centralizado
├── routes/             # Páginas da aplicação
│   ├── home.tsx
│   └── person.$id.tsx
├── services/           # Serviços de API (modulares)
│   ├── personService.ts
│   └── referenceService.ts
├── types/              # Definições de tipos
│   ├── person.ts
│   └── api.ts
└── config/             # Configurações
    └── api.ts
```

## Integração com API

### Endpoints Utilizados

- `GET /v1/people` - Listar todas as pessoas
- `GET /v1/people?q={query}` - Buscar pessoas por termo
- `GET /v1/people/:id` - Buscar pessoa por ID
- `POST /v1/people` - Criar nova pessoa
- `PUT /v1/people/:id` - Atualizar pessoa
- `DELETE /v1/people/:id` - Excluir pessoa
- `GET /v1/reference/nationalities?q={query}` - Buscar nacionalidades
- `GET /v1/reference/birthplaces?q={query}` - Buscar naturalidades

### Cliente HTTP Centralizado

O sistema utiliza um cliente HTTP centralizado baseado em Axios:

#### **HttpClient** (`app/lib/http.ts`)
- ✅ **Configuração centralizada** - Base URL, timeout, headers
- ✅ **Interceptors automáticos** - Para requisições e respostas
- ✅ **Tratamento de erros** - Conversão automática para `HttpError`
- ✅ **Timeout configurável** - 10 segundos por padrão
- ✅ **Tipagem TypeScript** - Suporte completo a tipos genéricos
- ✅ **Métodos HTTP** - GET, POST, PUT, DELETE, PATCH

#### **Funcionalidades do Cliente:**
```typescript
// Configuração automática
baseURL: 'http://localhost:4001/v1'
timeout: 10000ms

// Métodos disponíveis
await httpClient.get<T>(url)
await httpClient.post<T>(url, data)
await httpClient.put<T>(url, data)
await httpClient.delete<T>(url)
await httpClient.patch<T>(url, data)
```

#### **Tratamento de Erros:**
- ✅ **Erros da API** - Converte automaticamente para `HttpError`
- ✅ **Timeout** - Erro específico para requisições expiradas
- ✅ **Erro de rede** - Para problemas de conectividade
- ✅ **Status codes** - Preserva códigos de status da API

### Arquitetura de Serviços

O sistema utiliza uma arquitetura modular de serviços:

#### **PersonService** (`app/services/personService.ts`)
- ✅ **CRUD completo** de pessoas
- ✅ **Busca com debounce** de pessoas
- ✅ **Mapeamento automático** entre formatos da API e frontend
- ✅ **Tratamento de erros** específico para pessoas
- ✅ **Usa HttpClient** - Integração com cliente Axios

#### **ReferenceService** (`app/services/referenceService.ts`)
- ✅ **Busca de nacionalidades** com autocomplete
- ✅ **Busca de naturalidades** com autocomplete
- ✅ **Debounce configurável** para cada campo
- ✅ **Tratamento de erros** específico para referências
- ✅ **Usa HttpClient** - Integração com cliente Axios

### Busca com Debounce

O sistema implementa busca em tempo real com debounce de 500ms:

- ✅ **Debounce de 500ms** - Evita requisições excessivas
- ✅ **Busca na API** - Não filtra dados locais
- ✅ **Loading state** - Indicador visual durante busca
- ✅ **Fallback** - Em caso de erro, carrega todas as pessoas
- ✅ **Busca vazia** - Quando o campo está vazio, carrega todas as pessoas

### Autocomplete

O sistema implementa autocomplete com debounce para campos de referência:

- ✅ **Autocomplete para Naturalidade** - Busca em `/v1/reference/birthplaces`
- ✅ **Autocomplete para Nacionalidade** - Busca em `/v1/reference/nationalities`
- ✅ **Autocomplete para Sexo** - Sugestões locais ("Masculino", "Feminino")
- ✅ **Debounce configurável** - 300ms para referências, 100ms para sexo
- ✅ **Sugestões em dropdown** - Lista clicável de sugestões
- ✅ **Loading state** - Indicador visual durante busca
- ✅ **Click outside** - Fecha sugestões ao clicar fora
- ✅ **Keyboard navigation** - Suporte a navegação por teclado

### Mapeamento de Dados

O sistema faz mapeamento automático entre o formato da API e o formato do frontend:

#### Formato da API:
```json
{
  "id": 88,
  "name": "Ana Costa Ferreira",
  "gender": "Feminino",
  "email": "ana.costa@email.com",
  "birthDate": "1988-12-05T00:00:00.000Z",
  "naturalness": "Salvador",
  "nationality": "Brasileira",
  "cpf": "100.000.004-00",
  "address": "Largo do Pelourinho, 321 - Salvador/BA",
  "createdAt": "2025-08-02T14:17:09.491Z",
  "updatedAt": "2025-08-02T14:17:09.491Z"
}
```

#### Formato do Frontend:
```typescript
{
  id: "88",
  nome: "Ana Costa Ferreira",
  sexo: "Feminino",
  email: "ana.costa@email.com",
  dataNascimento: "1988-12-05",
  naturalidade: "Salvador",
  nacionalidade: "Brasileira",
  cpf: "100.000.004-00"
}
```

### Tratamento de Erros

O sistema trata os seguintes tipos de erro da API:

- `ROUTE_NOT_FOUND` - Rota não encontrada
- `RESOURCE_NOT_FOUND` - Recurso não encontrado
- `USER_NOT_FOUND` - Usuário não encontrado
- `PERSON_NOT_FOUND` - Pessoa não encontrada
- `VALIDATION_ERROR` - Erro de validação
- `INVALID_CPF` - CPF inválido
- `INVALID_EMAIL` - E-mail inválido
- `REQUIRED_FIELD` - Campo obrigatório não preenchido
- `CONFLICT_ERROR` - Conflito de dados
- `PERSON_ALREADY_EXISTS` - Pessoa já existe
- `EMAIL_ALREADY_EXISTS` - E-mail já existe
- `INTERNAL_SERVER_ERROR` - Erro interno do servidor
- `DATABASE_ERROR` - Erro no banco de dados
- `UNKNOWN_ERROR` - Erro desconhecido (mostra mensagem da API)
- `TIMEOUT_ERROR` - Timeout da requisição
- `NETWORK_ERROR` - Erro de conexão

### Formato de Resposta de Erro

```json
{
  "statusCode": 400,
  "error": "INVALID_EMAIL",
  "message": ["email must be an email"],
  "timestamp": "2025-08-02T10:22:51.288Z",
  "path": "/v1/people"
}
```

## Configuração

### Pré-requisitos

- Node.js 18+
- API backend rodando em `localhost:4001`

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Funcionalidades Detalhadas

### Validação de CPF

- Validação em tempo real durante digitação
- Formatação automática (000.000.000-00)
- Verificação de unicidade no sistema
- Validação de dígitos verificadores

### Formulário de Pessoa

- Campos obrigatórios: Nome, CPF, Data de Nascimento
- Campos opcionais: E-mail, Sexo, Naturalidade, Nacionalidade
- Validação em tempo real
- Estados de loading durante submissão
- Tratamento de erros da API
- **Autocomplete para Naturalidade, Nacionalidade e Sexo**

### Listagem de Pessoas

- **Busca com debounce** de 500ms
- **Requisições para API** ao invés de filtrar localmente
- Estados de loading e erro
- Ações de editar e excluir
- Indicador visual durante busca

### Autocomplete

- **Componente reutilizável** `AutocompleteInput`
- **Debounce configurável** por campo (100ms para sexo, 300ms para referências)
- **Sugestões em dropdown** com scroll
- **Loading state** durante busca
- **Click outside** para fechar sugestões
- **Integração com React Hook Form**
- **Sugestões locais** para sexo ("Masculino", "Feminino")

### Notificações

- Notificações de sucesso (verde)
- Notificações de erro (vermelho)
- Auto-dismiss após 3-5 segundos
- Botão de fechar manual

## Estrutura de Dados

### Pessoa (Person) - Frontend

```typescript
interface Person {
  id?: string;
  nome: string;
  sexo?: string; // Aceita qualquer texto
  email?: string;
  dataNascimento: string;
  naturalidade?: string;
  nacionalidade?: string;
  cpf: string;
}
```

### Pessoa (APIPerson) - API

```typescript
interface APIPerson {
  id: number;
  name: string;
  gender: string; // Aceita qualquer texto
  email: string;
  birthDate: string;
  naturalness: string;
  nationality: string;
  cpf: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Melhorias Futuras

- [ ] Paginação na listagem
- [ ] Filtros avançados
- [ ] Exportação de dados
- [ ] Upload de fotos
- [ ] Histórico de alterações
- [ ] Autenticação e autorização
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
