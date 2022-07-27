const { Client } = require('pg');

const db = new Client({
  user: 'kbinhnguyen',
  host: 'localhost',
  database: 'mydb',
  password: '',
  port: 1234,

});

db.connect()
  .then(() => (
    db.query(
      `CREATE TABLE characteristics (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        characteristic VARCHAR(255),
      )`,
    )
  ));

db.connect(() => {
  return new
})

module.exports = { db };
