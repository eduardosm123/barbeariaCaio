const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const {
    getHorarios,
    updateHorarios
} = require('../controllers/horariosController');

// GET /horarios
router.get('/horarios', getHorarios);

// PATCH /horarios (protegido)
router.patch('/horarios', requireAuth, updateHorarios);

module.exports = router;
