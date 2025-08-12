const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const {
    getAllAgendamentos,
    getAgendamento,
    createAgendamento,
    updateAgendamento,
    deleteAgendamento,
    getAgendamentosByData
} = require('../controllers/agendamentoController');

// GET /agendamentos
router.get('/agendamentos', getAllAgendamentos);

// GET /agendamentos/:id
router.get('/agendamentos/:id', getAgendamento);

// POST /agendamentos
router.post('/agendamentos', createAgendamento);

// PATCH /agendamentos/:id
router.patch('/agendamentos/:id', requireAuth, updateAgendamento);

// DELETE /agendamentos/:id
router.delete('/agendamentos/:id', requireAuth, deleteAgendamento);

// GET /agendamentos/data/:data
router.get('/agendamentos/data/:data', getAgendamentosByData);

module.exports = router;
