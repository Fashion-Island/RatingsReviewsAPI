const { Pool } = require('pg');

const pool = new Pool({
  database: 'mydb',
  max: 20,
});

module.exports = { pool };
