const { Horarios } = require("../models/Horarios");
const { Admin } = require("../models/Admin");
// GET /horarios
const getHorarios = async (req, res) => {
  try {
    let horarios = await Horarios.findOne({ _id: "horarios-config" });

    if (!horarios) {
      // Criar configuração padrão se não existir
      const horariosDefault = {
        _id: "horarios-config",
        segunda: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
        ],
        terca: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
        ],
        quarta: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
        ],
        quinta: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
        ],
        sexta: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
        ],
        sabado: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
          "17:00",
          "17:30",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
          "20:30",
          "21:00",
          "21:30",
          "22:00",
        ],
        domingo: [],
      };

      horarios = new Horarios(horariosDefault);
      await horarios.save();
    }

    // Retornar apenas os dias da semana, sem metadados do MongoDB
    const { segunda, terca, quarta, quinta, sexta, sabado, domingo } = horarios;
    res
      .status(200)
      .json({ segunda, terca, quarta, quinta, sexta, sabado, domingo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro interno do servidor", error: error.message });
  }
};

// PATCH /horarios
const updateHorarios = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e password são obrigatórios" });
    }

    // Buscar admin no banco de dados
    const admin = await Admin.findOne({ username, password });

    if (!admin) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    
    const { segunda, terca, quarta, quinta, sexta, sabado, domingo } = req.body;

    const updates = {};
    if (segunda !== undefined) updates.segunda = segunda;
    if (terca !== undefined) updates.terca = terca;
    if (quarta !== undefined) updates.quarta = quarta;
    if (quinta !== undefined) updates.quinta = quinta;
    if (sexta !== undefined) updates.sexta = sexta;
    if (sabado !== undefined) updates.sabado = sabado;
    if (domingo !== undefined) updates.domingo = domingo;

    const horarios = await Horarios.findOneAndUpdate(
      { _id: "horarios-config" },
      { $set: updates },
      { new: true, upsert: true }
    );

    // Retornar apenas os dias da semana, sem metadados do MongoDB
    const {
      segunda: seg,
      terca: ter,
      quarta: qua,
      quinta: qui,
      sexta: sex,
      sabado: sab,
      domingo: dom,
    } = horarios;
    res.status(200).json({
      segunda: seg,
      terca: ter,
      quarta: qua,
      quinta: qui,
      sexta: sex,
      sabado: sab,
      domingo: dom,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro interno do servidor", error: error.message });
  }
};

module.exports = {
  getHorarios,
  updateHorarios,
};
