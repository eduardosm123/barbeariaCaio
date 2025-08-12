// arquivo centralizador

const router = require('express').Router();

// importação das rotas existentes
const categoryRouter = require('./category')
const productRouter = require('./product')

// importação das novas rotas para barbearia
const adminRouter = require('./admin')
const horariosRouter = require('./horarios')
const agendamentoRouter = require('./agendamento')

// rotas existentes
router.use("/", categoryRouter);
router.use("/", productRouter);

// novas rotas para barbearia
router.use("/", adminRouter);
router.use("/", horariosRouter);
router.use("/", agendamentoRouter);

module.exports = router;