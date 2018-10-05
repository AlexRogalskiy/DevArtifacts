var movement = 0;
var latestdirection;
var leftpressed;
var rightpressed;
var current = 1;
var movementspeed = 2;

// Timing
var stop = false;
var frameCount = 0;
var fps,
	fpsInterval,
	startTime,
	now,
	then,
	elapsed;

function startAnimatingAt(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	move();
}

function move(){
	now = Date.now();
	elapsed = now - then;
	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
		
		// Everything here happens at a certain FPS		
		animateSprite(8);
	}
	
	// Calculations happen here
	if (leftpressed) {
		if (movement > -113) {
			movement -= movementspeed;
			$('div.player').css('left', movement + 'px');
		}
	} else if (rightpressed) {
		if (movement < 217) {
			movement += movementspeed;
			$('div.player').css('left', movement + 'px');
		}
	}
	window.requestAnimationFrame(move);
}

function animateSprite(frames, speed){
	var spritesheet = 'http://webstaging.uvu.edu/testingsite/kam/images/sprites/dino_stand_normal.png';
	var position = (current - 1) * 96;
	if (leftpressed || rightpressed) {
		spritesheet = 'http://webstaging.uvu.edu/testingsite/kam/images/sprites/dino_walk_normal.png';
	}
	$('div.player').css('background', 'url("' + spritesheet + '") ' + position + 'px 0');
	if (latestdirection == 'left') {
		$('div.player').css('transform', 'scaleX(-1)');
	} else if (latestdirection == 'right') {
		$('div.player').css('transform', 'scaleX(1)');
	}
	if (current < frames) {
		current++;
	} else {
		current = 1;
	}
}

$(function(){
	
	// Keyboard events
	$('body').on('keydown', function(e){
		if (e.which === 37) {
			leftpressed = true;
			latestdirection = 'left';
			e.preventDefault();
		} else if (e.which === 39) {
			rightpressed = true;
			latestdirection = 'right';
			e.preventDefault();
		}
	}).on('keyup', function(){
		leftpressed = false;
		rightpressed = false;
	});
	
	// Scroll events and initialization
	$('#stage .perspective-controller').css('perspective-origin', '50% ' + ($(window).scrollTop() / 2) + 'px');
	$(window).on('scroll', function(){
		var perspective = $(window).scrollTop() / 1;
		$('#stage .perspective-controller').css('perspective-origin', '50% ' + perspective + 'px');
	});
	
	// Touch events
	var mcleft = new Hammer($('#touch-left').get(0));
	var mcright = new Hammer($('#touch-right').get(0));
	mcleft.get('press').set({time:1});
	mcright.get('press').set({time:1});
	mcleft.on('press', function(){
		leftpressed = true;
		latestdirection = 'left';
	}).on('pressup', function(){
		leftpressed = false;
	});
	mcright.on('press', function(){
		rightpressed = true;
		latestdirection = 'right';
	}).on('pressup', function(){
		rightpressed = false;
	});
	
	startAnimatingAt(10);
  
  $('html, body').animate({
    scrollTop: $(".perspective-controller").offset().top
  }, 3000);
});