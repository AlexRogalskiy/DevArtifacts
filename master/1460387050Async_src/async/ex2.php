<?php
$hosts = array_fill( 0, 2, '127.0.0.1');

$port = 3306;
$user = 'akalend';
$password = '12345';

$mysqli = [];
$queryes = [];
$sleep = [3, 1];

$sleep_value = current($sleep);
foreach( $hosts as $host) {

    $mysqli[] = $mysql_i = new mysqli($host, $user, $password, "temp");
    /* check connection */
    if ($mysql_i->connect_errno) {
        printf("Connect failed: %s\n", $mysql_i->connect_error);
        exit();
    }

    // формируем запрос
    $queryes[] = "SELECT sleep($sleep_value) as sleep";
    $sleep_value =  next($sleep);
}

$start = time();


reset($queryes);
$query = current($queryes);
foreach ($mysqli as  $link) {
    // выполняем запрос
    $link->query($query, MYSQLI_ASYNC);
    $query = next($queryes);
}

// событийный цикл,
$processed = 0;
do {

    $links = $errors = $reject = [];
    foreach ($mysqli as $mysql) {
        $links[] = $errors[] = $reject[] = $mysql;
    }

    # опрашиваем все коннекции на наличие ответа
    if (!mysqli_poll($links, $errors, $reject, 60)) {
        continue;
    }
    foreach ($links as $k=>$link) {
        # получаем ответ из асинхронного  запроса
        if ($result = $link->reap_async_query()) {
            $res = $result->fetch_row();
            # Handle returned result
            echo 'get result link #',$k,PHP_EOL;
            var_dump( $res);
            mysqli_free_result($result);
        } else die(sprintf("MySQLi Error: %s", mysqli_error($link)));
        $processed++;
    }
} while ($processed < count($mysqli));

echo 'time ', ( time() - $start ), ' sec'  , PHP_EOL;