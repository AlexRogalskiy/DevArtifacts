// on state click:
$('.states path, .states polygon').click(function() {
  $stateInfo = $('#state-info');
  $($stateInfo).toggleClass('active');
});

// hover tooltip that follows the cursor:
//Tooltips
$(".states path, .states polygon").hover(function(){
  $tip = $('<div>');
  $($tip).addClass('tip');
  $($tip).text($(this).attr('data-tip'));
  $('.states').append($tip);
  $($tip).show(); //Show tooltip
}, function() {
  $($tip).remove(); //Hide tooltip
}).mousemove(function(e) {
  //Change these numbers to move the tooltip offset
  var mousex = e.pageX + 20; //Get X coodrinates
  var mousey = e.pageY + 20; //Get Y coordinates. 
  var tipWidth = $tip.width(); //Find width of tooltip
  var tipHeight = $tip.height(); //Find height of tooltip
  
  //Distance of element from the right edge of viewport
  var tipVisX = $(window).width() - (mousex + tipWidth);
  //Distance of element from the bottom of viewport
  var tipVisY = $(window).height() - (mousey + tipHeight);
  if (tipVisX < 20) { //If tooltip exceeds the X coordinate of viewport
    mousex = e.pageX - tipWidth - 20;
  } if (tipVisY < 20) { //If tooltip exceeds the Y coordinate of viewport
    mousey = e.pageY - tipHeight - 20;
  }
  //Absolute position the tooltip according to mouse position
  $tip.css({  top: mousey, left: mousex });
});