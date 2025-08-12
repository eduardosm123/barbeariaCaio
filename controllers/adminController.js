const { Admin } = require("../models/Admin");

// GET /admin/:id
const getAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);
        
        if (!admin) {
            return res.status(404).json({ message: "Admin não encontrado" });
        }
        
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// GET /admin
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// POST /admin
const createAdmin = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }
        
        const admin = new Admin({ username, password, email });
        await admin.save();
        
        res.status(201).json(admin);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username ou email já existe" });
        }
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// PATCH /admin/:id
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const admin = await Admin.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        
        if (!admin) {
            return res.status(404).json({ message: "Admin não encontrado" });
        }
        
        res.status(200).json(admin);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username ou email já existe" });
        }
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// DELETE /admin/:id
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByIdAndDelete(id);
        
        if (!admin) {
            return res.status(404).json({ message: "Admin não encontrado" });
        }
        
        res.status(200).json({ message: "Admin deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

module.exports = {
    getAdmin,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
};
