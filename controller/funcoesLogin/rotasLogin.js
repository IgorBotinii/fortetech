const express = require('express');
const Router = express.Router();
const conexaoProducao = require('../../server.js');
Router.get('/LoginDoUsuarios', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const { nome_user, senha_user } = req.query;
    if (!nome_user || !senha_user) {
        return res.status(400).json({ message: 'Nome de usuário e senha são necessários.' });
    }
    const sql = 'SELECT * FROM ft_usuarios WHERE nome_user = ? AND senha_user = ?';
    conexaoProducao.query(sql, [nome_user, senha_user], (err, results) => {
        if (err) {
            console.error('Erro ao consultar nome do usuário:', err);
            return res.status(500).json({ message: 'Erro ao consultar os usuários.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const { senha_user, ...userWithoutPassword } = results[0];
        res.json(userWithoutPassword);
    });
});

module.exports = Router;