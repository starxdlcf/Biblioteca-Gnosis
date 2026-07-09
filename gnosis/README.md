# Gnosis

## Descrição

Gnosis é uma API REST para gerenciamento de biblioteca, desenvolvida como trabalho acadêmico de Desenvolvimento Web.

A API permite o gerenciamento de:

- autores;
- livros;
- gêneros;
- carteirinhas;
- empréstimos;
- multas;
- relacionamento entre livros e autores;
- relacionamento entre livros e gêneros.

## Tecnologias utilizadas

Tecnologias identificadas no código e no `package.json`:

- Node.js;
- JavaScript com ES Modules;
- PostgreSQL;
- Neon Database;

Dependências identificadas em `dependencies`:

- `fastify` `^5.9.0`;
- `pg` `^8.22.0`;
- `dotenv` `^17.4.2`;
- `@fastify/cors` `^11.2.0`;
- `@fastify/swagger` `^9.8.0`;
- `@fastify/swagger-ui` `^6.1.0`;
- `nodemon` `^3.1.14`.

Dependências identificadas em `devDependencies`:

- `jest` `^29.6.0`;
- `nodemon` `^3.0.1`.

## Estrutura do projeto

O projeto segue uma arquitetura Vertical Slice. Cada funcionalidade fica organizada em sua própria pasta dentro de `src/features`, reunindo as camadas de rota, controller, service e repository relacionadas ao mesmo módulo.

Estrutura principal:

```text
gnosis/
|-- database.sql
|-- package.json
|-- server.js
|-- test-imports.js
`-- src/
    |-- base/
    |-- config/
    |-- docs/
    |-- errors/
    |-- routes/
    `-- features/
        |-- autores/
        |-- carteirinhas/
        |-- emprestimos/
        |-- generos/
        |-- livroautor/
        |-- livrogenero/
        |-- livros/
        `-- multas/
```

Responsabilidades das camadas:

- `Routes`: registram as rotas HTTP no Fastify e configuram schemas de documentação.
- `Controllers`: recebem as requisições, chamam os services e formatam as respostas HTTP.
- `Services`: concentram regras de negócio, validações e lançamento de erros de aplicação.
- `Repositories`: executam operações SQL e acessam o PostgreSQL.
- `Config`: centraliza configurações, incluindo conexão com o banco via `pg` e variáveis de ambiente.
- `Errors`: define `AppError` e o tratamento centralizado de erros da API.
- `Base`: fornece classes reutilizáveis para CRUD em rotas, controllers, services e repositories.

## Pré-requisitos

Para executar o projeto, é necessário ter:

- Node.js;
- npm;
- PostgreSQL local ou Neon Database.

## Instalação

```bash
git clone https://github.com/starxdlcf/Biblioteca-Gnosis
cd Biblioteca-Gnosis/gnosis
npm install
```

## Configuração das variáveis de ambiente

O projeto carrega variáveis de ambiente com `dotenv`. Crie um arquivo `.env` na raiz da aplicação `gnosis`.

Variáveis realmente utilizadas pelo código:

```env
DATABASE_URL=
PORT=3002
```

Observações:

- `DATABASE_URL` é utilizada em `src/config/database.js` como string de conexão do PostgreSQL.
- `PORT` é utilizada em `server.js`; caso não seja definida, a API usa a porta `3002`.

## Banco de dados

O banco de dados é definido pelo arquivo `database.sql`.

Para preparar o banco:

1. Crie um banco PostgreSQL local ou utilize Neon Database.
2. Execute o arquivo `database.sql` no banco escolhido.
3. Configure a variável `DATABASE_URL` no arquivo `.env`.

O script SQL cria as estruturas principais para:

- `autores`;
- `carteirinha`;
- `generos`;
- `livros`;
- `emprestimos`;
- `multas`;
- `livro_autor`;
- `livro_genero`.

## Executando o projeto

Scripts identificados no `package.json`:

### Desenvolvimento

```bash
npm run dev
```

Executa:

```bash
nodemon server.js
```

### Produção

```bash
npm start
```

Executa:

```bash
node server.js
```

### Testes

```bash
npm test
```

Executa:

```bash
jest
```

## Endpoints

Os módulos registrados na API são:

- Autores;
- Livros;
- Gêneros;
- Carteirinhas;
- Empréstimos;
- Multas;
- LivroAutor;
- LivroGenero.

## Organização da arquitetura

Fluxo de uma requisição:

```text
Cliente
↓
Routes
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL
```

Fluxo de retorno:

```text
PostgreSQL
↑
Repository
↑
Service
↑
Controller
↑
Resposta HTTP
```

## Observações

- A API utiliza tratamento centralizado de erros com `AppError` e `errorHandler`.
- O projeto segue arquitetura Vertical Slice.
- O acesso a dados é feito em PostgreSQL.
- As configurações são carregadas por variáveis de ambiente.
- O banco deve ser inicializado pelo arquivo `database.sql`.
