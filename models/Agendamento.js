const mongoose = require("mongoose");

const { Schema } = mongoose;

const agendamentoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    servico: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'confirmado', 'cancelado', 'finalizado'],
        default: 'pendente'
    }
}, { timestamps: true });

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

module.exports = { Agendamento };
