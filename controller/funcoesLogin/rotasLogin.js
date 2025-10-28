const express = require('express');
const Router = express.Router();
const db = require('../../config/db');
const jwt = require('jsonwebtoken');

Router.get('/LoginDoUsuarios', async (req, res) => {
  res.set('Cache-Control', 'no-store');
   res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

  const { nome_user, senha_user } = req.query;

  if (!nome_user || !senha_user) {
    return res.status(400).json({ message: 'Nome de usuário e senha são necessários.' });
  }

  try {
    // 1️⃣ Valida usuário
    const [usuarios] = await db.query('SELECT * FROM ft_usuarios WHERE nome_user = ? AND senha_user = ?', [nome_user, senha_user]);
    if (usuarios.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
    const user = usuarios[0];

    // 2️⃣ Busca grupos do usuário
    const [grupos] = await db.query('SELECT nome_grupo FROM ft_grupos WHERE FIND_IN_SET(?, cod_users)', [user.id_user]);
    const gruposUsuario = grupos.map(g => g.nome_grupo);

    // 3️⃣ Busca telas e elementos permitidos para os grupos do usuário
    const [permissoes] = await db.query(
      `SELECT 
         p.cod_tela, 
         t.nome_tela, 
         e.elemento, 
         p.permissao
       FROM ft_tela_elemento_perm p
       JOIN ft_telas t ON t.nome_tela = p.cod_tela
       JOIN ft_tela_elemento e ON e.elemento = p.elemento_html
       WHERE p.nome_grupo IN (?)`,
      [gruposUsuario]
    );

    // 4️⃣ Gera token (opcional)
    const token = jwt.sign({ id_user: user.id_user, grupos: gruposUsuario }, process.env.JWT_SECRET || 'segredo', { expiresIn: '9h' });

    // 5️⃣ Remove senha e envia tudo
    const { senha_user: _, ...userWithoutPassword } = user;
    res.json({
      sucesso: true,
      usuario: userWithoutPassword,
      grupos: gruposUsuario,
      permissoes,
      token
    });

  } catch (err) {
    console.error('Erro ao autenticar usuário:', err);
    res.status(500).json({ message: 'Erro ao autenticar.' });
  }
});

module.exports = Router;
