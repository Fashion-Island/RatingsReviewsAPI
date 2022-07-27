const express = require('express');
// const { db } = require('./db/index.js');

const app = express();

const { Client } = require('pg');

const db = new Client({
  user: 'kbinhnguyen',
  host: 'localhost',
  database: 'mydb',
  password: '',
  port: 3000,

});

// db.connect()
//   .then(() => (
//     db.query(
//       `CREATE TABLE characteristics (
//         id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//         characteristic VARCHAR(255),
//       )`,
//     )
//   ));

// app.get('/reviews', (req, res) =>
// // { console.log('hello'); });
//   (db.query('SELECT * FROM characteristics')
//     // .then(() => (client.query('SELECT * FROM characteristics')))
//     .then(() => { console.log('I got to here'); })
//     .then(() => { res.end(); })
// ));

app.get('/reviews', (req, res) => {
  console.log('b');
  return db.connect()
    .then(() => {
      console.log('a');
      return db.query(
        `CREATE TABLE characteristics (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          characteristic VARCHAR(255),
        )`,
      )
      })
    .then(() => (
      db.query('SELECT * FROM characteristics')
      // .then(() => (client.query('SELECT * FROM characteristics')))
    ))
    .then(() => { console.log('I got to here'); })
    .then(() => { res.end(); });
    });

app.listen(3000, () => {
  console.log('Serving port 3000');
});
