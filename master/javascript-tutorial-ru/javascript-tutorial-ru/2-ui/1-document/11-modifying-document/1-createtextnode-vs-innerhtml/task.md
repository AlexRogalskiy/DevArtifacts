importance: 5

---

# createTextNode vs innerHTML

Есть *пустой* узел DOM `elem`.

**Одинаковый ли результат дадут эти скрипты?**

Первый:

```js
elem.appendChild(document.createTextNode(text));
```

Второй:

```js
elem.innerHTML = text;
```

Если нет -- дайте пример значения `text`, для которого результат разный.