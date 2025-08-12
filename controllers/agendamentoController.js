const { Agendamento } = require("../models/Agendamento");

// GET /agendamentos
const getAllAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Agendamento.find().sort({ createdAt: -1 });
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// GET /agendamentos/:id
const getAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const agendamento = await Agendamento.findById(id);
        
        if (!agendamento) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }
        
        res.status(200).json(agendamento);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// POST /agendamentos
const createAgendamento = async (req, res) => {
    try {
        const { nome, telefone, servico, data, horario, status } = req.body;
        
        if (!nome || !telefone || !servico || !data || !horario) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        }
        
        const agendamento = new Agendamento({
            nome,
            telefone,
            servico,
            data,
            horario,
            status: status || 'pendente'
        });
        
        await agendamento.save();
        res.status(201).json(agendamento);
        
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// PATCH /agendamentos/:id
const updateAgendamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status é obrigatório" });
        }

        const agendamento = await Agendamento.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!agendamento) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }

        res.status(200).json(agendamento);

    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// DELETE /agendamentos/:id
const deleteAgendamento = async (req, res) => {
    try {
        const { id } = req.params;

        const agendamento = await Agendamento.findByIdAndDelete(id);

        if (!agendamento) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }

        res.status(200).json({ message: "Agendamento deletado com sucesso" });

    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// GET /agendamentos/data/:data
const getAgendamentosByData = async (req, res) => {
    try {
        const { data } = req.params;
        const agendamentos = await Agendamento.find({ data }).sort({ horario: 1 });
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

module.exports = {
    getAllAgendamentos,
    getAgendamento,
    createAgendamento,
    updateAgendamento,
    deleteAgendamento,
    getAgendamentosByData
};
