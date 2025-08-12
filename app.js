
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS totalmente aberto - permite qualquer origem
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Middleware adicional para garantir CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// DB connection
const conn = require("./db/conn");
conn();

// monte suas rotas normalmente:
const routes = require('./routes/router');
app.use('/', routes);

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Barbearia VIP Backend - Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        cors: 'enabled for all origins',
        endpoints: {
            auth: ['POST /auth/login', 'POST /auth/logout', 'GET /auth/verify'],
            admin: ['GET /admin', 'GET /admin/:id', 'POST /admin', 'PATCH /admin/:id', 'DELETE /admin/:id'],
            horarios: ['GET /horarios', 'PATCH /horarios'],
            agendamentos: ['GET /agendamentos', 'POST /agendamentos', 'GET /agendamentos/:id', 'PATCH /agendamentos/:id', 'DELETE /agendamentos/:id']
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Servidor Online na porta ${PORT}!!`)
})