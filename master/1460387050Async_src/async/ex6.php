<?hh

use HH\Asio;

function get_mcrouter_object(): \MCRouter {
    $servers = Vector { '127.0.0.1:11211' };
  $mc = MCRouter::createSimple($servers);
  return $mc;
}

async function add_user_name(
    \MCRouter $mcr,
    int $id,
    string $value): Awaitable<void> {
    $key = 'name:' . $id;
    await $mcr->set($key, $value);
}

async function get_user_name(\MCRouter $mcr, int $user_id): Awaitable<string> {
    $key = 'name:' . $user_id;
    try {
        $res = await \HH\Asio\wrap($mcr->get($key));
        if ($res->isSucceeded()) {
            return $res->getResult();
        }
        return "";
    } catch (\MCRouterException $ex) {
        echo $ex->getKey() . PHP_EOL . $ex->getOp();
        return "";
    }
}

async function run(): Awaitable<void> {
    $mcr = get_mcrouter_object();
    await add_user_name($mcr, 1, "Вася Пупкин");
    $name = await get_user_name($mcr, 1);
  var_dump($name); // выведет "Вася Пупкин"
}

\HH\Asio\join(run());