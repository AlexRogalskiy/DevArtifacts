const el = document.querySelector('div');
const tl = new TimelineMax({ repeat: -1, yoyo: true, onUpdate: updateRoot });
const cs = getComputedStyle(el, null);

const grow = { value: '1vmin' };
const color = { value: 0 };

tl.to(grow, 2, { value: "5vmin", ease: Sine.easeInOut }, 0);
tl.to(color, 2, { value: 40, ease: Sine.easeInOut }, 0);

function updateRoot() {
  el.style.setProperty("--circle-size", grow.value);
  el.style.setProperty("--circle-color", color.value);
}