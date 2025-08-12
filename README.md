
# Barbearia VIP - Backend

Backend para o sistema de agendamento da Barbearia VIP, desenvolvido com Node.js, Express e MongoDB.

## Funcionalidades

- **Administração**: Gerenciamento de usuários administrativos
- **Horários**: Configuração de horários disponíveis por dia da semana
- **Agendamentos**: Sistema completo de agendamentos de clientes
- **Produtos e Categorias**: CRUD completo (funcionalidade original mantida)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas variáveis de ambiente:
```bash
MONGO_DB_CONNECTION=mongodb://localhost:27017/barbearia
PORT=3000
```

4. Execute o seed para popular o banco com dados iniciais:
```bash
npm run seed
```

5. Inicie o servidor:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)
- `npm start` - Inicia o servidor em modo produção
- `npm run seed` - Popula o banco de dados com dados iniciais

## API Endpoints

### Admin
- `GET /admin` - Lista todos os admins
- `GET /admin/:id` - Busca admin por ID
- `POST /admin` - Cria novo admin
- `PATCH /admin/:id` - Atualiza admin
- `DELETE /admin/:id` - Remove admin

### Horários
- `GET /horarios` - Busca configuração de horários
- `PATCH /horarios` - Atualiza horários disponíveis

### Agendamentos
- `GET /agendamentos` - Lista todos os agendamentos
- `GET /agendamentos/:id` - Busca agendamento por ID
- `GET /agendamentos/data/:data` - Busca agendamentos por data
- `POST /agendamentos` - Cria novo agendamento
- `PATCH /agendamentos/:id` - Atualiza agendamento
- `DELETE /agendamentos/:id` - Remove agendamento

### Categorias (API Original)
- `GET /category` - Lista todas as categorias
- `GET /category/:page&:limit` - Lista categorias com paginação
- `GET /category/:id` - Busca categoria por ID
- `POST /category` - Cria nova categoria
- `PUT /category/:id` - Atualiza categoria
- `DELETE /category/:id` - Remove categoria

### Produtos (API Original)
- `GET /product` - Lista todos os produtos
- `GET /product/:page&:limit` - Lista produtos com paginação
- `GET /product/:id` - Busca produto por ID
- `POST /product` - Cria novo produto
- `PUT /product/:id` - Atualiza produto
- `DELETE /product/:id` - Remove produto

## Estrutura do Projeto

```
├── controllers/        # Lógica de negócio
│   ├── adminController.js
│   ├── horariosController.js
│   ├── agendamentoController.js
│   ├── categoryController.js
│   └── productController.js
├── models/            # Modelos do MongoDB
│   ├── Admin.js
│   ├── Horarios.js
│   ├── Agendamento.js
│   ├── Category.js
│   └── Product.js
├── routes/            # Definição de rotas
├── db/               # Configuração do banco
├── app.js            # Arquivo principal
├── seed.js           # Script de inicialização
└── .env              # Variáveis de ambiente
```

## Dados Iniciais

Após executar o seed, o sistema terá:

**Admin padrão:**
- Username: `admin`
- Password: `1234567`
- Email: `admin@barbeariavip.com`

**Horários padrão:**
- Segunda a sábado: horários configurados conforme db.json original
- Domingo: fechado

## Integração com Frontend

Este backend foi desenvolvido para funcionar com o frontend da Barbearia VIP. Certifique-se de que:

1. O servidor esteja rodando na porta 3000
2. O CORS esteja configurado corretamente
3. O MongoDB esteja acessível

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Middleware para permitir requisições cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente
