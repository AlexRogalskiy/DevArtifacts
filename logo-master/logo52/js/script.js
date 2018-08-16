// So Firefox and Safari can do scaling and rotation combos.
CSSPlugin.useSVGTransformAttr = false;

function glFox() {
  var tl        = new TimelineMax({ delay: 0.5 });
  var faceright = document.querySelectorAll('.glface .right path'),
      faceleft  = document.querySelectorAll('.glface .left path'),
      facectr   = document.querySelectorAll('.glface .center path'),
      ears      = document.querySelectorAll('.glface .ear path');

  TweenMax.set(faceright, { transformOrigin: 'bottom left' });
  TweenMax.set(faceleft, { transformOrigin: 'bottom right' });
  TweenMax.set([facectr, ears], { transformOrigin: 'bottom center'});
  TweenMax.set([faceleft, faceright, facectr], { opacity: 0, scale: 0 })
  TweenMax.set(ears, { opacity: 0, rotationZ: 180 });

  var scale_in = {
    opacity: 1,
    scale: 1,
    ease: Cubic.easeInOut
  };

  var unfold_ears = {
    rotationX: -180,
    opacity: 1,
    ease: Power1.easeInOut
  };

  tl.staggerTo(faceright, 1, scale_in, 0.05675, 0)
    .staggerTo(faceleft, 1, scale_in, 0.05675, 0)
    .to(facectr, 1, scale_in, '-=0.9')
    .to(ears, 1, unfold_ears, '-=0.3');

  return tl;
}

function masterFox() {
  var tl = new TimelineMax();
  tl.add(glFox());
  tl.timeScale(1.675);
  return tl;
}

masterFox();