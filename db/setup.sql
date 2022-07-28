/*
To run this file, in the command line: run `psql postgres -f ./db/setup.sql`
*/

\c mydb;

INSERT INTO characteristics (characteristic) VALUES ('Size');
INSERT INTO characteristics (characteristic) VALUES ('Width');
INSERT INTO characteristics (characteristic) VALUES ('Comfort');
INSERT INTO characteristics (characteristic) VALUES ('Quality');
INSERT INTO characteristics (characteristic) VALUES ('Length');
INSERT INTO characteristics (characteristic) VALUES ('Fit');

CREATE TEMPORARY TABLE reviews_raw (
  id integer primary key,
  product_id integer not null,
  rating integer not null,
  CHECK (rating < 6 AND rating > -1),
  date varchar(255) not null,
  summary varchar(255) not null,
  body text not null,
  recommended boolean not null,
  reported boolean not null,
  reviewer_name varchar(255) not null,
  reviewer_email varchar(255) not null,
  response text,
  helpfulness integer not null
);

\copy reviews_raw (id, product_id, rating, date, summary, body, recommended, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './db/rawdata/reviews.csv' WITH (FORMAT csv, HEADER true);
