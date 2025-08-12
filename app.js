
const express = require('express');
const cors = require("cors");
require('dotenv').config();
// centraliza as configuracoes
const app = express()

// Configuração CORS específica
const corsOptions = {
    origin: [
        'https://www.barbeariavip.site',
        'https://barbeariavip.site',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
};

// middwares
app.use(cors(corsOptions))
app.use(express.json()) //cominicacao via json

// Middleware adicional para tratar preflight requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// DB connection
const conn = require("./db/conn");
conn();

// routes
const routes = require("./routes/router");

// Rota de teste para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Barbearia VIP Backend - Servidor funcionando!', 
        timestamp: new Date().toISOString(),
        endpoints: {
            admin: ['GET /admin', 'GET /admin/:id', 'POST /admin', 'PATCH /admin/:id', 'DELETE /admin/:id'],
            horarios: ['GET /horarios', 'PATCH /horarios'],
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