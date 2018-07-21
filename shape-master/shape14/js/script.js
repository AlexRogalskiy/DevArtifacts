var box = $("#1");
var boxCenter = [box.offset().left + box.width() / 2, box.offset().top + box.height() / 2];

$(document).mousemove(function(e) {

	var angle = Math.atan2(e.pageX - boxCenter[0], -(e.pageY - boxCenter[1])) * (180 / Math.PI);

	box.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
	box.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
	box.css({'transform': 'rotate(' + angle + 'deg)'});
	box.css({'transform-origin': '50% center 0px'});

});

var box2 = $(".2");
var box2Center = [box2.offset().left + box2.width() / 2, box2.offset().top + box2.height() / 2];

$(document).mousemove(function(e) {

	var angle = Math.atan2(e.pageX - box2Center[0], -(e.pageY - box2Center[1])) * (180 / Math.PI);

	box2.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
	box2.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
	box2.css({'transform': 'rotate(' + angle + 'deg)'});
	box2.css({'transform-origin': '50% center 0px'});

});

var box3 = $(".3");
var box3Center = [box3.offset().left + box3.width() / 2, box3.offset().top + box3.height() / 2];

$(document).mousemove(function(e) {

	var angle = Math.atan2(e.pageX - box3Center[0], -(e.pageY - box3Center[1])) * (180 / Math.PI);

	box3.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
	box3.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
	box3.css({'transform': 'rotate(' + angle + 'deg)'});
	box3.css({'transform-origin': '50% center 0px'});

});

var box4 = $(".4");
var box4Center = [box4.offset().left + box4.width() / 2, box4.offset().top + box4.height() / 2];

$(document).mousemove(function(e) {

	var angle = Math.atan2(e.pageX - box4Center[0], -(e.pageY - box4Center[1])) * (180 / Math.PI);

	box4.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
	box4.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
	box4.css({'transform': 'rotate(' + angle + 'deg)'});
	box4.css({'transform-origin': '50% center 0px'}); // Centers the svg origin

});

var box5 = $(".5");
var box5Center = [box5.offset().left + box5.width() / 2, box5.offset().top + box5.height() / 2];

$(document).mousemove(function(e) {

	var angle = Math.atan2(e.pageX - box5Center[0], -(e.pageY - box5Center[1])) * (180 / Math.PI);

	box5.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
	box5.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
	box5.css({'transform': 'rotate(' + angle + 'deg)'});
	box5.css({'transform-origin': '50% center 0px'});

});

var box6 = $(".6");
var box6Center = [box6.offset().left + box6.width() / 2, box6.offset().top + box6.height() / 2];

$(document).mousemove(function(e) {

	var angle = Math.atan2(e.pageX - box6Center[0], -(e.pageY - box6Center[1])) * (180 / Math.PI);

	box6.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
	box6.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
	box6.css({'transform': 'rotate(' + angle + 'deg)'});
	box6.css({'transform-origin': '50% center 0px'});

});