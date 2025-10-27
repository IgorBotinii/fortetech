const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// === Detecta o ambiente corretamente ===
const ambiente = process.env.NODE_ENV;
const envPath = path.resolve(__dirname, `./config/.env.${ambiente}`);
dotenv.config({ path: envPath });

console.log(`🧩 Ambiente detectado: ${ambiente}`);
console.log(`🧩 Arquivo .env carregado: ${envPath}`);

const app = express();
app.use(cors());
app.use(express.json());

// === Conexão DB ===
require('./config/db.js');

// === AUTOLOAD DE ROTAS (recursivo) ===
const rotasDir = path.join(__dirname, 'controller');
function carregarRotas(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((item) => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      carregarRotas(fullPath); // busca nas subpastas
    } else if (item.isFile() && item.name.endsWith('.js')) {
      try {
        const rota = require(fullPath);
        app.use('/', rota);
        console.log(`✅ Rota carregada: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Erro ao carregar rota ${fullPath}:`, err.message);
      }
    }
  });
}

// Executa o autocarregamento
carregarRotas(rotasDir);


// === FRONT-END LOGIN ===
app.use(express.static(path.join(__dirname, 'public')));
app.use('/view', express.static(path.join(__dirname, 'view')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/login/index.html'));
});

// === SERVIDOR ===
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em modo ${ambiente} - http://localhost:${PORT}`);
});
