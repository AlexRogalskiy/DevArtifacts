importance: 5

---

# Инкремент, порядок срабатывания

Посмотрите, понятно ли вам, почему код ниже работает именно так?

```js run no-beautify
var a = 1, b = 1, c, d;

c = ++a; alert(c); // 2
d = b++; alert(d); // 1

c = (2+ ++a); alert(c); // 5
d = (2+ b++); alert(d); // 4

alert(a); // 3
alert(b); // 3
```

