DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb;

\c mydb;

CREATE TABLE IF NOT EXISTS reviews (
  id bigserial primary key,
  product_id bigint not null,
  rating integer not null,
  CHECK (rating < 6 AND rating > -1),
  date bigint not null,
  summary varchar(255) not null,
  body text not null,
  -- CHECK (char_length(body) < 1001 AND char_length(body) > 49),
  recommended boolean not null DEFAULT false,
  reported boolean not null DEFAULT false,
  reviewer_name varchar(255) not null,
  reviewer_email varchar(255) not null,
  response text,
  helpfulness integer not null DEFAULT 0
);
-- NOTE that date in reviews will be stored as BIGINT and converted to timestamp only upon responding to a GET request

CREATE TABLE IF NOT EXISTS photos (
  id bigserial primary key,
  review_id bigint not null references reviews(id),
  url text not null
);

CREATE TABLE characteristics (
  id bigserial primary key,
  product_id bigint not null,
  name varchar(50) not null
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id bigserial primary key,
  characteristic_id bigint not null references characteristics(id),
  review_id bigint not null references reviews(id),
  value integer not null,
  CHECK (value < 6 AND value > -1)
);

\copy reviews (id, product_id, rating, date, summary, body, recommended, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './db/rawdata/reviews.csv' WITH (FORMAT csv, HEADER true);
\copy characteristics (id, product_id, name) FROM './db/rawdata/characteristics.csv' WITH (FORMAT csv, HEADER true);
\copy photos (id, review_id, url) FROM './db/rawdata/reviews_photos.csv' WITH (FORMAT csv, HEADER true);
\copy characteristic_reviews (id, characteristic_id, review_id, value) FROM './db/rawdata/characteristic_reviews.csv' WITH (FORMAT csv, HEADER true);

-- Old data that is copied over has "null" as a string stored as opposed to null as a data type
UPDATE reviews SET response = NULL WHERE response = 'null';

-- Reset sequences that are out of sync due to overwriting columns of the serial data type
SELECT setval(pg_get_serial_sequence('characteristics', 'id'), coalesce(max(id)+1, 1), false) FROM characteristics;
SELECT setval(pg_get_serial_sequence('characteristic_reviews', 'id'), coalesce(max(id)+1, 1), false) FROM characteristic_reviews;
SELECT setval(pg_get_serial_sequence('photos', 'id'), coalesce(max(id)+1, 1), false) FROM photos;
SELECT setval(pg_get_serial_sequence('reviews', 'id'), coalesce(max(id)+1, 1), false) FROM reviews;


CREATE INDEX charIndOnCharRev ON characteristic_reviews (characteristic_id);
CREATE INDEX prodIndOnChar ON characteristics (product_id);
CREATE INDEX prodIndOnRev ON reviews (product_id);
CREATE INDEX revIndOnPhotos ON photos (review_id);