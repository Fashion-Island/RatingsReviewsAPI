require('dotenv').config();

const express = require('express');
const router = require('./routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('server/static'));
app.use('/reviews', router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Serving port ${process.env.SERVER_PORT}`);
});
