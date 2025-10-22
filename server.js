const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const ambiente = process.env.NODE_ENV || 'desenv';

const app = express();
app.use(cors());
app.use(express.json());

require('./config/db');

const rotasLogin = require('./controller/funcoesLogin/rotasLogin');
app.use('/', rotasLogin);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view/login/index.html'));
});

const PORT = process.env.PORT || 3010;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em modo ${ambiente.toUpperCase()} - http://localhost:${PORT}`);
});
