/* global console */

let Ring = {};
Ring.limit = 8;
Ring.ringBox = document.querySelector('.ring-box');
Ring.wrapTpl = document.querySelector('.ring-wrap');

new Array(Ring.limit - 1).join(',').split(',').forEach(() => {
  let _clone = Ring.wrapTpl.cloneNode(true);
  Ring.ringBox.appendChild(_clone);
});

Ring.wraps = [].slice.call(document.querySelectorAll('.ring-wrap'));
Ring.rings = [].slice.call(document.querySelectorAll('.ring'));
Ring.count = Ring.wraps.length;
Ring.num = Math.PI.toString().replace('.', '').split('').map((n) => Number(n));

Ring.updateIndex = (n) => {
  let max = n || Ring.count;
  Ring.wraps.forEach((wrap, i) => {
    wrap.style.zIndex = max - Math.abs(i - ~~(max / 2));
  });
};

Ring.rings.forEach((ring, i) => {
  ring.style.transform = `rotateX(${(Ring.num[i]) * -36}deg)`;
  Ring.updateIndex();
});

Ring.update = () => {
  let idx = Number(Ring.precision.value);
  Ring.precisionWrap.setAttribute('data-precision', idx);
  Ring.updateIndex(idx);

  [].slice.call(document.querySelectorAll('.ring-wrap.is-active')).forEach((activeItem) => {
    activeItem.classList.remove('is-active');
  });

  Ring.wraps[idx - 1].classList.add('is-active');
};

Ring.precisionWrap = document.querySelector('.precision');
Ring.precision = document.getElementById('js-range');
Ring.precision.max = Ring.limit;
Ring.precision.addEventListener('input', Ring.update);

Ring.update();
