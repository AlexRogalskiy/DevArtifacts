<?php
require_once("core.php");

if(isset($_POST['registeractionx'])||isset($_POST['loginaction'])||isset($_POST['forgetpasswordaction'])||isset($_POST['resetpasswordaction'])){
	$objCore = new Core();
	$objCore->initSessionInfo();
	$objCore->initFormController();
	$objCore->initMailerService();
	$objCore->dispatchAction();
	unset($objCore);
}
else if(isset($_GET['logoutaction'])){
	$objCore = new Core();
	$objCore->initSessionInfo();
	$objCore->dispatchAction();
	unset($objCore);
}
else{
	header("Location: ../public_html/index.php");
}
?>