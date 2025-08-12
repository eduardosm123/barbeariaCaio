
const express = require('express');
const cors = require("cors");
require('dotenv').config();
// centraliza as configuracoes
const app = express()

// middwares
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
    exposedHeaders: ['x-session-id'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}))
app.use(express.json()) //cominicacao via json

// DB connection
const conn = require("./db/conn");
conn();

// Sistema simples de sessões em memória
let activeSessions = new Set();
// Tornar activeSessions acessível globalmente
global.activeSessions = activeSessions;

// routes
const routes = require("./routes/router");

// Rota de teste para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Barbearia VIP Backend - Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: ['POST /auth/login', 'POST /auth/logout', 'GET /auth/verify'],
            admin: ['GET /admin', 'GET /admin/:id', 'POST /admin (protegido)', 'PATCH /admin/:id (protegido)', 'DELETE /admin/:id (protegido)'],
            horarios: ['GET /horarios', 'PATCH /horarios (protegido)'],
            agendamentos: ['GET /agendamentos', 'POST /agendamentos', 'GET /agendamentos/:id', 'PATCH /agendamentos/:id', 'DELETE /agendamentos/:id'],
            legacy: ['GET /category', 'GET /product']
        }
    });
});

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Servidor Online na porta ${PORT}!!`)
})