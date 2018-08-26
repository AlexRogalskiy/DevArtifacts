var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
  currentMousePos.x = event.pageX;
  currentMousePos.y = event.pageY;
	$mouseX = currentMousePos.x;
  $mouseY = currentMousePos.y;
  $docX = $(document).width();
  $halfX = $docX/2;
  $docY = $(document).height();
  $halfY = $docY/2;
  $x = $mouseX - $halfX;
  $dividerX = $docX/20/2;
  $x /= $dividerX;
  $y = $mouseY - $halfY;
  $dividerY = $docY/20/2;
  $y /= $dividerY;
	$(".right-eyeball").css({
 transform: 'translate('+$x+'px, '+$y+'px)'
  });
  $(".left-eyeball").css({
 transform: 'translate('+$x+'px, '+$y+'px)'
  });
});