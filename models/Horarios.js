const mongoose = require("mongoose");

const { Schema } = mongoose;

const horariosSchema = new Schema({
    _id: {
        type: String,
        default: 'horarios-config'
    },
    segunda: [{
        type: String
    }],
    terca: [{
        type: String
    }],
    quarta: [{
        type: String
    }],
    quinta: [{
        type: String
    }],
    sexta: [{
        type: String
    }],
    sabado: [{
        type: String
    }],
    domingo: [{
        type: String
    }]
}, { timestamps: true, _id: false });

const Horarios = mongoose.model("Horarios", horariosSchema);

module.exports = { Horarios };
