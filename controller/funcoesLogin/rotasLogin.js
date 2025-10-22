const express = require('express');
const Router = express.Router();
const db = require('../../config/db'); // Pool de conexões com promessa

Router.get('/LoginDoUsuarios', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { nome_user, senha_user } = req.query;

  if (!nome_user || !senha_user) {
    return res.status(400).json({ message: 'Nome de usuário e senha são necessários.' });
  }

  const sql = 'SELECT * FROM ft_usuarios WHERE nome_user = ? AND senha_user = ?';

  try {
    const [results] = await db.query(sql, [nome_user, senha_user]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const { senha_user: _, ...userWithoutPassword } = results[0];
    res.json(userWithoutPassword);

  } catch (err) {
    console.error('Erro ao consultar usuário:', err);
    res.status(500).json({ message: 'Erro ao consultar usuários.' });
  }
});

module.exports = Router;
