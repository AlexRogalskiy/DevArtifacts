importance: 5

---

# Слайдер с событиями

На основе слайдера из задачи <info:task/slider-widget> создайте графический компонент, который умеет возвращать/получать значение.

Синтаксис:

```js
var slider = new Slider({
  elem: document.getElementById('slider'),
  max: 100 // слайдер на самой правой позиции соответствует 100
});
```

Метод `setValue` устанавливает значение:

```js
slider.setValue(50);
```

У слайдера должно быть два события: `slide` при каждом передвижении и `change` при отпускании мыши (установке значения).

Пример использования:

```js
var sliderElem = document.getElementById('slider');

sliderElem.addEventListener('slide', function(event) {
  document.getElementById('slide').innerHTML = event.detail;
});

sliderElem.addEventListener('change', function(event) {
  document.getElementById('change').innerHTML = event.detail;
});
```

В действии:

[iframe src="solution" height="80"]

- Ширина/высота слайдера может быть любой, JS-код это должен учитывать.
- Центр бегунка должен располагаться в точности над выбранным значением. Например, он должен быть в центре для 50 при `max=100`.

Исходный документ -- возьмите решение задачи <info:task/slider-widget>.