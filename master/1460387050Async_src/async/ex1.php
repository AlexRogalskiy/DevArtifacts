<?php
$host = '127.0.0.1';
$port = 3306;
$user = 'akalend';
$password = '12345';

$mysqli = new mysqli($host, $user, $password, "temp");

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

$start = time();

$res = $mysqli->query('SELECT sleep(3) as sleep');

if ($res == null) {
    echo $mysqli->error, PHP_EOL;
}

$row = $res->fetch_assoc();

$res = $mysqli->query('SELECT sleep(1) as sleep');

if ($res == null) {
    echo $mysqli->error, PHP_EOL;
}

$row = $res->fetch_assoc();

$mysqli->close();

echo 'time ', ( time() - $start ), ' sec'  , PHP_EOL;