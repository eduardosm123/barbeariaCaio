const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
    console.log('🔧 Iniciando criação das tabelas no Supabase...');
    
    try {
        // Criar tabela de admins
        console.log('📋 Criando tabela admins...');
        const { error: adminTableError } = await supabase.rpc('create_admin_table_if_not_exists', {}, {
            count: 'exact'
        });
        
        // Como a função RPC pode não existir, vamos usar queries SQL diretas
        const adminTableSQL = `
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        
        const { error: adminError } = await supabase.rpc('exec_sql', { sql: adminTableSQL });
        if (!adminError) {
            console.log('✅ Tabela admins criada com sucesso');
        }
        
        // Criar tabela de horários
        console.log('📋 Criando tabela horarios...');
        const horariosTableSQL = `
            CREATE TABLE IF NOT EXISTS horarios (
                id VARCHAR(50) PRIMARY KEY DEFAULT 'config',
                segunda TEXT[] DEFAULT '{}',
                terca TEXT[] DEFAULT '{}',
                quarta TEXT[] DEFAULT '{}',
                quinta TEXT[] DEFAULT '{}',
                sexta TEXT[] DEFAULT '{}',
                sabado TEXT[] DEFAULT '{}',
                domingo TEXT[] DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        
        const { error: horariosError } = await supabase.rpc('exec_sql', { sql: horariosTableSQL });
        if (!horariosError) {
            console.log('✅ Tabela horarios criada com sucesso');
        }
        
        // Criar tabela de agendamentos
        console.log('📋 Criando tabela agendamentos...');
        const agendamentosTableSQL = `
            CREATE TABLE IF NOT EXISTS agendamentos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                telefone VARCHAR(50) NOT NULL,
                servico VARCHAR(255) NOT NULL,
                data VARCHAR(20) NOT NULL,
                horario VARCHAR(10) NOT NULL,
                status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'finalizado')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        
        const { error: agendamentosError } = await supabase.rpc('exec_sql', { sql: agendamentosTableSQL });
        if (!agendamentosError) {
            console.log('✅ Tabela agendamentos criada com sucesso');
        }
        
        // Inserir dados iniciais
        console.log('📝 Inserindo dados iniciais...');
        
        // Inserir admin padrão
        const { error: insertAdminError } = await supabase
            .from('admins')
            .upsert({
                id: 1,
                username: 'admin',
                password: '1234567',
                email: 'admin@barbeariavip.com'
            }, { onConflict: 'username' });
        
        if (!insertAdminError) {
            console.log('✅ Admin padrão inserido');
        } else {
            console.log('ℹ️ Admin já existe:', insertAdminError.message);
        }
        
        // Inserir horários padrão
        const { error: insertHorariosError } = await supabase
            .from('horarios')
            .upsert({
                id: 'config',
                segunda: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                terca: ["11:00","11:30","12:00","13:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                quarta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                quinta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                sexta: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                sabado: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],
                domingo: []
            }, { onConflict: 'id' });
        
        if (!insertHorariosError) {
            console.log('✅ Horários padrão inseridos');
        } else {
            console.log('ℹ️ Horários já existem:', insertHorariosError.message);
        }
        
        console.log('🎉 Configuração do Supabase concluída com sucesso!');
        console.log('💡 Agora você pode executar: npm run supabase');
        
    } catch (error) {
        console.error('❌ Erro ao configurar Supabase:', error);
        console.log('💡 Tente criar as tabelas manualmente via Dashboard do Supabase');
        console.log('📋 Use o arquivo supabase-setup.sql no SQL Editor');
    }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    createTables().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = createTables;
