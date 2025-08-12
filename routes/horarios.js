const router = require('express').Router();
const {
    getHorarios,
    updateHorarios
} = require('../controllers/horariosController');

// GET /horarios
router.get('/horarios', getHorarios);

// PATCH /horarios
router.patch('/horarios', updateHorarios);

module.exports = router;
