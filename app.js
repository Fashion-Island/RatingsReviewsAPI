const express = require('express');
const { pool } = require('./db/index.js');

const app = express();

app.get('/reviews', (req, res) => {
  // return pool.query('SELECT * FROM photos ORDER BY id LIMIT 5 OFFSET 10')
  return pool.query('SELECT * FROM photos WHERE id = 6')
    .then((result) => {
      console.log(result)
    })
    .then(() => {
      res.end();
    })
});

app.listen(3000, () => {
  console.log('Serving port 3000');
});
