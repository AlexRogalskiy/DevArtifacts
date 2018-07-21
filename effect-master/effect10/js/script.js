var windowHeight = $(window).height();
var $slides = $('.slide');

function init() {
	$('body').css('height', ($slides.length * 100) + '%');
  
	$slides.each(function(index) {
    $(this).css({
      'z-index': index,
      'top': (index * 100) + '%'
    });
  });
  
	var $scrollingSlide = $('.slide--scrolling').last();
  var scrollingSlideIndex = $('.slide').index($scrollingSlide);
  $(window).scrollTop((scrollingSlideIndex - 1) * windowHeight);
}

function adjustPositions() {
	var scrollPosition = $(window).scrollTop();
	var scrollingSlide = Math.floor(scrollPosition / windowHeight) + 1;
  var $scrollingSlide = $('#slide-' + scrollingSlide);
  $scrollingSlide.prevAll('.slide').removeClass('slide--scrolling').addClass('slide--locked');
  $scrollingSlide.removeClass('slide--locked').addClass('slide--scrolling');
  $scrollingSlide.nextAll('.slide').removeClass('slide--locked').removeClass('slide--scrolling');
}

$(document).ready(function() {
	init();
});

$(window).scroll(function () {
  adjustPositions();
});