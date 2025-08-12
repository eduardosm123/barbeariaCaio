// arquivo centralizador

const router = require('express').Router();

 

// importação das novas rotas para barbearia
const adminRouter = require('./admin')
const horariosRouter = require('./horarios')
const agendamentoRouter = require('./agendamento')
 

// novas rotas para barbearia
router.use("/", adminRouter);
router.use("/", horariosRouter);
router.use("/", agendamentoRouter);

module.exports = router;