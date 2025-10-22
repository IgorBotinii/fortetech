const express = require('express');
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const ambiente = process.env.NODE_ENV || 'desenv'; // local | desenv | prod
dotenv.config({ path: `./config/env/.env.${ambiente}` });

const app = express();
app.use(cors());
app.use(express.json());

const rotasLogin = require('./controller/funcoesLogin/rotasLogin.js');
app.use(rotasLogin);

const conexao = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.SENHA,
  database: process.env.DATABASE,
  port: process.env.PORTADB
});

conexao.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
  } else {
    console.log(`✅ Conectado ao banco (${ambiente.toUpperCase()})`);
  }
});

const PORT = process.env.PORT || 3010;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em modo ${ambiente.toUpperCase()} - http://${HOST}:${PORT}`);
});

module.exports = conexao;
