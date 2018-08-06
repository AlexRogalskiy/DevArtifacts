$(document).ready(function(){	
//Remove active class from close-trigger
$('.navigation-bar  .close-trigger').removeClass('active');

//Displaying the Menu
$('.navigation-bar  .navigation-trigger').click(function () {
    $('.menu-1 ul').fadeIn('200');
	$('.navigation-bar  .close-trigger').addClass('active');
});

//closing the Menu
$('.navigation-bar  .close-trigger').click(function () {
    $('.menu-1 ul').fadeOut('200');
	$(this).removeClass('active');
});
});