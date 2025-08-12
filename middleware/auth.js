// Sistema simples de sessões em memória (importado do app.js)
// Middleware para verificar autenticação (para rotas protegidas)
const requireAuth = (req, res, next) => {
    const sessionId = req.get('x-session-id') || req.query.sessionId;

    // Verificar se o global.activeSessions existe e foi inicializado
    if (!global.activeSessions) {
        console.error('Sistema de sessões não inicializado');
        return res.status(500).json({ message: 'Erro interno do servidor - sessões não inicializadas' });
    }
    
    if (!sessionId || !global.activeSessions.has(sessionId)) {
        return res.status(401).json({ message: 'Acesso negado. Faça login primeiro.' });
    }
    
    next();
};

// Função para gerar ID de sessão simples
const generateSessionId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

module.exports = {
    requireAuth,
    generateSessionId
};