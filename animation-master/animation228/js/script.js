var duration = 300;

$.fn.switchClass = function(r, a) {
  t = this;
  t.removeClass(r);
  setTimeout(function() {
    t.addClass(a);
  }, duration);
};

$(document).ready(function() {
  var e = $('.o-c');
  e.addClass('nav');
  e.click(function() {
    if( e.hasClass('nav') ) {
      e.switchClass('nav', 'cross');
    } else {
      e.switchClass('cross', 'nav');
    }
  });
});