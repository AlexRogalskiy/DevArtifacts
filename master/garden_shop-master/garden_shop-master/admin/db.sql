CREATE DATABASE project0001 DEFAULT CHARACTER SET utf8;

USE project0001;


CREATE TABLE goods(
    `id` INT NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(50) NOT NULL,    
    `description` TEXT DEFAULT NULL,
    `price` DECIMAL(8,2) NOT NULL,
    `section` TINYINT(1) NOT NULL,
    `hit` TINYINT(1) DEFAULT 0,
    `visible` TINYINT(1) DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE = InnoDB;


CREATE TABLE imgs(
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_goods` INT NOT NULL,
    `img_path` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_goods) REFERENCES goods(id)
         ON DELETE CASCADE
) ENGINE = InnoDB;