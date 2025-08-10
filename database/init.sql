-- Inicialización de la Base de Datos API Login
-- Este script se ejecuta automáticamente al crear el contenedor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Índices optimizados para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Tabla para sesiones (opcional, si no usamos solo JWT)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Índices para sesiones
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);

-- Tabla para rate limiting (opcional, complementa Redis)
CREATE TABLE IF NOT EXISTS rate_limit_log (
    id SERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    attempts INTEGER DEFAULT 1,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE
);

-- Índices para rate limiting
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip ON rate_limit_log(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limit_endpoint ON rate_limit_log(endpoint);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para auto-actualizar updated_at en users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos de prueba (opcional para desarrollo)
INSERT INTO users (email, password, first_name, last_name) 
VALUES 
    ('test@example.com', '$2b$10$rKjXVQ8mYmZ.1mF0vQoJuuZ9kDxOYF4rp6DlE4h2Mk/nWZtEj.K6e', 'Test', 'User'),
    ('admin@example.com', '$2b$10$rKjXVQ8mYmZ.1mF0vQoJuuZ9kDxOYF4rp6DlE4h2Mk/nWZtEj.K6e', 'Admin', 'User')
ON CONFLICT (email) DO NOTHING;

-- Mostrar resultado
\echo 'Database initialized successfully!'
