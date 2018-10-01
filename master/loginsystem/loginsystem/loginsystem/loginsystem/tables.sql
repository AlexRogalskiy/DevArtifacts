#
#  Table structure for Users table
#
DROP TABLE IF EXISTS users;

CREATE TABLE users(
		pk_user 					int unsigned not null auto_increment,
		email 						varchar(120) not null,
		flname 						varchar(100) not null,
		password 					varchar(64) not null,
		usr_signup_date 			timestamp not null default CURRENT_TIMESTAMP,
		usr_userid 					varchar(32),
		usr_confirm_hash 			varchar(255) not null,					# for the account confirmation
		usr_is_confirmed 			tinyint(1) not null default 0, 			# after confirming its set to 1
		usr_resetpassword_hash		varchar(255) not null,					# when the user resets password (forgot password)
		unique index(email),
		primary key(pk_user)
)type=innodb DEFAULT CHARACTER SET utf8	COLLATE utf8_general_ci;