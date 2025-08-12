// Sistema simples de sessões em memória (importado do app.js)
// Middleware para verificar autenticação (para rotas protegidas)
const requireAuth = (req, res, next) => {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    // Importar activeSessions do contexto global ou usar uma implementação local
    const activeSessions = global.activeSessions || new Set();
    
    if (!sessionId || !activeSessions.has(sessionId)) {
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