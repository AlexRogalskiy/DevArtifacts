var pathEl = document.querySelector('.curve');
var presetsEls = document.querySelectorAll('.options button');
var ratio = window.innerWidth >= 980 ? 2 : 1;

var timeline = anime.timeline({
  loop: true
});

function animateProgress(easingName) {

  timeline.pause();

  timeline = anime.timeline({
    loop: true
  });

  timeline.add([
    {
      targets: '.axis.x',
      opacity: [
        { value: [0, 1], delay: 0, duration: 500 },
        { value: 0, delay: 1500, duration: 500 }
      ],
      translateX: { value: [0, (200 * ratio)], delay: 500, duration: 1500 },
      easing: 'linear',
      offset: 0
    }, {
      targets: '.axis.y',
      opacity: [
        { value: [0, 1], delay: 0, duration: 500 },
        { value: 0, delay: 1500, duration: 500 }
      ],
      translateY: { value: [0, -(200 * ratio)], delay: 500, duration: 1500, easing: easingName },
      easing: 'linear',
      offset: 0
    }, {
      targets: '.ball',
      translateY: { value: [100, 0], delay: 500, duration: 1500, easing: easingName },
      scale: [
        { value: [0, 1], delay: 0, duration: 500, easing: 'easeOutBack' },
        { value: 0, delay: 1500, duration: 500, easing: 'easeInBack' }
      ],
      offset: 0
    }
  ]);

}

function convertCoordinates(coords) {
  var x1 = coords[0] * 100;
  var y1 = 100 - (coords[1] * 100);
  var x2 = coords[2] * 100;
  var y2 = 100 - (coords[3] * 100);
  return 'M0 100C' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' 100 0';
}

function getCoordinates(value) {
  return convertCoordinates(value.split(','));
}

function changeEase(event) {
  for (var i = 0; i < presetsEls.length; i++) {
    presetsEls[i].classList.remove('active');
  }
  var buttonEl = event.target;
  var value = buttonEl.value;
  var name = buttonEl.name;
  buttonEl.classList.add('active');
  var coordinates = getCoordinates(value);
  animateProgress(name);
  anime.remove(pathEl);
  anime({
    targets: pathEl,
    d: coordinates
  });
}

for (var i = 0; i < presetsEls.length; i++) {
  presetsEls[i].onclick = changeEase;
}

presetsEls[0].click();

pathEl.setAttribute('d', getCoordinates(presetsEls[0].value));
