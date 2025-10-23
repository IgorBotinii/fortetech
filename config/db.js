const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({ path: `./config/env/.env.${process.env.NODE_ENV}` });

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.SENHA,
  database: process.env.DATABASE,
  port: process.env.PORTADB,
  waitForConnections: true,
  connectionLimit: 10, // controla quantas conexões simultâneas
  queueLimit: 0
});

module.exports = pool.promise();
