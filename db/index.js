require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PWD,
  port: process.env.PG_PORT,
  host: process.env.PG_HOST,
  max: 2000,
});

module.exports = { pool };
