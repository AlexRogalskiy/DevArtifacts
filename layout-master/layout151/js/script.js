$('.at-help-btn').hover(function() {
  $(this).children('.at-help-btn__text').animate({
    width: 'toggle',
    opacity: 'toggle'
  }, 300);
});