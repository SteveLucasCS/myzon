DROP DATABASE IF EXISTS myzon_db;
CREATE DATABASE myzon_db;
USE myzon_db;

CREATE TABLE products (
  item_id INT(11) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(40) NULL,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 1,
  stock_quantity INT(11) NOT NULL DEFAULT 0,
  quantity_sold INT(11) NOT NULL DEFAULT 0,
  sale_price DECIMAL(10,2) NOT NULL DEFAULT 2,
  PRIMARY KEY (item_id)
);

CREATE TABLE supervisor (
  department_id INT(11) NOT NULL AUTO_INCREMENT,
  department_name varChar(40) NULL,
  cost INT(11) NOT NULL DEFAULT 0,
  revenue INT(11) NOT NULL DEFAULT 0,
  profit INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (department_id)
);