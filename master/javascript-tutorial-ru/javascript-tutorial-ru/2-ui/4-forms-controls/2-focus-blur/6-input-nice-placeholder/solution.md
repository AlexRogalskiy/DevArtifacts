# Вёрстка

Для вёрстки можно использовать отрицательный `margin` у текста с подсказкой.

Решение в плане вёрстки есть в решении задачи <info:task/position-text-into-input>.

# Решение

```js
placeholder.onclick = function() {
  input.focus();
}

// onfocus сработает и вызове input.focus() и при клике на input
input.onfocus = function() {
  if (placeholder.parentNode) {
    placeholder.parentNode.removeChild(placeholder);
  }
}
```

