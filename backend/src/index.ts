import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init.js';
import chapasRouter from './routes/chapas.js';
import formatosRouter from './routes/formatos.js';
import pedidosRouter from './routes/pedidos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/chapas', chapasRouter);
app.use('/api/formatos', formatosRouter);
app.use('/api/pedidos', pedidosRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicializar banco e servidor
const start = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

start();
