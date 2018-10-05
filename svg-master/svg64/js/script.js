var beginState = $('svg').html;
var r = document.getElementById('r'),
		p = document.getElementById('p'),
		signaturePath = '',
		isDown = false;

function isTouchEvent(e) {
	return e.type.match(/^touch/);
}

function getCoords(e) {
	if (isTouchEvent(e)) {
		return e.targetTouches[0].clientX + ',' + e.targetTouches[0].clientY;
	}
	return e.clientX + ',' + e.clientY;
}

function down(e) {
	signaturePath += 'M' + getCoords(e) + ' ';
	p.setAttribute('d', signaturePath);
	isDown = true;

	if (isTouchEvent(e)) e.preventDefault();
}

function move(e) {
	if (isDown) {
		signaturePath += 'L' + getCoords(e) + ' ';
		p.setAttribute('d', signaturePath);
	}

	if (isTouchEvent(e)) e.preventDefault();
}

function up(e) {
	isDown = false; 

	if (isTouchEvent(e)) e.preventDefault();
}

r.addEventListener('mousedown', down, false);
r.addEventListener('mousemove', move, false);
r.addEventListener('mouseup', up, false);
r.addEventListener('touchstart', down, false);
r.addEventListener('touchmove', move, false);
r.addEventListener('touchend', up, false);
r.addEventListener('mouseout', up, false);

function clearIt() {
	signaturePath = '';
	p.setAttribute('d', '');
}

function sendIt() {
	var icons = new SVGMorpheus('#main');
	icons.to('heart');
	window.setTimeout(function(){
		icons.to('rocket');
		window.setTimeout(function(){
			$('path').addClass('takeoff');
			window.setTimeout(function(){
				location.reload(true);
			}, 1500);
		}, 750);
	}, 1500);
	return signaturePath;
}