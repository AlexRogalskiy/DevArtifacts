$('.hexagon-container').addClass('unclicked');

$(document).on('click','.hexagon-container.unclicked .hexagon', function() {
 // alert('first click');
  $(this).parents('.hexagon-container').removeClass('unclicked').addClass('hover'); 
}); 

$(document).on('click','.hexagon-container.hover .hexagon', function() {
  //alert('second click'); 
  $(this).parents('.hexagon-container').removeClass('hover').addClass('flipped');
});

$(document).on('click','.hexagon-container.flipped .hexagon', function() {
  //alert('third click');
  $(this).parents('.hexagon-container').removeClass('flipped').addClass('unclicked');
}); 

/*var break1;
var break2;
var break3;

if($('body').width() > 1000) {
  break1 = 1;
  break2 = 4;
  break3 = 7; 
}

$('<div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div><div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div>').insertBefore('#hex-'+break1);

$('<div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div><div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div><div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div>').insertBefore('#hex-'+break2);

$('<div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div><div class="hexagon filler"><div class="hexTop"></div><div class="hexBottom"></div></div>').insertBefore('#hex-'+break3);*/