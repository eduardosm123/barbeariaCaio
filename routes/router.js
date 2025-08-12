// arquivo centralizador

const router = require('express').Router();

 

// importação das novas rotas para barbearia
const adminRouter = require('./admin')
const horariosRouter = require('./horarios')
const agendamentoRouter = require('./agendamento')
const authRouter = require('./auth')
 

// novas rotas para barbearia
router.use("/auth", authRouter);
router.use("/", adminRouter);
router.use("/", horariosRouter);
router.use("/", agendamentoRouter);

module.exports = router;