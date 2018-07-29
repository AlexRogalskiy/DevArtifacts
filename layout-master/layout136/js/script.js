// Show image stuff
$('.origin button').click( function(){
  $('.origin').toggleClass('visible');
  $(".img").css({'left': $(".img").data('originalLeft'),
                       'top': $(".img").data('origionalTop')
                });
});

$(".img").draggable();
$(".img").data({'originalLeft': $(".img").css('left'), 
                'origionalTop': $(".img").css('top')
});


// Profile active stuff
$('.profile li').click( function(){
  $('.profile li').removeClass('active');
  $(this).addClass('active');
});


// Slider stuff
$('.item2').slideUp();

$('.next').click( function(){
  $('.item').slideToggle();
  $('.item2').slideToggle();
});

$('.prev').click( function(){
  $('.item2').slideToggle();
  $('.item').slideToggle();
});


