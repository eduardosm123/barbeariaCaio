const express = require('express');
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// App com Supabase
const app = express();

// Middlewares - CORS completamente desabilitado
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(express.json());

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sistema simples de sessões em memória
let activeSessions = new Set();

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    if (!sessionId || !activeSessions.has(sessionId)) {
        return res.status(401).json({ message: 'Acesso negado. Faça login primeiro.' });
    }
    
    next();
};

// Função para gerar ID de sessão simples
const generateSessionId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Função para inicializar tabelas no Supabase
async function initializeTables() {
    try {
        // Criar tabela de admins se não existir
        const { error: adminError } = await supabase.rpc('create_admin_table');
        
        // Criar tabela de horarios se não existir
        const { error: horariosError } = await supabase.rpc('create_horarios_table');
        
        // Criar tabela de agendamentos se não existir
        const { error: agendamentosError } = await supabase.rpc('create_agendamentos_table');
        
        console.log('✅ Tabelas inicializadas no Supabase');
    } catch (error) {
        console.log('ℹ️ Usando tabelas existentes ou criando manualmente');
    }
}

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Barbearia VIP Backend - Servidor funcionando com Supabase!', 
        timestamp: new Date().toISOString(),
        status: 'OK',
        database: 'Supabase PostgreSQL'
    });
});

// Auth endpoints
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username e password são obrigatórios' });
        }
        
        // Buscar admin no Supabase
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error || !admin) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        
        const sessionId = generateSessionId();
        activeSessions.add(sessionId);
        
        res.json({
            message: 'Login realizado com sucesso',
            sessionId: sessionId,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.post('/auth/logout', (req, res) => {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    
    if (sessionId) {
        activeSessions.delete(sessionId);
    }
    
    res.json({ message: 'Logout realizado com sucesso' });
});

app.get('/auth/verify', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || req.query.sessionId;
        
        if (!sessionId || !activeSessions.has(sessionId)) {
            return res.status(401).json({ valid: false, message: 'Sessão inválida' });
        }
        
        // Buscar dados do admin para retornar
        const { data: admin } = await supabase
            .from('admins')
            .select('id, username, email')
            .eq('username', 'admin')
            .single();
        
        res.json({ 
            valid: true, 
            admin: admin || { id: 1, username: 'admin', email: 'admin@barbeariavip.com' }
        });
        
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Erro na verificação' });
    }
});

// Admin endpoints
app.get('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error || !admin) {
            return res.status(404).json({ message: 'Admin não encontrado' });
        }
        
        res.json(admin);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.patch('/admin/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, ...updates } = req.body; // Não permitir mudança de username
        
        const { data: admin, error } = await supabase
            .from('admins')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error || !admin) {
            return res.status(404).json({ message: 'Admin não encontrado' });
        }
        
        res.json(admin);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Horarios endpoints
app.get('/horarios', async (req, res) => {
    try {
        const { data: horarios, error } = await supabase
            .from('horarios')
            .select('*')
            .eq('id', 'config')
            .single();
        
        if (error || !horarios) {
            // Retornar configuração padrão se não existir
            const defaultHorarios = {
                segunda: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                terca: ["11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                quarta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                quinta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                sexta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                sabado: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                domingo: []
            };
            return res.json(defaultHorarios);
        }
        
        // Retornar apenas os horários, sem metadados
        const { id, created_at, updated_at, ...horariosData } = horarios;
        res.json(horariosData);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.patch('/horarios', requireAuth, async (req, res) => {
    try {
        const { data: existingHorarios } = await supabase
            .from('horarios')
            .select('*')
            .eq('id', 'config')
            .single();
        
        if (existingHorarios) {
            // Atualizar registro existente
            const { data: horarios, error } = await supabase
                .from('horarios')
                .update(req.body)
                .eq('id', 'config')
                .select()
                .single();
            
            if (error) {
                return res.status(500).json({ message: 'Erro ao atualizar horários' });
            }
            
            const { id, created_at, updated_at, ...horariosData } = horarios;
            res.json(horariosData);
        } else {
            // Criar novo registro
            const { data: horarios, error } = await supabase
                .from('horarios')
                .insert({ id: 'config', ...req.body })
                .select()
                .single();
            
            if (error) {
                return res.status(500).json({ message: 'Erro ao criar horários' });
            }
            
            const { id, created_at, updated_at, ...horariosData } = horarios;
            res.json(horariosData);
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Agendamentos endpoints
app.get('/agendamentos', async (req, res) => {
    try {
        const { data: agendamentos, error } = await supabase
            .from('agendamentos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            return res.status(500).json({ message: 'Erro ao buscar agendamentos' });
        }
        
        res.json(agendamentos || []);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Endpoint paginado com filtros para agendamentos
app.get('/agendamentos/paginated', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            data: dataFiltro,
            status,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        // Validar parâmetros de paginação
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
            return res.status(400).json({ 
                message: 'Parâmetros de paginação inválidos. Page >= 1, limit entre 1 e 100' 
            });
        }

        // Calcular offset
        const offset = (pageNum - 1) * limitNum;

        // Construir query base
        let query = supabase
            .from('agendamentos')
            .select('*', { count: 'exact' });

        // Aplicar filtro por data se fornecido
        if (dataFiltro) {
            query = query.eq('data', dataFiltro);
        }

        // Aplicar filtro por status se fornecido
        if (status) {
            query = query.eq('status', status);
        }

        // Aplicar ordenação
        const ascending = sortOrder.toLowerCase() === 'asc';
        query = query.order(sortBy, { ascending });

        // Aplicar paginação
        query = query.range(offset, offset + limitNum - 1);

        const { data: agendamentos, error, count } = await query;

        if (error) {
            return res.status(500).json({ message: 'Erro ao buscar agendamentos' });
        }

        // Calcular informações de paginação
        const totalPages = Math.ceil(count / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        res.json({
            data: agendamentos || [],
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: count,
                itemsPerPage: limitNum,
                hasNextPage,
                hasPrevPage
            },
            filters: {
                data: dataFiltro || null,
                status: status || null,
                sortBy,
                sortOrder
            }
        });

    } catch (error) {
        console.error('Erro ao buscar agendamentos paginados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.post('/agendamentos', async (req, res) => {
    try {
        const { nome, telefone, servico, data, horario, status } = req.body;
        
        if (!nome || !telefone || !servico || !data || !horario) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
        }
        
        const { data: agendamento, error } = await supabase
            .from('agendamentos')
            .insert({
                nome,
                telefone,
                servico,
                data,
                horario,
                status: status || 'pendente'
            })
            .select()
            .single();
        
        if (error) {
            return res.status(500).json({ message: 'Erro ao criar agendamento' });
        }
        
        res.status(201).json(agendamento);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.get('/agendamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data: agendamento, error } = await supabase
            .from('agendamentos')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error || !agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }
        
        res.json(agendamento);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// PATCH /agendamentos/:id
app.patch('/agendamentos/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, telefone, servico, data, horario, status } = req.body;

        // Verificar se pelo menos um campo foi enviado para atualização
        if (!nome && !telefone && !servico && !data && !horario && !status) {
            return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização' });
        }

        // Criar objeto com apenas os campos que foram enviados
        const updateData = {};
        if (nome !== undefined) updateData.nome = nome;
        if (telefone !== undefined) updateData.telefone = telefone;
        if (servico !== undefined) updateData.servico = servico;
        if (data !== undefined) updateData.data = data;
        if (horario !== undefined) updateData.horario = horario;
        if (status !== undefined) updateData.status = status;
        
        // Sempre atualizar o timestamp
        updateData.updated_at = new Date().toISOString();

        const { data: agendamento, error } = await supabase
            .from('agendamentos')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        res.json(agendamento);

    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// DELETE /agendamentos/:id
app.delete('/agendamentos/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: agendamento, error } = await supabase
            .from('agendamentos')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error || !agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        res.json({ message: 'Agendamento deletado com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// DELETE /agendamentos/cleanup/past - Remove todos os agendamentos que já passaram
app.delete('/agendamentos/cleanup/past', requireAuth, async (req, res) => {
    try {
        // Obter data atual no formato YYYY-MM-DD
        const hoje = new Date();
        const dataAtual = hoje.toISOString().split('T')[0];
        
        // Obter hora atual no formato HH:MM
        const horaAtual = hoje.toTimeString().split(' ')[0].substring(0, 5);

        // Primeiro, buscar agendamentos que já passaram para contabilizar
        const { data: agendamentosPassados, error: searchError } = await supabase
            .from('agendamentos')
            .select('*')
            .or(`data.lt.${dataAtual},and(data.eq.${dataAtual},horario.lt.${horaAtual})`);

        if (searchError) {
            console.error('Erro ao buscar agendamentos passados:', searchError);
            return res.status(500).json({ message: 'Erro ao buscar agendamentos passados' });
        }

        const quantidadeEncontrada = agendamentosPassados?.length || 0;

        if (quantidadeEncontrada === 0) {
            return res.json({ 
                message: 'Nenhum agendamento passado encontrado para remover',
                removidos: 0,
                dataHoraReferencia: `${dataAtual} ${horaAtual}`
            });
        }

        // Remover agendamentos que já passaram
        const { data: agendamentosRemovidos, error: deleteError } = await supabase
            .from('agendamentos')
            .delete()
            .or(`data.lt.${dataAtual},and(data.eq.${dataAtual},horario.lt.${horaAtual})`)
            .select();

        if (deleteError) {
            console.error('Erro ao remover agendamentos passados:', deleteError);
            return res.status(500).json({ message: 'Erro ao remover agendamentos passados' });
        }

        const quantidadeRemovida = agendamentosRemovidos?.length || 0;

        res.json({ 
            message: `${quantidadeRemovida} agendamento(s) passado(s) removido(s) com sucesso`,
            removidos: quantidadeRemovida,
            dataHoraReferencia: `${dataAtual} ${horaAtual}`,
            agendamentosRemovidos: agendamentosRemovidos
        });

    } catch (error) {
        console.error('Erro ao limpar agendamentos passados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;

// Inicializar tabelas e depois iniciar servidor
initializeTables().then(() => {
    app.listen(PORT, function() {
        console.log(`🚀 Barbearia VIP Backend com Supabase rodando na porta ${PORT}`);
        console.log(`📱 Frontend pode acessar: http://localhost:${PORT}`);
        console.log(`🧪 Teste: http://localhost:${PORT}/test`);
        console.log('🗄️ Usando Supabase PostgreSQL como banco de dados');
    });
}).catch((error) => {
    console.error('Erro ao inicializar:', error);
    // Iniciar mesmo se houver erro na inicialização das tabelas
    app.listen(PORT, function() {
        console.log(`🚀 Barbearia VIP Backend rodando na porta ${PORT} (verificar configuração do Supabase)`);
    });
});

module.exports = app;
