<?hh
// объявляем асинхронную функцию
async function async_mysql() : Awaitable<void> {

    $pool = new \AsyncMysqlConnectionPool([]);

    $host = '127.0.0.1';
    $port = 3306;
    $db = 'temp';
    $user = 'akalend';
    $password = '12345';

    //осуществляем соединение
    $conn1 = await $pool->connect(
        $host,
        $port,
        $db,
        $user,
        $password
  );
    $conn2 = await $pool->connect(
        $host,
        $port,
        $db,
        $user,
        $password
  );

    // выполняем два асинхронных запроса
    $res_pool = await \HH\Asio\v([
        $conn1->query('SELECT sleep(1) as sleep1'),
        $conn2->query('SELECT sleep(3) as sleep2'),
    ]);

    // получение результата
    var_dump($res_pool[0]->mapRows(), $res_pool[1]->mapRows());

    $conn1->close();
    $conn2->close();
}

$time = time();
\HH\Asio\join(async_mysql());
echo time()-$time, ' sec',PHP_EOL;