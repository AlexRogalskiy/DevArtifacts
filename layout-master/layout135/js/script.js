// Make the checkbox work
$('footer i').click( function(){
  $(this).toggleClass('entypo-check');
});

// Put the speed in a variable to change it easily
var speed = '400';

// Make the close button work
$('.close').click( function(){
  $('#window').hide(speed);
  $('.overlay').hide(speed);
  $(this).hide(speed);
});

// Open the window again
$('.open').click( function(){
  $('#window').css('left', '0px').show(speed); 
  $('.close').show(speed);
  $('.overlay').show(speed);
});

// Some effect for the send button
$('.send').click( function(){
  $('#window').css('left', '200%').hide(speed);
  $('.close').hide(speed);
  $('.overlay').hide(speed);
});

