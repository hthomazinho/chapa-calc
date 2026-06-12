import express from 'express';
import multer from 'multer';
import { getPool } from '../database/init.js';

const router = express.Router();
const pool = getPool();

// Configurar upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Buscar formatos por tipo (nome)
router.get('/buscar/:tipo', async (req, res) => {
  const { tipo } = req.params;
  try {
    const result = await pool.query(
      'SELECT f.*, c.tipo, c.espessura FROM formatos f JOIN chapas c ON f.chapa_id = c.id WHERE LOWER(f.nome) LIKE LOWER($1)',
      [`%${tipo}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar formatos' });
  }
});

// Listar formatos por chapa
router.get('/chapa/:chapa_id', async (req, res) => {
  const { chapa_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM formatos WHERE chapa_id = $1 ORDER BY nome',
      [chapa_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar formatos' });
  }
});

// Criar novo formato
router.post('/', upload.single('foto'), async (req, res) => {
  const { nome, chapa_id, quantidade_dobras, descricao } = req.body;
  const foto_url = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const result = await pool.query(
      'INSERT INTO formatos (nome, chapa_id, foto_url, quantidade_dobras, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, chapa_id, foto_url, quantidade_dobras, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar formato' });
  }
});

// Obter formato com suas dobras
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const formato = await pool.query('SELECT * FROM formatos WHERE id = $1', [id]);
    if (formato.rows.length === 0) {
      return res.status(404).json({ erro: 'Formato não encontrado' });
    }
    
    const dobras = await pool.query('SELECT * FROM dobras_formato WHERE formato_id = $1 ORDER BY numero_dobra', [id]);
    
    res.json({
      ...formato.rows[0],
      dobras: dobras.rows
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter formato' });
  }
});

// Adicionar dobra ao formato
router.post('/:formato_id/dobras', async (req, res) => {
  const { formato_id } = req.params;
  const { numero_dobra, grau, posicao } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO dobras_formato (formato_id, numero_dobra, grau, posicao) VALUES ($1, $2, $3, $4) RETURNING *',
      [formato_id, numero_dobra, grau, posicao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar dobra' });
  }
});

export default router;
