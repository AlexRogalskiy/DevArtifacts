$('nav.nav-vertical a').hover(function(){
  $(this).parents('nav').find('.box').stop(true,false);
  $(this).parents('nav').find('.box').animate({
    top: $(this).position().top+'px'
  },150);
});

$('nav.nav-horizontal a').hover(function(){
  $(this).parents('nav').find('.box').stop(true,false);
  $(this).parents('nav').find('.box').animate({
    left: $(this).position().left+'px'
  },150);
});