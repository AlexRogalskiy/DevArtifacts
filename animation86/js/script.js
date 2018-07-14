const wrapperEl = document.querySelector('.wrapper');
const numberOfEls = 360;
const delay = 10;

function createEl(i) {
  const el = document.createElement('div');
  el.classList.add('el');
  el.style.backgroundColor = 'hsl('+ (Math.round(i / 3)) +', 50%, 50%)';
  wrapperEl.appendChild(el);
}

for (let i = 0; i < numberOfEls; i++) createEl(i);

anime({
  targets: '.el',
  opacity: [
    { value: [0, .5], duration: 250, easing: 'linear' }
  ],
  rotate: [
    { value: (el, i) => 90 + (i * 2), duration: 2000 }
  ],
  scale: [
    { value: [1, 0], duration: 2000, delay: (el, i) => 4000 + (i * delay) }
  ],
  delay: (el, i) => i * delay,
  easing: 'easeOutElastic',
  loop: true,
});