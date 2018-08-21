var PixelMood = (function() {
  var pixelSound,
      pixel,
      leftBrow,
      rightBrow,
      angry,
      sleepy,
      inLove,
      bouncy;
  
  function addBinds() {
    pixel.addEventListener('click', makeSleepy);
    angry.addEventListener('change', makeAngry);
    sleepy.addEventListener('change', makeSleepy);
    bouncy.addEventListener('change', makeBouncy);
    inLove.addEventListener('change', makeInLove);
  }
  
  function makeSleepy() {
    pixel.classList.toggle('pixel-sleepy');
  }
  
  function makeAngry() {
    pixel.classList.toggle('pixel-angry');
  }
  
  function makeInLove() {
    pixel.classList.toggle('pixel-in-love');
  }
  
  function makeBouncy() {
    pixel.classList.toggle('pixel-bouncing');
  }

  var init = function init() {
    pixelSound = document.querySelector('.pixel--sound');
    pixel = document.querySelector('.pixel');
    angry = document.getElementById('angry');
    sleepy = document.getElementById('sleepy');
    bouncy = document.getElementById('bouncy');
    inLove = document.getElementById('inlove');

    addBinds();
  }
  
  return {
    init: init
  }
})();

PixelMood.init();