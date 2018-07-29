///////////////////////////////
var config = {
		'selector': '#glitch',
		'fontSize': 380,
		'color': '#fff',
		'glitchCount': 5
	}
	//////////////////////////////

var elements;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var getRandom = function(min, max) {
	return Math.random() * (max - min) + min;
}

var glitch = function(el, count) {
	var c = el.getContext('2d');

	for (var i = 0; i < count; i++) {
		var x = getRandom(0, el.width);
		var y = getRandom(0, el.height);
		var w = getRandom(0, el.width);
		var h = getRandom(0, el.height);
		var offsetX = getRandom(config.fontSize / 10 * -1, config.fontSize / 10);
		var offsetY = getRandom(config.fontSize / 10 * -1, config.fontSize / 10)

		var data = c.getImageData(x, y, w, h);
		c.putImageData(data, x + offsetX, y + offsetY);
	}

}

var setup = function(el) {
	var c = el.getContext('2d');
	var letter = el.getAttribute('data-letter');
	console.log(letter);
	el.height = config.fontSize * 1.3;
	el.width = config.fontSize * .6;
	c.clearRect(0, 0, el.height, el.width)
	c.font = "bold " + config.fontSize + "px 'space mono'";
	c.fillStyle = config.color;
	c.fillText(letter, 5, el.height - el.height / 4);
}

var init = function() {
	$(config.selector).append("<div class='canvas-container' id='canvas-container'></div>")
	var text = $(config.selector).text();
	for (var i = 0; i < text.length; i++) {
		$('#canvas-container').append('<canvas id="c-' + i + '" data-letter="' + text[i] + '"></canvas>')
	}
	elements = document.getElementsByTagName('canvas');
	for (var j = 0; j < elements.length; j++) {
		setup(elements[j])
	}
}

var loop = function() {
	var i = getRandomInt(0, elements.length)
	setup(elements[i]);
	glitch(elements[i], getRandomInt(config.glitchCount, config.glitchCount * 2))
	setTimeout(loop, getRandomInt(10, 500))
}

init();
loop();