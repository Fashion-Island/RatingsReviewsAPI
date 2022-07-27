const express = require('express');
const { db } = require('./db/index.js');

const app = express();

app.get('/reviews', (req, res) => {
  console.log('Hellooooo');
  res.end();
});

app.listen(3000, () => {
  console.log('Serving port 3000');
});
