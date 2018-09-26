Метод `getDay()` позволяет получить номер дня недели, начиная с воскресенья.

Запишем имена дней недели в массив, чтобы можно было их достать по номеру:

```js run
function getWeekDay(date) {
  var days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  return days[date.getDay()];
}

var date = new Date(2014, 0, 3); // 3 января 2014
alert( getWeekDay(date) ); // 'пт'
```

В современных браузерах можно использовать и `toLocaleString`:
```js run
var date = new Date(2014, 0, 3); // 3 января 2014
alert( date.toLocaleString('ru', {weekday: 'short'}) ); // 'Пт'
```
