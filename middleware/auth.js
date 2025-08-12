const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: "Token de acesso necessário",
            error: "Não autenticado" 
        });
    }
    
    const token = authHeader.substring(7);
    
    // Validação simples - substitua por JWT se necessário
    if (!token || token.length < 10) {
        return res.status(401).json({ 
            message: "Token inválido",
            error: "Token malformado" 
        });
    }
    
    // Por ora, aceita qualquer token válido
    // Aqui você pode adicionar verificação JWT:
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decoded;
    // } catch (error) {
    //     return res.status(401).json({ message: "Token inválido" });
    // }
    
    req.user = { authenticated: true };
    next();
};

module.exports = requireAuth;
