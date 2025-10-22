const mysql2 = require('mysql2');
const dotenv = require('dotenv');

const ambiente = process.env.NODE_ENV || 'desenv';
dotenv.config({ path: `./config/env/.env.${ambiente}` });

const conexao = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.SENHA,
  database: process.env.DATABASE,
  port: process.env.PORTADB
});

// Testa a conexão
conexao.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
  } else {
    console.log(`✅ Conectado ao banco (${ambiente.toUpperCase()})`);
  }
});

module.exports = conexao;
