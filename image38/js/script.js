// Bind keyup event, thanks @vendruscolo
$(window).on({
  'keydown': function(e){
    var pressedKey = $('.k' + e.keyCode);
    pressedKey.addClass('pressed');
  },
  'keyup': function(e) {
    var pressedKey = $('.k' + e.keyCode);
    pressedKey.removeClass('pressed');
  }
});