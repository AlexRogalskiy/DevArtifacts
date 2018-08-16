function clearLeft() {
  var tl = new TimelineMax({ delay: 1 });

  var slide = {
    x: -140,
    y: 80,
    ease: Back.easeOut
  };

  var cube = document.querySelectorAll('.clearleft #cube-clear'),
      name = document.querySelectorAll('.clearleft #name');

  TweenMax.set(name, { scale: 2, xPercent: 60, yPercent: 100 });
  tl.to(cube, 0.375, slide);

  return tl;
}

clearLeft();