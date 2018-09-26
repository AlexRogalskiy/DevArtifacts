importance: 5

---

# Алгоритм для поиска

Есть объекты:

```js
var head = {
  glasses: 1
};

var table = {
  pen: 3
};

var bed = {
  sheet: 1,
  pillow: 2
};

var pockets = {
  money: 2000
};
```

Задание состоит из двух частей:

1. Присвойте объектам ссылки `__proto__` так, чтобы любой поиск чего-либо шёл по алгоритму `pockets -> bed -> table -> head`.

    То есть `pockets.pen == 3`, `bed.glasses == 1`, но `table.money == undefined`.
2. После этого ответьте на вопрос, как быстрее искать `glasses`: обращением к `pockets.glasses` или `head.glasses`? Попробуйте протестировать.

