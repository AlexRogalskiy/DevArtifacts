var square = $('#square');

var rotate = new ui.Tween({
  ease: 'backOut',
  duration: 1000,
  values: {
    scale: 0.5,
    rotate: 45,
    fill: '#fa2e94'
  }
});

var scaleUp = new ui.Tween({
  ease: 'backInOut',
  duration: 1000,
  values: {
    scale: 2,
    rotate: 110,
    fill: '#ff96cb'
  }
});

var resetProps = new ui.Tween({
  ease: 'backOut',
  duration: 1000,
  values: {
    scale: 1,
    rotate: 0,
    fill: '#000'
  }
});

var squareActor = new ui.Actor({
  element: '#square',
  values: {
    scale: 1,
    rotate: 0
  }
});

square.mouseenter(function() {
  squareActor.start(rotate).then(scaleUp);
});

square.mouseout(function() {
  squareActor.start(resetProps);
});

var rotateInfinite = new ui.Tween({
  ease: 'linear',
  loop: true,
  duration: 5000,
  values: {
    rotate: 360
  }
});

var rectangleActor = new ui.Actor({
  element: '#rectangle',
  values: {
    rotate: 0
  }
});

var triangleActor = new ui.Actor({
  element: '#triangle',
  values: {
    rotate: 0
  }
});

triangleActor.start(rotateInfinite);
rectangleActor.start(rotateInfinite);
