$(document).ready(function(){
  var doc = {
    width: window.innerWidth,
    height: 10000
  }
  $("body").css('height',doc.height);
  $(window).scroll(function(){
    var position = $(window).scrollTop();
    moshun(position);
  });
  function moshun(position){
    $("#cursor").css('left',(position*doc.width/(doc.height-window.innerHeight)));
  }
});