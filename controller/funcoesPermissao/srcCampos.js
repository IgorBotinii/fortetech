const express = require('express');
const Router = express.Router();
const db = require('../../config/db');

// 🔸 Busca permissões de uma tela específica (para aplicar ao abrir a tela)
Router.get('/api/permissoesUsuario', async (req, res) => {
    // 🔹 Força o navegador e o proxy a não fazer cache
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });

    const grupos = req.query.grupos ? req.query.grupos.split(',') : [];
    const cod_tela = req.query.cod_tela;

    if (grupos.length === 0 || !cod_tela) {
        return res.status(400).json({ message: 'Grupos e cod_tela são obrigatórios.' });
    }

    // 🔹 Monta placeholders dinâmicos
    const placeholders = grupos.map(() => '?').join(', ');
    const sql = `
        SELECT elemento_html, permissao
        FROM ft_tela_elemento_perm
        WHERE nome_grupo IN (${placeholders})
          AND cod_tela = ?
    `;

    try {
        // 🔹 Sempre cria uma nova conexão e garante que ela será liberada
        const connection = await db.getConnection();
        try {
            const [results] = await connection.query(sql, [...grupos, cod_tela]);
            console.log(`✅ ${results.length} permissões encontradas para ${cod_tela}.`);
            res.json(results);
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('❌ Erro ao buscar permissões:', err);
        res.status(500).json({ message: 'Erro ao buscar permissões.' });
    }
});

module.exports = Router;
