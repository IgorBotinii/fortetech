const express = require('express');
const mysql2 = require('mysql2');
require("dotenv").config();

const app = express();
const rotaslogin = require('./controller/funcoesLogin/rotasLogin.js');
app.use(rotaslogin);


const conexaoProducao = mysql2.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.SENHA,
    database: process.env.DATABASE,
    port: process.env.PORTADB 
});


const PORT = 3010;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

module.exports = conexaoProducao;