import express from 'express';
import { getPool } from '../database/init.js';

const router = express.Router();
const pool = getPool();

// Listar todas as chapas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM chapas ORDER BY tipo, espessura'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar chapas' });
  }
});

// Criar chapa
router.post('/', async (req, res) => {
  const { nome, tipo, espessura, desconto_por_dobra } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO chapas (nome, tipo, espessura, desconto_por_dobra) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, tipo, espessura, desconto_por_dobra]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar chapa' });
  }
});

// Obter chapa por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM chapas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Chapa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter chapa' });
  }
});

// Atualizar chapa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, espessura, desconto_por_dobra } = req.body;
  try {
    const result = await pool.query(
      'UPDATE chapas SET nome = $1, tipo = $2, espessura = $3, desconto_por_dobra = $4, atualizada_em = NOW() WHERE id = $5 RETURNING *',
      [nome, tipo, espessura, desconto_por_dobra, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Chapa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar chapa' });
  }
});

// Deletar chapa
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM chapas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Chapa não encontrada' });
    }
    res.json({ mensagem: 'Chapa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar chapa' });
  }
});

export default router;
