// Google Music Equalizer
// https://ssl.gstatic.com/music/fe/1c1abd24f4bdc2a3cc124f6e9928d13b/ani_equalizer_black.gif

// A pen by @Vestride

// Stop animation events from propagating to the body,
// which stops codepen from pausing them... o_0
(function() {
  var animation = document.querySelector('.equalizer');
  
  function onAnimation( evt ) {
    evt.stopPropagation();
  }
  
  animation.addEventListener('webkitAnimationStart', onAnimation, false);
  animation.addEventListener('webkitAnimationIteration', onAnimation, false);
  animation.addEventListener('animationStart', onAnimation, false);
  animation.addEventListener('animationIteration', onAnimation, false);
}());