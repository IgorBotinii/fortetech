const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// === Detecta o ambiente corretamente ===
const ambiente = process.env.NODE_ENV || 'producao';
const envPath = path.resolve(__dirname, `./config/.env.${ambiente}`);
dotenv.config({ path: envPath });

console.log(`🧩 Ambiente detectado: ${ambiente}`);
console.log(`🧩 Arquivo .env carregado: ${envPath}`);

const app = express();
app.use(cors());
app.use(express.json());

// === Conexão DB ===
require('./config/db.js');

// === AUTOLOAD DE ROTAS ===
const rotasDir = path.join(__dirname, 'controller');
fs.readdirSync(rotasDir).forEach(pasta => {
  const subpasta = path.join(rotasDir, pasta);
  if (fs.lstatSync(subpasta).isDirectory()) {
    fs.readdirSync(subpasta).forEach(arquivo => {
      if (arquivo.startsWith('rotas') && arquivo.endsWith('.js')) {
        const rota = require(path.join(subpasta, arquivo));
        app.use('/', rota);
        console.log(`✅ Rota carregada: ${arquivo}`);
      }
    });
  }
});

// === FRONT-END LOGIN ===
app.use(express.static(path.join(__dirname, 'public')));
app.use('/view', express.static(path.join(__dirname, 'view')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/login/index.html'));
});

// === SERVIDOR ===
const PORT = process.env.PORT || 3020;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em modo ${ambiente.toUpperCase()} - http://localhost:${PORT}`);
});
