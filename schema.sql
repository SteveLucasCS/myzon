DROP DATABASE IF EXISTS myzon_db;
CREATE DATABASE myzon_db;
USE myzon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;