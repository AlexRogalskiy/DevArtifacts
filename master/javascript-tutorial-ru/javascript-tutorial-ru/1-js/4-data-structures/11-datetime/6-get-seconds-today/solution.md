Для вывода достаточно сгенерировать объект `Date`, соответствующий началу дня, т.е. "сегодня" 00 часов 00 минут 00 секунд, и вычесть его из текущей даты.

Полученная разница -- это как раз количество миллисекунд от начала дня, которое достаточно поделить на `1000`, чтобы получить секунды:

```js run
function getSecondsToday() {
  var now = new Date();

  // создать объект из текущей даты, без часов-минут-секунд
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var diff = now - today; // разница в миллисекундах
  return Math.floor(diff / 1000); // перевести в секунды
}

alert( getSecondsToday() );
```

Альтернативное решение -- получить часы/минуты/секунды и преобразовать их все в секунды:

```js run
function getSecondsToday() {
  var d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
};
```
