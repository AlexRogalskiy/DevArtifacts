Метод `arr.reduce` подходит здесь идеально. Достаточно пройтись по массиву слева-направа, накапливая текущую сумму в переменной и, кроме того, добавляя её в результирующий массив.

Неправильный вариант может выглядеть так:

```js run
function getSums(arr) {
  var result = [];
  if (!arr.length) return result;

  arr.reduce(function(sum, item) {
    result.push(sum);
    return sum + item;
  });

  return result;
}

alert(getSums([1,2,3,4,5])); // результат: *!*1,3,6,10*/!*
```

Перед тем, как читать дальше, посмотрите на него внимательно. Заметили, в чём ошибка?

Если вы его запустите, то обнаружите, что результат не совсем тот. В получившемся массиве всего четыре элемента, отсутствует последняя сумма.

Это из-за того, что последняя сумма является результатом метода `reduce`, он на ней заканчивает проход и далее функцию не вызывает, поэтому она оказывается не добавленной в `result`.

Исправим это:

```js run
function getSums(arr) {
  var result = [];
  if (!arr.length) return result;

  *!*var totalSum*/!* = arr.reduce(function(sum, item) {
    result.push(sum);
    return sum + item;
  });
  *!*result.push(totalSum);*/!*

  return result;
}

alert(getSums([1,2,3,4,5])); // *!*1,3,6,10,15*/!*
alert(getSums([-2,-1,0,1])); // *!*-2,-3,-3,-2*/!*
```

