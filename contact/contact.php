<?php
if (isset($_POST["send"])) {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $subject = $_POST["subject"];
  $body = $_POST["body"];
  $errors = array();
  
  $email_matcher = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*" .
  "@" .
  "[a-z0-9-]+" .
  "(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/";
  
  if (preg_match($email_matcher, $email) == 0) {
    array_push($errors, "You did not enter a valid email address");
  }
  if (count($errors) == 0) {
    $to = "test@test.com"; // your email
    $subject = "[Generated from test.com] " . $subject;
    
    $from = $name . " <" . $email . ">";
    $headers = "From: " . $from;
    
    if (!mail($to, $subject, $body, $headers)) {
      array_push($errors, "Mail failed to send.");
    }
  }
}
?>

<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Contacts Demo</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta charset="UTF-8" />
        <meta name="description" content="TEST API" />
        <meta name="keywords" content="TEST,API" />
        <meta name="author" content="Alexander R." />
        <meta name="theme-color" content="#000000" />
        <meta name="copyright" content="Alexander R." />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#000000" />
        <meta name="apple-mobile-web-app-title" content="TEST API" />
        <meta name="msapplication-TileImage" content="/images/icons/144x144.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

        <style type="text/css">
          body {
            font-size: 12px;
            font-family: Verdana;
          }
        
          #contact-form {
            width: 320px;
          }
        
          #contact-form label {
            display: block;
            margin: 10px 0px;
          }
        
          #contact-form input, #contact-form textarea {
            padding: 4px;
          }
        
          #contact-form .full-width {
            width: 100%;
          }
        
          #contact-form textarea {
            height: 100px;
          }
          .errors h3, .errors li {
            color: #FF0000;
          }
        
          .errors li {
            margin: 5px 0px;
          }
        </style>
    </head>
<!--  header -->
<body>
    <h2>Contact Us</h2>
    <p>
      Please fill out this quick form to send us an email. We are excited 
      to hear from you!
    </p>
  
    <form id="contact-form" action="contact.php" method="post">
      <?php if (count($errors) > 0) : ?>
        <h3>There were errors that prevented the email from sending</h3>

        <ul class="errors">
          <?php foreach($errors as $error) : ?>
            <li><?php echo $error; ?></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    
      <label for="name">Name</label>
      <input class="full-width" type="text" name="name" />
    
      <label for="email">Your Email</label>
      <input class="full-width" type="text" name="email" />
    
      <label for="subject">Subject</label>
      <input class="full-width" type="text" name="subject" 
             value="Web Consulting Inquiry" />
      <label for="body">Body</label>
      <textarea class="full-width" name="body"></textarea>
      
      <input type="submit" name="send" value="Send" />
    </form>
</body>
<!--  footer -->
</html>