var balls   = [],
    fps     = 72,
    last    = 0,
    gravity = 5,
    walls   = true,
    colors  = false,
    liquid  = true,
    $fps    = $('#fps'),
    $canvas = getCanvas(),
    context = $canvas.get(0).getContext('2d'),
    fpsHistory = [],
    $window = $(window);

$(document.body)[liquid ? 'addClass' : 'removeClass']('liquid');
function getCanvas () {
  var $canvas =  $('<canvas />').appendTo('body'),
      width   = $(document.body).width(),
      height  = $(document.body).height();
  $canvas.attr({ height: height, width: width });
  return $canvas;
}

(function redraw (now) {
  if (!last) {
    last = now;
    return requestAnimationFrame(redraw);
  }
  var seconds = (now - last) / 1000,
      fps = Math.round(1 / seconds),
      total, average;
  fpsHistory.push(fps);
  while (fpsHistory.length > 100) fpsHistory.shift();
  total = fpsHistory.reduce(function (a, b) { return a + b; }, 0);
  average = Math.round(total / fpsHistory.length);
  $fps.text(average + ' fps');
  last = now;
  context.clearRect(0, 0, 999999, 999999);
  for (var i = 0; i < balls.length; i++) {
    balls[i].step(seconds);
  }
  requestAnimationFrame(redraw);
})();

$(window).resize(function () {
  for (var i = 0; i < balls.length; i++) {
    balls[i].resize();
  }
});

function Ball (left, top) {
  var hVelocity = Math.random() * 10 - 5,
      vVelocity = Math.random() * 10 - 5,
      tVelocity = 100,
      size      = Math.round(Math.random() * 90 + 40),
      last      = +new Date(),
      _         = this,
      color     = getColor(),
      width, height;
  
  function init () {
    _.resize();
    balls.push(_);
    _.step(0);
  }
  
  function getColor () {
    return '#0' + Math.floor(Math.random() * 0xc + 3).toString(16) + '9'
  }
  
  _.resize = function () {
    width = $window.width() - size;
    height = $window.height() - size;
  }
  _.step = function (seconds) {
    vVelocity = Math.min(tVelocity, vVelocity + gravity * seconds);
    top += vVelocity;
    left += hVelocity;
    if (walls) {
      if (left > width) {
        left = width - left % width;
        hVelocity *= -0.6;
      } else if (left < 0) {
        left = -left;
        hVelocity *= -0.6;
      }
    } else {
      if (left > width + size) {
        left -= width + 2 * size;
      } else if (left < -size) {
        left += width + 2 * size;
      }
    }
    if (top > height) {
      top = height - top % height;
      vVelocity *= -0.8;
    } else if (top < 0) {
      top = -top;
      vVelocity *= -0.8;
    }
    context.beginPath();
    context.fillStyle = colors ? color : 'black';
    context.arc(left + size * 0.5, top + size * 0.5, size / 2, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }
  init();
}

$(document).on('click', function (event) {
  if ($(event.target).closest('#controls').length)
    return true;
  for (var i = 0; i < 50; i++)
    new Ball(event.clientX, event.clientY);
  $(document.body).addClass('hidden');
});

$(function () {
  var $slider = $('#gravity-slider'),
      $amount = $('#amount'),
      $radios = $('.radio'),
      $wallsOn = $('#radio-walls-on'),
      $colorsOn = $('#radio-colors-on'),
      $liquidOn = $('#radio-liquid-on');
  $radios.buttonset().on('change', ':radio', function (event, ui) {
    walls = $wallsOn.is(':checked');
    colors = $colorsOn.is(':checked');
    liquid = $liquidOn.is(':checked');
    $(document.body)[liquid ? 'addClass' : 'removeClass']('liquid');
  });
  $slider.slider({
    range: "min",
    min: -99,
    max: 99,
    value: gravity,
    slide: function( event, ui ) {
      $amount.text( ui.value );
      gravity = ui.value;
    }
  });
  $amount.text( $slider.slider('value') );
});