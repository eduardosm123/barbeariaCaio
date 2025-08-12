const router = require('express').Router();
const {
    getHorarios,
    updateHorarios
} = require('../controllers/horariosController');
const requireAuth = require('../middleware/auth');

// GET /horarios - público (para clientes verem horários disponíveis)
router.get('/horarios', getHorarios);

// PATCH /horarios - protegido (só admin pode modificar)
router.patch('/horarios', requireAuth, updateHorarios);

module.exports = router;
