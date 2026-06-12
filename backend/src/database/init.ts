import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initializeDatabase = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    console.log('✅ Banco de dados inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  }
};

export const getPool = () => pool;
