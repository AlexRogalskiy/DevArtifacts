Вначале нерабочие способы, которые могут прийти на ум:

```js no-beautify
if (!elem) { .. }
```

Это не работает, так как `elem` всегда есть, и является объектом. Так что проверка `if (elem)` всегда верна, вне зависимости от того, есть ли у `elem` потомки.

```js no-beautify
if (!elem.childNodes) { ... }
```

Тоже не работает, так как псевдо-массив `childNodes` всегда существует. Он может быть пуст или непуст, но он всегда является объектом, так что проверка `if (elem.childNodes)` всегда верна.

Несколько рабочих способов:

```js no-beautify
if (!elem.childNodes.length) { ... }

if (!elem.firstChild) { ... }

if (!elem.lastChild) { ... }
```

Также существует метод [hasChildNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node.hasChildNodes), который позволяет вызовом `elem.hasChildNodes()` определить наличие детей. Он работает так же, как проверка `elem.childNodes.length != 0`.