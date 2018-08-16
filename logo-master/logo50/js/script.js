function xandaliEffect() {
  var options = {
    delay: 0.5,
    repeat: -1
  };

  var tl = new TimelineMax(options);

  var top_stripe = document.querySelectorAll('#top-stripes path'),
      btm_stripe = document.querySelectorAll('#bottom-stripes path'),
      top        = document.getElementById('top-stripes'),
      btm        = document.getElementById('bottom-stripes'),
      top_height = top.getBBox().height,
      btm_height = btm.getBBox().height,
      value      = top_height * 0.89, // 356 is the magic number
      duration   = 5.75;

  var set = {
    y: -value,
    x: -50,
    visibility: 'visible'
  }

  var to = {
    y: value * 2,
    x: 50,
    ease: Linear.easeInOut
  };

  TweenMax.set([btm_stripe, top_stripe], set);

  tl.to([btm_stripe, top_stripe], duration, to);

  return tl;
}

xandaliEffect();