-- Script SQL para criar as tabelas necessárias no Supabase
-- ATENÇÃO: Este arquivo é apenas para referência das estruturas das tabelas
-- As credenciais devem ser inseridas manualmente via Dashboard do Supabase

-- Tabela de admins
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de horários (uma única linha com configuração)
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

-- Tabela de agendamentos
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

-- NOTA: Para inserir dados iniciais, use o Dashboard do Supabase ou o script setup-supabase.js
-- Não mantenha credenciais em arquivos de código por questões de segurança
