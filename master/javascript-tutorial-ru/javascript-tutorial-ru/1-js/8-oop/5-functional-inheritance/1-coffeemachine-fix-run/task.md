importance: 5

---

# Запускать только при включённой кофеварке

В коде `CoffeeMachine` сделайте так, чтобы метод `run` выводил ошибку, если кофеварка выключена.

В итоге должен работать такой код:

```js
var coffeeMachine = new CoffeeMachine(10000);
coffeeMachine.run(); // ошибка, кофеварка выключена!
```

А вот так -- всё в порядке:

```js
var coffeeMachine = new CoffeeMachine(10000);
coffeeMachine.enable();
coffeeMachine.run(); // ...Кофе готов!
```

