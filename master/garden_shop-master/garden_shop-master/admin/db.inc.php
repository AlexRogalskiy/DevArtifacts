<?php    
    defined('DB_HOST') ? NULL : define('DB_HOST', 'localhost'); 
    defined('DB_LOGIN') ? NULL : define('DB_LOGIN', 'root'); 
    defined('DB_PASSWD') ? NULL : define('DB_PASSWD', ''); 
    defined('DB_NAME') ? NULL : define('DB_NAME', 'project0001');  
    
    defined('UPLOAD_DIR') ? NULL : define('UPLOAD_DIR', "C:\wamp\www\project0001_garden_01_10_13\img\uploads\\");                              

    # db connection
    $link = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWD, DB_NAME) or die(mysqli_connect_error());