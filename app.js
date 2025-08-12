
const express = require('express');
const cors = require("cors");
require('dotenv').config();
// centraliza as configuracoes
const app = express()

// Configuração CORS mais permissiva para resolver o problema
const corsOptions = {
    origin: function (origin, callback) {
        // Permite requisições sem origin (apps mobile, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://www.barbeariavip.site',
            'https://barbeariavip.site',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS bloqueado para origin:', origin);
            callback(null, true); // Temporariamente permissivo para debug
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ]
};

// middwares
app.use(cors(corsOptions))
app.use(express.json()) //cominicacao via json

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
        origin: req.headers.origin,
        userAgent: req.headers['user-agent'],
        endpoints: {
            admin: ['GET /admin', 'GET /admin/:id', 'POST /admin', 'PATCH /admin/:id', 'DELETE /admin/:id'],
            horarios: ['GET /horarios', 'PATCH /horarios'],
            agendamentos: ['GET /agendamentos', 'POST /agendamentos', 'GET /agendamentos/:id', 'PATCH /agendamentos/:id', 'DELETE /agendamentos/:id'],
            auth: ['POST /auth/login', 'POST /auth/logout', 'GET /auth/verify']
        }
    });
});

// Rota específica para testar CORS
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Servidor Online na porta ${PORT}!!`)
})