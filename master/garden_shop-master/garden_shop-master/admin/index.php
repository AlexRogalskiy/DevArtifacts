<?php 
session_start();

include('config.php');
include('func.inc.php');


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        # get their values
        $user = trim($_POST['user']);
        $passwd = trim($_POST['passwd']);
        
        if (validUser($user, $passwd)) {
            # set session
            $_SESSION['user'] = $user;
            header('Location: admin.php');
            exit;
        } else {
            $status = 'Неверные данные';
        }
    }

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Page</title>
    <link rel="stylesheet" href="../css/bootstrap/css/bootstrap.css">
</head>
<body>
    <div style="margin: 20px 50px; width: 300px;">
        <?php if (isset($status)) echo "<h3 class='alert'>{$status}</h3>"; ?>
        <form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
            <input type="text" name="user" placeholder="логин.."><br>
            <input type="password" name="passwd" placeholder="пароль.."><br>
            <input type="submit" value="Войти" class="btn btn-primary">
        </form>
    </div>    
</body>
</html>