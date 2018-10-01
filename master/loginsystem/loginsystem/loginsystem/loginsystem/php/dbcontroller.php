<?php
/*
** Class for connecting and manage the mysql database
*/
require_once("constants.php");
require_once("utils.php");

class DBController{
	
	private $link;
	
	public function __construct(){
		mb_internal_encoding("UTF-8");
		mb_regex_encoding("UTF-8");
		$this->link = mysqli_connect(DB_SERVER, DB_USER, DB_PASS,DB_NAME);
		if (mysqli_connect_errno()) {
		    exit();
		}
	}
	
	public function __destruct() {
		$this->disconnect();
	}
	
	/*
	 * checks if user with email "$username" and password "$password" exists
	 * */
	public function confirmUserPass($username, $password){
		//$username = mysql_real_escape_string($username);
		/* Verify that user is in database */
		$q = "SELECT password FROM users WHERE email = '$username'";
		$results = mysqli_query($this->link,$q);
		if(!$results || (mysqli_num_rows($results) < 1)){
			mysqli_free_result($results);
			return -1; //Indicates username failure
		}
		$dbarray = mysqli_fetch_array($results,MYSQLI_ASSOC);
		$dbarray['password'] = stripslashes($dbarray['password']);
		$password = stripslashes($password);
		mysqli_free_result($results);
		
		if($password == $dbarray['password']){
			return 1; //Success, Username and password confirmed
		}
		else{
			return -2; //Indicates password failure
		}
	}

   
	/**
    * confirmUserID - Checks whether or not the given
    * username is in the database, if so it checks if the
    * given userid is the same userid in the database
    * for that user. If the user doesn't exist or if the
    * userids don't match up, it returns an error code
    */
	public function confirmUserID($username, $userid){
		//$username = mysql_real_escape_string($username);

		/* Verify that user is in database */
		$q = "SELECT usr_userid FROM users WHERE email = '$username'";
		$results = mysqli_query($this->link,$q);
	  	  
		if(!$results || (mysqli_num_rows($results) < 1)){
			mysqli_free_result($results);
			return -1; //Indicates username failure
		}

		/* Retrieve userid from result, strip slashes */
		$dbarray = mysqli_fetch_array($results,MYSQLI_ASSOC);
		$dbarray['usr_userid'] = stripslashes($dbarray['usr_userid']);
		$userid = stripslashes($userid);
		mysqli_free_result($results);	
		/* Validate that userid is correct */

		if($userid == $dbarray['usr_userid']){
			return 1; //Success! Username and userid confirmed
		}
		else{
			return -2; //Indicates userid invalid
		}
   }
   
	/*
	* dbemailTaken - Returns true if the email has
	* been taken by another user, false otherwise.
	*/
	public function dbemailTaken($email){
		//$email = mysql_real_escape_string($email);
		$q = "SELECT email FROM users WHERE email = '$email'";
		$results = mysqli_query($this->link,$q);
		$numr = mysqli_num_rows($results);
		mysqli_free_result($results);	
		return ($numr > 0);
	}
   
   
	/*
	** registers a user in the system, and returns user key if successfull
	*/
	public function dbregister($email, $pass, $flname, $hash){
		
		//$email 			= mysql_real_escape_string($email);
		//$pass 			= mysql_real_escape_string($pass);
		//$flname 		= mysql_real_escape_string($flname);
		
		//############### INSERTION ###############	
		mysqli_autocommit($this->link,FALSE);
		mysqli_query($this->link,"SET NAMES 'utf8'");
		$q = "insert into users(pk_user,email,flname,password,usr_confirm_hash) values('NULL','$email','$flname','$pass','$hash')";
	    
		mysqli_query($this->link,$q);
		if(mysqli_errno($this->link)){
			mysqli_rollback($this->link);
			return -1;
		}
		else{
			mysqli_commit($this->link);
			$result = mysqli_query($this->link,'SELECT LAST_INSERT_ID() as lid');
			$obj = $result->fetch_object();
			$lastinsertedid = $obj->lid;
			$result->close();
			unset($obj);
			return $lastinsertedid;
		}
		return -1;
	}  
   

    
	/*
	 * checks if user with email "$username" did already the confirmation of the account
	 * */
    public function is_confirmed($username){
		/* Verify that user is in database */
		$q = "SELECT usr_is_confirmed FROM users WHERE email = '$username'";	  	
		$results = mysqli_query($this->link,$q);
		$dbarray = mysqli_fetch_array($results,MYSQLI_ASSOC);
		$is_confirmed = $dbarray['usr_is_confirmed'];
		mysqli_free_result($results);
		if($is_confirmed == 1){
			return 1; //Success! 
		}
		else{
			return -1; //Indicates failure
		}
	} 
   
    /*
     * checks if the resethash is associated with the email in the users table
     */
	public function dbconfirmResetPasswordHash($email,$hash){
		//$email = mysql_real_escape_string($email);
		$q = "SELECT pk_user FROM users WHERE email = '$email' and usr_resetpassword_hash = '$hash'";	
		$results = mysqli_query($this->link,$q);
		
		$numr = mysqli_num_rows($results);
		mysqli_free_result($results);	
		if($numr > 0) 
			return 1; 
		else
			return -1;
	}

	/**
    * updateUserField - Updates a field, specified by the field
    * parameter, in the user's row of the database, given the pk_user
    */
	public function updateUserField($userkey, $field, $value){
		$q = "UPDATE users SET ".$field." = '$value' WHERE pk_user = '$userkey'";	
		return mysqli_query($this->link,$q);
	}
	/**
    * updateUserFieldEmail - Updates a field, specified by the field
    * parameter, in the user's row of the database, given the email
    */
	public function updateUserFieldEmail($email, $field, $value){
		//$email = mysql_real_escape_string($email);
		$q = "UPDATE users SET ".$field." = '$value' WHERE email = '$email'";	
		return mysqli_query($this->link,$q);
	}
	
	
	
	/**
    * dbgetUserInfo - Returns the result array from a mysql
    * query asking for some data regarding
    * the given username(email). If query fails, NULL is returned.
    */
	public function dbgetUserInfo($username){
		//$username = mysql_real_escape_string($username);
		$q = "SELECT pk_user,email,usr_userid FROM users WHERE email = '$username'";		
		$results = mysqli_query($this->link,$q);
		/* Error occurred, return given name by default */
		if(!$results || (mysqli_num_rows($results) < 1)){
			mysqli_free_result($results);
			return NULL;
		}
		/* Return result array */
		$dbarray = mysqli_fetch_array($results,MYSQLI_ASSOC);
		mysqli_free_result($results);
		return $dbarray;
	}

	public function user_confirm($urlemail,$urlhash) {
		$new_hash = sha1($urlemail.supersecret_hash_padding);
		if ($new_hash && ($new_hash == $urlhash)) {
			$q = "SELECT email FROM users WHERE usr_confirm_hash = '$new_hash'";
			$results = mysqli_query($this->link,$q);
			
			if (!$results || (mysqli_num_rows($results) < 1)) {
				$feedback = 'ERROR -- Hash not found';
				mysqli_free_result($results);
				return $feedback;
			} 
			else {
			// Confirm the email and set account to active
			$email = $urlemail;
			$hash = $urlhash;

			$query = "UPDATE users SET usr_is_confirmed='1' WHERE usr_confirm_hash='$hash'";
			mysqli_query($this->link,$query);
			return 1;
			}
		} 
		else {
			$feedback = 'ERROR -- Values do not match';
			return $feedback;
		}
	}
  
	/**
    * query - Performs the given query on the database and
    * returns the result, which may be false, true or a
    * resource identifier.
    */
	public function query($query){
		return mysqli_query($this->link,$query);
	}
    
	public function disconnect(){
		mysqli_close($this->link);
	}   
    

}; 
?>
