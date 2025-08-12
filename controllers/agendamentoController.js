const { Agendamento } = require("../models/Agendamento");
const db = require('../db/conn');
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
        const { id } = req.params; // O ID vem da URL
        const { status } = req.body; // Pega apenas o 'status' do corpo da requisição

        // Comando SQL para atualizar um agendamento
        const sqlQuery = `
            UPDATE agendamentos
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *;
        `;
        // RETURNING * faz com que o banco retorne a linha que foi atualizada

        const params = [status, id];
        
        const { rows } = await db.query(sqlQuery, params);
        
        // Se nenhuma linha foi atualizada (rows está vazio), o agendamento não foi encontrado
        if (rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }
        
        // Retorna o agendamento atualizado
        res.status(200).json(rows[0]);

    } catch (error) {
        console.error(error); // Loga o erro no console do servidor
        res.status(500).json({ message: "Erro interno do servidor", error: error.message });
    }
};

// DELETE /agendamentos/:id
const deleteAgendamento = async (req, res) => {
    try {
        // 1. Pega o ID que vem na URL (ex: /agendamentos/1)
        const { id } = req.params;

        // 2. Define o comando SQL para deletar o item com o ID correspondente
        const sqlQuery = 'DELETE FROM agendamentos WHERE id = $1';
        const params = [id];

        // 3. Executa a query no banco de dados
        const result = await db.query(sqlQuery, params);

        // 4. Verifica se alguma linha foi afetada (deletada).
        // Se rowCount for 0, significa que não foi encontrado um agendamento com aquele ID.
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }

        // 5. Se deu tudo certo, retorna uma mensagem de sucesso.
        res.status(200).json({ message: "Agendamento deletado com sucesso" });

    } catch (error) {
        console.error(error); // É uma boa prática logar o erro no console do servidor
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
