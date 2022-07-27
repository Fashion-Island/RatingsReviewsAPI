// const { Client } = require('pg');

// const db = new Client({
//   database: 'mydb',
// });

// db.connect();

// db.query(
//   `CREATE TABLE IF NOT EXISTS characteristics (
//     id smallserial primary key,
//     characteristic varchar(255) not null
//   )`,
// )
//   .then(() => (
//     Promise.all(
//       [
//         db.query("INSERT INTO characteristics (characteristic) VALUES ('Size')"),
//         db.query("INSERT INTO characteristics (characteristic) VALUES ('Width')"),
//         db.query("INSERT INTO characteristics (characteristic) VALUES ('Comfort')"),
//         db.query("INSERT INTO characteristics (characteristic) VALUES ('Quality')"),
//         db.query("INSERT INTO characteristics (characteristic) VALUES ('Length')"),
//         db.query("INSERT INTO characteristics (characteristic) VALUES ('Fit')"),
//       ],
//     )

//   ))
//   .then(() => (
//     db.query(`CREATE TABLE IF NOT EXISTS review (
//       id bigserial primary key,
//       rating integer not null,
//       CHECK (rating < 6 AND rating < -1),
//       summary varchar(60) not null,
//       body text not null,
//       CHECK (char_length(body) < 1001 AND char_length(body) > 49),
//       reviewer_name varchar(255) not null,
//       email varchar(255) not null,
//       reported boolean not null DEFAULT false,
//       response text,
//       helpfulness integer not null DEFAULT 0,
//       date_created date not null,
//       recommended boolean not null DEFAULT false,
//       product_id integer not null
//     )`)
//   ))
//   .then(() => db.query(`CREATE TABLE IF NOT EXISTS photo (
//     id bigserial primary key,
//     url varchar(255) not null,
//     review_id integer not null references review(id)
//   )`))
//   .then(() => db.query(`CREATE TABLE IF NOT EXISTS characteristics_review (
//     id bigserial primary key,
//     review_id integer not null references review(id),
//     characteristic_id integer not null references characteristics(id),
//     characteristic_rating integer not null,
//     CHECK (characteristic_rating < 6 AND characteristic_rating < -1)
//   )`))
//   .catch((e) => console.error(e.stack))
//   .then(() => db.end());

// module.exports = { db };
