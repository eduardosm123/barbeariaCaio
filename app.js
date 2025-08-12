
const express = require('express');
const cors = require("cors");
require('dotenv').config();
// centraliza as configuracoes
const app = express()

// middwares - CORS completamente desabilitado
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
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