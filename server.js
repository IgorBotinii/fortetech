const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ambiente = process.env.NODE_ENV || 'desenv';
const app = express();

app.use(cors());
app.use(express.json());

// Conexão DB
require('./config/db');

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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/login/index.html'));
});

// === SERVIDOR ===
const PORT = process.env.PORT || 3010;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em modo ${ambiente.toUpperCase()} - http://localhost:${PORT}`);
});
