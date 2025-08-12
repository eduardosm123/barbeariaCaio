const mongoose = require('mongoose');
const { Admin } = require('./models/Admin');
const { Horarios } = require('./models/Horarios');
require('dotenv').config();

// Dados iniciais do admin (mesmo do db.json)
const adminData = {
    _id: '66b7e1234567890123456789', // ID fixo para compatibilidade
    username: 'admin',
    password: '1234567',
    email: 'admin@barbeariavip.com'
};

// Dados iniciais dos horários (mesmo do db.json)
const horariosData = {
    _id: 'horarios-config',
    segunda: [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "12:00", "13:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", 
        "21:00", "21:30", "22:00"
    ],
    terca: [
        "11:00", "11:30", "12:00", "13:00", "14:00", "14:30", "15:00", "15:30", 
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
        "20:00", "20:30", "21:00", "21:30", "22:00"
    ],
    quarta: [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
    ],
    quinta: [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
    ],
    sexta: [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
    ],
    sabado: [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
    ],
    domingo: []
};

async function seedDatabase() {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGO_DB_CONNECTION || 'mongodb://localhost:27017/barbearia');
        console.log('Conectado ao MongoDB');

        // Verificar se admin já existe
        const existingAdmin = await Admin.findById(adminData._id);
        if (!existingAdmin) {
            const admin = new Admin(adminData);
            await admin.save();
            console.log('Admin criado com sucesso');
        } else {
            console.log('Admin já existe, pulando...');
        }

        // Verificar se horários já existem
        const existingHorarios = await Horarios.findOne({ _id: 'horarios-config' });
        if (!existingHorarios) {
            const horarios = new Horarios(horariosData);
            await horarios.save();
            console.log('Horários criados com sucesso');
        } else {
            console.log('Horários já existem, pulando...');
        }

        console.log('Seed completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('Erro durante o seed:', error);
        process.exit(1);
    }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
