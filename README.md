# Sistema de Gerenciamento de Pessoas

Sistema frontend para gerenciamento de pessoas com integração completa com API REST.

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **React Router 7** para navegação
- **React Hook Form** para formulários
- **Zod** para validação de schemas
- **Tailwind CSS** para estilização
- **React Icons** para ícones
- **Axios** para requisições HTTP
- **Vite** para build e desenvolvimento

## 📋 Pré-requisitos

- **Node.js 18+** (recomendado Node.js 20)
- **npm** ou **yarn**
- **API backend** rodando em `localhost:4001` ou em outro lugar que você pode configurar

## 🚀 Como Instalar e Executar

### Instalação Local

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd ste-front
   ```

   A URL pode ser pega no botão verde "<> code" mais acima

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   - Abra seu navegador e vá para `http://localhost:5173`

## 📖 Como Usar o Sistema

### 🏠 Página Inicial

- Acesse `http://localhost:5173`
- Você será direcionado para a página de login(/login) ou home(home) se já estiver autenticado

### 👥 Gerenciando Pessoas

#### **Listando Pessoas**

- A página inicial mostra todas as pessoas cadastradas
- Use a barra de busca para encontrar pessoas específicas

#### **Cadastrando uma Nova Pessoa**

1. Clique no botão **"Nova Pessoa"** no canto superior direito
2. Preencha o formulário:
   - **Nome** (obrigatório): Nome completo da pessoa
   - **CPF** (obrigatório): Será formatado automaticamente (000.000.000-00)
   - **Data de Nascimento** (obrigatório): Use o seletor de data(não pode ser maior que a data atual)
   - **E-mail** (opcional): E-mail válido
   - **Sexo** (opcional): Use o autocomplete ou digite livremente
   - **Naturalidade** (opcional): Use o autocomplete para buscar cidades
   - **Nacionalidade** (opcional): Use o autocomplete para buscar países
3. Clique em **"Salvar"**
4. Uma notificação de sucesso aparecerá se tudo estiver correto

#### **Editando uma Pessoa**

1. Na listagem, clique no ícone de **editar** (lápis) ao lado da pessoa
2. O formulário será carregado com os dados atuais
3. Faça as alterações necessárias
4. Clique em **"Salvar"**
5. Uma notificação de sucesso aparecerá

#### **Excluindo uma Pessoa**

1. Na listagem, clique em **excluir** ao lado da pessoa
2. Uma confirmação aparecerá
3. Clique em **"Confirmar"** para excluir

### 🔍 Funcionalidades de Busca e Autocomplete

#### **Busca de Pessoas**

- Digite na barra de busca para encontrar pessoas
- A busca é feita em tempo real na API
- Aguarde 500ms após parar de digitar para a busca ser executada

#### **Autocomplete**

- **Naturalidade**: Digite para buscar cidades automaticamente
- **Nacionalidade**: Digite para buscar países automaticamente
- **Sexo**: Digite ou selecione entre "Masculino" e "Feminino"

### Configuração da API

O sistema espera que a API esteja rodando em `http://localhost:4001`. Se sua API estiver em um endereço diferente, você pode alterar a configuração em `app/config/api.ts`.

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com coverage
npm test -- --coverage
```

## 🐛 Solução de Problemas

### Problema: "API não encontrada"

- Verifique se a API está rodando em `localhost:4001`
- Verifique se não há firewall bloqueando a conexão

### Problema: "Erro de build"

- Execute `npm install` para reinstalar dependências
- Verifique se está usando Node.js 18+

### Problema: "Página não carrega"

- Verifique se o servidor está rodando (`npm run dev`)
- Verifique se a porta 5173 não está sendo usada por outro processo

### Problema: "Autocomplete não funciona"

- Verifique se a API de referências está funcionando
- Verifique a conexão com a internet(se a api não estiver rodando localmente)

## 📝 Notas de Desenvolvimento

### Validação de CPF

- Formatação automática (000.000.000-00)
- Verificação de unicidade no sistema
