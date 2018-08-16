function sa_identity() {
  var tmax_opts    = { delay: 0.25 };
  var tmax_tl      = new TimelineMax(tmax_opts),
      axe_left     = document.querySelectorAll('.axe path')[0],
      axe_right    = document.querySelectorAll('.axe path')[1],
      buttons      = document.querySelectorAll('.buttons circle'),
      bowtie       = document.querySelector('.bowtie #middle-bow'),
      bowtie_right = document.querySelector('.bowtie #right-bow'),
      bowtie_left  = document.querySelector('.bowtie #left-bow'),
      duration     = 1.125;

  var axe_left_from = {
    x: window.innerWidth,
    rotation: (360 * 5),
    opacity: 0,
    transformOrigin: 'center center',
  };

  var axe_left_to = {
    x: 0,
    rotation: 0,
    opacity: 1,
    ease: Cubic.easeIn
  };

  var axe_right_from = {
    x: -window.innerWidth,
    rotation: -(360 * 5),
    opacity: 0,
    transformOrigin: 'center center',
  };

  var axe_right_to = {
    x: 0,
    rotation: 0,
    opacity: 1,
    ease: Cubic.easeIn
  };

  var bow_left_from = {
    scale: 0,
    transformOrigin: '100% 50%',
    opacity: 0,
    ease: Elastic.easeInOut
  };

  var bow_left_to = {
    scale: 1,
    opacity: 1,
    ease: Elastic.easeInOut
  };

  var bow_right_from = {
    scale: 0,
    transformOrigin: '-100% 50%',
    opacity: 0,
    ease: Elastic.easeInOut
  };

  var bow_right_to = {
    scale: 1,
    opacity: 1,
    ease: Elastic.easeInOut
  };
  
  var scale_from = {
    scale: 0,
    transformOrigin: 'center center',
    opacity: 0
  };

  var scale_to   = {
    scale: 1,
    opacity: 1,
    ease: Elastic.easeInOut
  };

  tmax_tl.fromTo(axe_left, duration, axe_left_from, axe_left_to, 0)
         .fromTo(axe_right, duration, axe_right_from, axe_right_to, 0)
         .staggerFromTo(buttons, 1, scale_from, scale_to, 0.075)
         .fromTo(bowtie, 0.75, scale_from, scale_to, '-=0.675')
         .add('tie-bowends')
         .fromTo(bowtie_left, 0.575, bow_left_from, bow_left_to, 'tie-bowends')
         .fromTo(bowtie_right, 0.575, bow_right_from, bow_right_to, 'tie-bowends');


  // Testing Block
  // =============================================
  /*
  tmax_tl.eventCallback('onComplete', function() {
    tmax_tl.seek('tie-bowends')
  });
  return tmax_tl.timeScale(0.4).seek('tie-bowends');
  */

  // Return Timeline
  // =============================================

  return tmax_tl.timeScale(0.9);
}

sa_identity();