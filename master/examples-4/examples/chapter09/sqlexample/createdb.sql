SET NAMES utf8;
SET CHARACTER SET utf8;

DROP TABLE employees;
DROP TABLE departments;

CREATE TABLE employees(id integer primary key auto_increment, lastname varchar(255), firstname varchar(255), department integer) CHARACTER SET utf8;
CREATE TABLE departments (id integer primary key auto_increment, name varchar(255)) CHARACTER SET utf8;

INSERT INTO departments (name) VALUES ("Management");
INSERT INTO departments (name) VALUES ("R&D");
INSERT INTO departments (name) VALUES ("Marketing");
INSERT INTO departments (name) VALUES ("Accounting");

INSERT INTO employees (lastname, firstname, department) VALUES ("Werner", "Max", 1);
INSERT INTO employees (lastname, firstname, department) VALUES ("Lehmann", "Daniel", 2);
INSERT INTO employees (lastname, firstname, department) VALUES ("Roetzel", "David", 1);
INSERT INTO employees (lastname, firstname, department) VALUES ("Scherfgen", "David", 2);
INSERT INTO employees (lastname, firstname, department) VALUES ("Kupfer", "Andreas", 2);
INSERT INTO employees (lastname, firstname, department) VALUES ("Scheidweiler", "Najda", 2);
INSERT INTO employees (lastname, firstname, department) VALUES ("Jueppner", "Daniela", 4);
INSERT INTO employees (lastname, firstname, department) VALUES ("Hasse", "Peter", 4);
INSERT INTO employees (lastname, firstname, department) VALUES ("Siebigteroth", "Jennifer", 3);
