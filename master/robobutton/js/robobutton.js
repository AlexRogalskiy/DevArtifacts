jQuery(document).ready(function() {
  
  // For ROBObutton
  $("a.robolink").css({display: "none"}); // Opera Fix
  $('.robo_container').hover(function() {
  	$("span.btn_left_up").stop().animate({'marginTop': '-40px'},700);
  	$("span.btn_right_up").stop().animate({'marginRight': '-40px'},700);
  	$("span.btn_left_down").stop().animate({'marginLeft': '-40px'},700);
  	$("span.btn_right_down").stop().animate({'marginTop': '40px'},700);
  	$("a.robolink").stop(true,true).fadeIn(2000);
  },function() { //mouseout
  	$("a.robolink").stop(true,true).fadeOut(500);
  	$("span.btn_left_up").stop().animate({'marginTop': '0'},700);
  	$("span.btn_right_up").stop().animate({'marginRight': '0',},700);
  	$("span.btn_left_down").stop().animate({'marginLeft': '0'},700);
  	$("span.btn_right_down").stop().animate({'marginTop': '0'},700);
  });
  		
});