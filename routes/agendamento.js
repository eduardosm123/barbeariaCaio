const router = require('express').Router();
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
router.patch('/agendamentos/:id', updateAgendamento);

// DELETE /agendamentos/:id
router.delete('/agendamentos/:id', deleteAgendamento);

// GET /agendamentos/data/:data
router.get('/agendamentos/data/:data', getAgendamentosByData);

module.exports = router;
