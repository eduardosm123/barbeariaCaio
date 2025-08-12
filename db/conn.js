const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_CONNECTION = process.env.MONGO_DB_CONNECTION || 'mongodb://localhost:27017/barbearia';

async function main() {
    try {
        await mongoose.connect(MONGO_CONNECTION);
        console.log("Conectado ao banco de dados MongoDB");
    } catch(error) {
        console.log("Erro ao conectar ao banco:", error);
    }
}

module.exports = main