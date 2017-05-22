/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# schema
CREATE SCHEMA IF NOT EXISTS `restful_api_demo` DEFAULT CHARACTER SET latin1 ;
USE `restful_api_demo` ;

# table user_tokens
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS  `restful_api_demo`.`user_tokens` (
  `user_info_id` int(70) NOT NULL AUTO_INCREMENT,
  `user_id_fk` int(70) NOT NULL,
  `token` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`user_info_id`),
  UNIQUE KEY `user_id_fk_UNIQUE` (`user_id_fk`),
  CONSTRAINT `user_info_foreign_key` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user_tokens` WRITE;
/*!40000 ALTER TABLE `user_tokens` DISABLE KEYS */;

INSERT INTO `user_tokens` (`user_info_id`, `user_id_fk`, `token`)
VALUES (1,1,'123456789');

/*!40000 ALTER TABLE `user_tokens` ENABLE KEYS */;
UNLOCK TABLES;


# table users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS  `restful_api_demo`.`users` (
  `id` int(70) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL DEFAULT '',
  `password` varchar(45) DEFAULT NULL,
  `join_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `email`, `password`, `join_date`)
VALUES (1,'jeremy@example.com','941f8c79b34be1dba86024719b47718e','2000-01-01 00:00:01');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
