<?php
define("DB_SERVER", "localhost");
define("DB_USER", "XXXXXXXXX");
define("DB_PASS", "XXXXXXXXX");
define("DB_NAME", "XXXXXXXXX");

/**
 * Timeout Constants - these constants refer to
 * the maximum amount of time (in minutes) after
 * their last page fresh that a user and guest
 * are still considered active visitors.
 */

define("USER_TIMEOUT", 10);
define("GUEST_TIMEOUT", 5);

/**
 * Cookie Constants - these are the parameters
 * to the setcookie function call, change them
 * if necessary to fit your website. If you need
 * help, visit www.php.net for more info.
 * <http://www.php.net/manual/en/function.setcookie.php>
 */
define("COOKIE_EXPIRE", 60*60*24*100);  //100 days by default
define("COOKIE_PATH", "/");  //Avaible in whole domain
/**
 * Email Constants - these specify what goes in
 * the from field in the emails that the script
 * sends to users, and whether to send a
 * welcome email to newly registered users.
 */
define("EMAIL_FROM_NAME", "codrops");
define("EMAIL_FROM_ADDR", "www.tympanus.net");
/**
 * This constant forces all users to have
 * lowercase usernames, capital letters are
 * converted automatically.
 */
define("ALL_LOWERCASE", false);

/**
 *For hashing purposes  
 **/
define("supersecret_hash_padding",'String used to pad out small strings for a sha1 encryption');
define("supersecret_hash_padding_2",'Other String used to pad out small strings for a sha1 encryption');

/*
 * the link on your server to the file resetpassword.php and confirm.php
 * these are gonna be used in the mail body 
 * */
define("RESETPASSWORDLINK","http://www.tympanus.net/loginsystem/resetpassword.php");
define("CONFIRMACCOUNTLINK","http://www.tympanus.net/loginsystem/php/confirm.php");
?>