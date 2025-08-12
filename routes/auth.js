const router = require('express').Router();
const { Admin } = require('../models/Admin');

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username e password são obrigatórios" 
            });
        }
        
        // Buscar admin no banco
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(401).json({ 
                message: "Credenciais inválidas" 
            });
        }
        
        // Verificar senha (assumindo que está em texto plano por enquanto)
        if (admin.password !== password) {
            return res.status(401).json({ 
                message: "Credenciais inválidas" 
            });
        }
        
        // Gerar token simples (substitua por JWT em produção)
        const token = `admin_${admin._id}_${Date.now()}`;
        
        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: "Erro interno do servidor", 
            error: error.message 
        });
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    res.status(200).json({ 
        message: "Logout realizado com sucesso" 
    });
});

// GET /auth/verify - verificar se token é válido
router.get('/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: "Token não fornecido" 
        });
    }
    
    const token = authHeader.substring(7);
    
    if (!token || token.length < 10) {
        return res.status(401).json({ 
            message: "Token inválido" 
        });
    }
    
    res.status(200).json({ 
        message: "Token válido",
        authenticated: true 
    });
});

module.exports = router;
