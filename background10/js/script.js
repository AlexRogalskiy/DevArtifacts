function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateStars() {
  var width = $(window).width();
  var height = $(window).height();
  $('.star').each(function() {
    var randomtop = randomNumber(1, height);
    $(this).css('top', randomtop + 'px');
    var randomright = randomNumber(1, width);
    $(this).css('right', randomright + 'px');
  });
}

$(window).ready(generateStars);

$(window).resize(generateStars);