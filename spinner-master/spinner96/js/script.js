/*
  inspired by 
  https://codepen.io/winkerVSbecks/pen/JNNjBQ
*/ 

const circles = document.querySelectorAll(".circle");
const wrapper = document.querySelector(".wrapper");
const sine = Sine.easeInOut;
const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

/* Animation */
TweenMax.set(circles, { drawSVG: "35% 35%" });

const tl = new TimelineMax({ repeat: -1, repeatDelay: -0.13 });

tl.staggerTo(circles, 0.8, { drawSVG: "5% 95%", ease: sine }, 0.25, 0);
tl.staggerTo(circles, 0.6, { drawSVG: "75% 75%", ease: sine }, 0.25, 0.8);


/* Reactive Stuff */
const mouse$ = Rx.Observable.fromEvent(document, 'mousemove')
  .map(({ clientX, clientY }) => ({ x: clientX, y: clientY }));

const animationFrame$ = Rx.Observable.interval(0, Rx.Scheduler.animationFrame);

const smoothMouse$ = animationFrame$
  .withLatestFrom(mouse$, (tick, move) => move)
  .scan(lerp);

const c1$ = smoothMouse$.map(moveO(0)).map(toAbsolute);
const c2$ = smoothMouse$.map(moveO(0.2)).map(toAbsolute);
const c3$ = smoothMouse$.map(moveO(0.4)).map(toAbsolute);
const c4$ = smoothMouse$.map(moveO(0.6)).map(toAbsolute);
const c5$ = smoothMouse$.map(moveO(0.8)).map(toAbsolute);
const c6$ = smoothMouse$.map(moveO(1)).map(toAbsolute);

const style$ = RxCSS({ 
  c1: c1$, c2: c2$, c3: c3$, c4: c4$, c5: c5$, c6: c6$,
}, wrapper);


function toAbsolute({ x, y }) {
  return {
    x: `calc(0% + ${x}px)`,
    y: `calc(0% + ${y}px)`,
  };
}

function moveO(amplitude) {
  return m => ({
    x: mapValues(m.x, 0, w, -amplitude * 16, amplitude * 16),
    y: mapValues(m.y, 0, h, -amplitude * 16, amplitude * 16),
  })
}

function mapValues(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function lerp(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: start.x + dx * 0.1,
    y: start.y + dy * 0.1,
  };
}