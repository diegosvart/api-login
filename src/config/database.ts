import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión PostgreSQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'api_login_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',

    // Configuraciones de pool optimizadas
    min: 2,                    // Mínimo de conexiones
    max: 10,                   // Máximo de conexiones
    idleTimeoutMillis: 30000,  // Tiempo antes de cerrar conexión idle
    connectionTimeoutMillis: 10000, // Timeout para obtener conexión

    // Configuraciones adicionales
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Crear pool de conexiones
const pool = new Pool(dbConfig);

// Event listeners para debugging y monitoring
pool.on('connect', (client: PoolClient) => {
    console.log(`✅ Nueva conexión PostgreSQL establecida`);
});

pool.on('error', (err, client) => {
    console.error('❌ Error en conexión PostgreSQL:', err);
    process.exit(-1);
});

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time');
        client.release();

        console.log('✅ Conexión PostgreSQL exitosa:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error);
        console.warn('⚠️  Continuando en modo desarrollo sin base de datos...');
        return false;
    }
};

// Función helper para ejecutar queries
export const query = async (text: string, params?: any[]): Promise<any> => {
    const start = Date.now();

    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        // Log de performance para queries lentas (>100ms)
        if (duration > 100) {
            console.warn(`⚠️ Query lenta (${duration}ms):`, text.substring(0, 100));
        }

        return result;
    } catch (error) {
        console.error('❌ Error ejecutando query:', error);
        console.error('Query:', text);
        console.error('Params:', params);
        throw error;
    }
};

// Función para obtener cliente del pool (para transacciones)
export const getClient = async (): Promise<PoolClient> => {
    return await pool.connect();
};

// Función para cerrar pool (útil para tests)
export const closePool = async (): Promise<void> => {
    await pool.end();
    console.log('✅ Pool de conexiones PostgreSQL cerrado');
};

export { pool };
export default pool;
