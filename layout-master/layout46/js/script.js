const range = document.querySelector('#range');
const rangeTrack = document.querySelector('#rangeTrack');
const value = document.querySelector('.ui-value');
const num1 = document.querySelector('#num1');
const num2 = document.querySelector('#num2');
const ticks = document.querySelectorAll('.ui-range-tick');
const docStyle = document.documentElement.style;

const { fromEvent, interval } = Rx.Observable;

const clamp = (min, max) => val => Math.min(Math.max(val, min), max);

const lerp = (curr, next) => {
  const delta = (next - curr);
  if (Math.abs(delta) < 0.01) return curr;
  return curr + (next - curr) * 0.13;
};

const touch$ = fromEvent(range, 'input');

const touchEnd$ = fromEvent(range, 'mouseup')
  .merge(fromEvent(range, 'touchend'))
  .mapTo(false);

const change$ = touch$
  .mapTo(true)
  .merge(touchEnd$)
  .distinctUntilChanged();
  
const num$ = touch$
  .map(e => +e.target.value)
  .distinctUntilChanged()
  .startWith(6);

const af$ = interval(0, Rx.Scheduler.animationFrame);

const smoothNum$ = af$
  .withLatestFrom(num$, (_, num) => num)
  .scan(lerp)
  .distinctUntilChanged();

const progress$ = smoothNum$
  .map(num => num - Math.floor(num));

smoothNum$.subscribe(num => {
  num1.innerHTML = Math.floor(num);
  num2.innerHTML = Math.ceil(num);
  docStyle.setProperty('--value', num);

  Array.from(ticks).forEach((tick) => {
    const proximity = Math.min(
      Math.abs(tick.getAttribute('data-value') - num), 2);
    tick.style.setProperty('--proximity', proximity);
  });
});

progress$.subscribe(progress => {
  docStyle.setProperty('--progress', progress);
  
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    // Firefox does not support custom properties
    // inside of scale() for whatever reason
    num1.setAttribute('style', `
      transform:
        translateX(calc(${progress} * -10vh))
        scale(${1 + progress});
      opacity: ${1 - progress};

    `);
    
    num2.setAttribute('style', `
      transform:
        translateX(calc(${progress} * -10vh + 10vh))
        scale(${progress});
      opacity: ${progress};
    `);
  }
});

change$.subscribe(changing => {
  num1.parentElement.style.setProperty('--changing', +changing);
});