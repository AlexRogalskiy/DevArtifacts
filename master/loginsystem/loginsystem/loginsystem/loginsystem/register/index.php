<?php
require_once("../php/core.php");

// Include the random string file
require_once '../php/captcha/rand.php';

$objCore = new Core();
$objCore->initSessionInfo();

// Set the session contents
$_SESSION['captcha_id'] = $str;

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN">
<html>
    <head>
        <title>PHP Login System</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <link rel="stylesheet" type="text/css" href="../css/style.css" />
            <script type="text/javascript" language="javascript" src="../javascript/jquery-1.3.2.js"></script>
            <script type="text/javascript" language="javascript" src="../javascript/register/register.js"></script>
    </head>
    <body>
        <div id="main">
            <?php
            /**
            * The user is already logged in, not allowed to register.
            */
            if($objCore->getSessionInfo()->isLoggedIn()) {
            echo "<h1>Registered</h1>";
            echo "<p>We're sorry <b>$session->username</b>, but you've already registered. "
                ."<a href=\"../public_html/\">Main</a>.</p>";
            }
            else {
            ?>
            <div id="reg" class="register">
                <h1>Registration</h1>
                <form name="form_register" id="form_register" action="" method="">
                    <fieldset>
                        <legend>Account Details</legend>
                        <label>First and last name</label>
                        <input type="text" class="inplaceError" id="flname" name="flname" maxlength="100" value=""/>
                        <div class="error" id="flname_error"></div>
                        <label>E-Mail</label>
                        <input type="text" class="inplaceError" id="email" name="email" maxlength="120" value=""/>
                        <div class="error" id="email_error"></div>
                        <label>Password</label>
                        <input type="password" class="inplaceError" id="pass" name="pass" maxlength="20" value=""/>
                        <div class="error" id="pass_error"></div>
                    </fieldset>
                    <fieldset>
                        <legend>Verification</legend>
                        <p>Click image to refresh</p>
                        <div id="captchaimage">
                            <a href="" name="_img_captcha" name="_img_captcha" id="_img_captcha" onclick="CaptchaImage.refreshimg(); return false;" title="Click to refresh image">
                                <img src="../images/captcha/image.jpg?<?php echo time(); ?>" width="111" height="46" alt="Captcha image" />
                            </a>
                        </div>
                        <p>Enter characters shown on picture:</p>
                        <input style="width:111px;" class="inplaceError" type="text" maxlength="6" name="captcha" id="captcha" />
                        <div class="error_captcha" id="captcha_error"></div>
                    </fieldset>
                    <input type="hidden" name="registeractionx" value="1"/>
		      <a href="../public_html">Back</a>
                    <a id="_register_btt" class="button">Register</a>
                    <img class="ajaxload" style="display:none;" id="ajaxld" src="../images/ajax-loader.gif"/>
                </form>
            </div>

        </div>

        <?php
        }
        unset($objCore);
        ?>

    </body>
</html>
