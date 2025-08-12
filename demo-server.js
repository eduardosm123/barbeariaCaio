const express = require('express');
const cors = require("cors");

// App sem banco para demonstração
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Dados mock em memória (simulando o que viria do banco)
let mockDatabase = {
    admin: {
        id: '66b7e1234567890123456789',
        username: 'admin',
        password: '1234567',
        email: 'admin@barbeariavip.com'
    },
    horarios: {
        segunda: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
        terca: ["11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
        quarta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
        quinta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
        sexta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
        sabado: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
        domingo: []
    },
    agendamentos: []
};

// Sistema simples de sessões em memória
let activeSessions = new Set();

// Rotas de teste (sem banco)

// Middleware para verificar autenticação (para rotas protegidas)
const requireAuth = (req, res, next) => {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    if (!sessionId || !activeSessions.has(sessionId)) {
        return res.status(401).json({ message: 'Acesso negado. Faça login primeiro.' });
    }
    
    next();
};

// Função para gerar ID de sessão simples
const generateSessionId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Barbearia VIP Backend - Servidor funcionando (modo demo sem MongoDB)!', 
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

// Auth endpoints
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username e password são obrigatórios' });
    }
    
    if (username === mockDatabase.admin.username && password === mockDatabase.admin.password) {
        const sessionId = generateSessionId();
        activeSessions.add(sessionId);
        
        res.json({
            message: 'Login realizado com sucesso',
            sessionId: sessionId,
            admin: {
                id: mockDatabase.admin.id,
                username: mockDatabase.admin.username,
                email: mockDatabase.admin.email
            }
        });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.post('/auth/logout', (req, res) => {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    
    if (sessionId) {
        activeSessions.delete(sessionId);
    }
    
    res.json({ message: 'Logout realizado com sucesso' });
});

app.get('/auth/verify', (req, res) => {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    if (sessionId && activeSessions.has(sessionId)) {
        res.json({ 
            valid: true, 
            admin: {
                id: mockDatabase.admin.id,
                username: mockDatabase.admin.username,
                email: mockDatabase.admin.email
            }
        });
    } else {
        res.status(401).json({ valid: false, message: 'Sessão inválida' });
    }
});

// Admin endpoints
app.get('/admin/:id', (req, res) => {
    const { id } = req.params;
    if (id === mockDatabase.admin.id || id === '1') {
        res.json(mockDatabase.admin);
    } else {
        res.status(404).json({ message: 'Admin não encontrado' });
    }
});

app.patch('/admin/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    if (id === mockDatabase.admin.id || id === '1') {
        // Não permitir mudança de username por questões de segurança
        const { username, ...updates } = req.body;
        mockDatabase.admin = { ...mockDatabase.admin, ...updates };
        res.json(mockDatabase.admin);
    } else {
        res.status(404).json({ message: 'Admin não encontrado' });
    }
});

// Horarios endpoints (protegidos para modificação)
app.get('/horarios', (req, res) => {
    res.json(mockDatabase.horarios);
});

app.patch('/horarios', requireAuth, (req, res) => {
    mockDatabase.horarios = { ...mockDatabase.horarios, ...req.body };
    res.json(mockDatabase.horarios);
});

// Agendamentos endpoints
app.get('/agendamentos', (req, res) => {
    res.json(mockDatabase.agendamentos);
});

app.post('/agendamentos', (req, res) => {
    const agendamento = {
        id: Date.now().toString(),
        ...req.body,
        timestamp: new Date().toISOString(),
        status: 'pendente'
    };
    mockDatabase.agendamentos.push(agendamento);
    res.status(201).json(agendamento);
});

// Catch-all para routes não implementadas
app.all('*', (req, res) => {
    res.status(404).json({
        message: 'Endpoint não encontrado',
        availableEndpoints: [
            'GET /test',
            'POST /auth/login',
            'POST /auth/logout', 
            'GET /auth/verify',
            'GET /admin/1',
            'PATCH /admin/1 (protegido)',
            'GET /horarios',
            'PATCH /horarios (protegido)',
            'GET /agendamentos',
            'POST /agendamentos'
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`🚀 Barbearia VIP Backend Demo rodando na porta ${PORT}`);
    console.log(`📱 Frontend pode acessar: http://localhost:${PORT}`);
    console.log(`🧪 Teste: http://localhost:${PORT}/test`);
    console.log('💡 Para usar com MongoDB, configure a conexão e use npm run dev');
});

module.exports = app;
