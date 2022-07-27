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