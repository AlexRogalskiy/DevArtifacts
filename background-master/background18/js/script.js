jQuery(document).ready(function($){	
  $('.toggle').click(function(){
    $(this).toggleClass('hex').toggleClass('rgba');
    $('.wrapper').toggleClass('ie8');
    //colorValue();
  });
}); 

  


function colorValue() {
  $('li').each(function(){
    var color = $(this).css('background-color');
    alert(color);
    $(this).text(color);
  });
}