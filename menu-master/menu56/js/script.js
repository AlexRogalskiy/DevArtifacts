$(document).ready(function(){	
//Remove active class from close-trigger
$('.navigation-bar  .navigation-trigger').removeClass('active');

//Displaying the Menu
$('.navigation-bar  .navigation-trigger .fa-bars').click(function () {
    $(this).parent().addClass('active');
	$('.menu-3 ul').slideDown('slow');
});

//closing the Menu
$('.navigation-bar  .navigation-trigger .fa-close').click(function () {
    $(this).parent().removeClass('active');
	$('.menu-3 ul').slideUp('slow');
});
});