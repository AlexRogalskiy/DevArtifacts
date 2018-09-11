$(document).ready(function () {
selected=0;
moving=false;

$('header a').click(function(event){
	event.preventDefault();
	moving=false;
	selected = $(this).attr('href').substr(2);
	panelheight = $('#a'+selected).height();
	winheight = $(window).height();
	offset = (winheight-panelheight)/2;
	if (offset<0) {offset=0;}
	distance = $('#a'+selected).offset().top-offset;
	$('html, body').animate({scrollTop: distance}, 750);
});

$(window).scroll(function() {
moving = true;
toppos = $('html, body').scrollTop();
});

$(window).resize(function() {
 if (selected>0 && !moving) {
	panelheight = $('#a'+selected).height();
	winheight = $(window).height();
	offset = (winheight-panelheight)/2;
	if (offset<0) {offset=0;}
	distance = $('#a'+selected).offset().top-offset;
	$('html, body').scrollTop(distance);
	}
}).resize();


});
