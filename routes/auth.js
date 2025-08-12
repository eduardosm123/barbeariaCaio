const router = require("express").Router();
const { Admin } = require("../models/Admin");
const { generateSessionId } = require("../middleware/auth");

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username e password são obrigatórios' });
        }
        
        // Buscar admin no banco de dados
        const admin = await Admin.findOne({ username, password });
        
        if (!admin) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        
        const sessionId = generateSessionId();
        
        // Acessar activeSessions do contexto global
        if (!global.activeSessions) {
            global.activeSessions = new Set();
        }
        global.activeSessions.add(sessionId);
        
        res.json({
            message: 'Login realizado com sucesso',
            sessionId: sessionId,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    
    if (sessionId && global.activeSessions) {
        global.activeSessions.delete(sessionId);
    }
    
    res.json({ message: 'Logout realizado com sucesso' });
});

// GET /auth/verify
router.get('/verify', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || req.query.sessionId;
        
        if (!sessionId || !global.activeSessions || !global.activeSessions.has(sessionId)) {
            return res.status(401).json({ valid: false, message: 'Sessão inválida' });
        }
        
        // Buscar dados do admin para retornar (pode ser melhorado para armazenar dados da sessão)
        const admin = await Admin.findOne(); // Por enquanto, pega o primeiro admin
        
        res.json({ 
            valid: true, 
            admin: admin ? {
                id: admin._id,
                username: admin.username,
                email: admin.email
            } : { id: 1, username: 'admin', email: 'admin@barbeariavip.com' }
        });
        
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Erro na verificação' });
    }
});

module.exports = router;