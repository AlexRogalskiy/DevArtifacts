$(document).ready(function () {
selected=0;


$('.scroll').click(function(event){
	event.preventDefault();
	distance = $('.curtain').height();
	selected = $(this).attr('href').substr(2);
	scrolldistance = distance*selected;
	$('html, body').animate({scrollTop: scrolldistance}, 500);
});


$(window).resize(function() {
	distance = $('.curtain').height();
	scrolldistance = distance*selected;
	$('html, body').scrollTop(scrolldistance);
}).resize();


});