const express = require('express');
const router = require('./routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/reviews', router);

app.listen(3000, () => {
  console.log('Serving port 3000');
});
