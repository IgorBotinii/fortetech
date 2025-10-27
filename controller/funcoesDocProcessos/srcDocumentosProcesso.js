const express = require('express');
const Router = express.Router();
const db = require('../../config/db'); // Pool de conexões com promessa

// === Trazer informações dos documentos dos processos ===
Router.get('/InfoDocumentosProcessos', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { processo_responsavel } = req.query;

  // 1️⃣ Validação do parâmetro
  if (!processo_responsavel) {
    return res.status(400).json({ sucesso: false, mensagem: "processo_responsavel é obrigatório" });
  }

  console.log("🔍 Buscando documentos do processo:", processo_responsavel);

  const sql = `
    SELECT id, nome_documento, revisao, tipo_documento, link_acesso, processo_responsavel
    FROM ct_documentos_processo
    WHERE processo_responsavel = ?
    ORDER BY nome_documento ASC
  `;

  try {
    const [results] = await db.query(sql, [processo_responsavel]);

    if (!results || results.length === 0) {
      return res.json({ sucesso: true, dados: [] });
    }

    console.log(`✅ ${results.length} documentos encontrados.`);
    return res.json({ sucesso: true, dados: results });
  } catch (err) {
    console.error("❌ Erro MySQL:", err);
    return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar os dados", erro: err.message });
  }
});

module.exports = Router;
