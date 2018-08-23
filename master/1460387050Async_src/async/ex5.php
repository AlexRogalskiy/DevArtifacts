<?hh
use HH\Asio;

async function async_curl(int $sec) : Awaitable<string> {
    return await  HH\Asio\curl_exec("http://127.0.0.1/sleep.php?" . $sec );
}

async function example_async_curl() : Awaitable<void> {

    // асинхронный запуск необходимого кол-ва HTTP запросов
    $res1 = async_curl(1);
    $res2 = async_curl(3);

    // синхронизация ответов
    list($str1,$str2) = await  HH\Asio\v([$res1, $res2]);
    echo $str1,$str2, PHP_EOL;
}


$time = time();
\HH\Asio\join(example_async_curl());
echo time()-$time, ' sec',PHP_EOL;