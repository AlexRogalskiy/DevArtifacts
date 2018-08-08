var thumb = false;
var win = {width: $(window).width(), height: $(window).height()};
var mouse = {x: 0, y: 0};
var joy = {x: 0, y: 0};
var dot = {x: 0, y: 0};
var dotVel = {x: 0.15, y: 0.2};
var opacityVar = 0;

var hue = 220;
var warm = hue - 60;
var cold = hue + 60;

$(window).on('resize', function(){
	win = {width: $(window).width(), height: $(window).height()};
})

$(document).ready(function(){
	$('.side').on('mousedown', function(){
		$('body').addClass('grabbing')
		thumb = true;
	})
	$(document).on('mouseup', function(){
		$('body').removeClass('grabbing')
		thumb = false;
	})
	$(document).on('mousemove', function(e){
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	})
	requestAnimationFrame(animate);
	drawJoystick();
})

function animate(){
	updateJoystickPosition();
	drawJoystick();
	updateDotPosition();
	drawDot();
	requestAnimationFrame(animate);
}

function updateJoystickPosition(){
	if (thumb){
		joy.x = (mouse.x / win.width - 0.5)*4;
		joy.y = (mouse.y / win.height - 0.75)*4;
		if (joy.x > 1)
			joy.x = 1;
		if (joy.x < -1)
			joy.x = -1;
		if (joy.y > 1)
			joy.y = 1;
		if (joy.y < -1)
			joy.y = -1;

	} else {
		joy.x *= 0.6;
		joy.y *= 0.6;
	}

}

function updateDotPosition(){

	dotVel.x += joy.x/10;
	dotVel.y += joy.y/10;

	dotVel.x *= 0.95;
	dotVel.y *= 0.95;

	dot.x += dotVel.x/10;
	dot.y += dotVel.y/10;

	if (dot.x > 1.1)
		dot.x = -1.09;
	if (dot.x < -1.1)
		dot.x = 1.09;
	if (dot.y > 1.1)
		dot.y = -1.09;
	if (dot.y < -1.1)
		dot.y = 1.09;

}

function drawJoystick(){
	var xRotate = joy.x * -30;	
	var yRotate = joy.y * 30;	

	//calculate angle based on mouse position
	var transform = 'rotateY('+xRotate+'deg) rotateX('+yRotate+'deg) perspective(5000rem) translateZ(0rem)';
	var transformDip = 'translateX('+(xRotate*-0.2)+'%) translateY('+(yRotate*0.2)+'%)';
	var transformBase = 'translateX('+(xRotate*-0.08)+'%) translateY('+(yRotate*0.08)+'%)';

	$('.thumb').css('transform', transform);
	$('.dip').css('transform', transformDip);
	$('.side').css('transform', transform);
	$('.base').css('transform', transformBase);
	$('.stem').css('transform', transform);

	//variable for measing amount facing light
	var muke = (joy.x + joy.y - 2)*-0.25;

	var bg = 'hsl('+( hue - muke*30 + 15 )+',15%,'+(30 + muke*20)+'%)';
	var bgSide = 'linear-gradient(-45deg, hsl('+cold+',15%,'+(15 + muke*25)+'%),hsl('+warm+',20%,'+(70 + muke*20)+'%))';
	$('.thumb').css('background-color', bg);	
	$('.side').css('background', bgSide);	

	//generate dynamic shadows
	var light = 'inset '+(muke*4 + 2)+'rem '+(muke*4 + 2)+'rem '+(muke*10 + 5)+'rem hsla('+warm+',20%,65%,'+(0.5 + muke*0.5)+')';
	var dark = 'inset '+(muke*6 - 4)+'rem '+(muke*6 - 4)+'rem '+(15 - muke*10)+'rem hsla('+cold+',30%,10%,'+(1 - (muke*0.5))+')';
	var lightTight = 'inset '+(5)+'rem '+(5)+'rem '+(10)+'rem hsla('+warm+',10%,80%,'+(0.5 + muke*0.5)+')';
	var darkTight = 'inset '+(0)+'rem '+(0)+'rem '+(10)+'rem hsla('+cold+',60%,5%,'+(1 - (muke*0.5))+')';
	var fall = (10 + muke*15)+'rem '+(10 + muke*15)+'rem '+(15 + muke*35)+'rem hsla('+cold+',45%,5%,'+(0.4 - (muke*0.1))+')';
	var bs = light + ',' + lightTight + ',' + dark + ', ' + darkTight + ',' + fall;

	var lightDip = 'inset '+(-2 - muke*2)+'rem '+(-2 - muke*2)+'rem '+(8 + muke*4)+'rem hsla('+warm+',20%,65%,'+(0.3 + muke*0.5)+')';
	var darkDip = 'inset '+(4 - muke*2)+'rem '+(4 - muke*2)+'rem '+(12 - muke*4)+'rem hsla('+cold+',30%,20%,'+(0.8 - muke*0.5)+')';
	var lightDipOuter = (2 + muke*2)+'rem '+(2 + muke*2)+'rem '+(8 + muke*4)+'rem hsla('+warm+',20%,65%,'+(0.3 + muke*0.5)+')';
	var darkDipOuter = (-4 + muke*2)+'rem '+(-4 + muke*2)+'rem '+(12 - muke*4)+'rem hsla('+cold+',30%,20%,'+(0.8 - muke*0.5)+')';
	var bsDip = lightDipOuter + ',' + darkDipOuter + ',' + lightDip + ',' + darkDip;

	$('.thumb').css('box-shadow', bs);	
	$('.dip').css('box-shadow', bsDip);	

}

function drawDot(){

	opacityVar = Math.max(Math.min( opacityVar + Math.random()*0.02 - 0.01, 0.2), 0);
	var transformDot = 'translateX('+(dot.x*100)+'rem) translateY('+(dot.y*100)+'rem)';
	$('.dot').css('transform', transformDot);
	var opacityDot = 0.2 + (Math.sqrt( (Math.abs(dotVel.x) + Math.abs(dotVel.y)) * 2)) + opacityVar;
	$('.dot').css('opacity', opacityDot);


}


