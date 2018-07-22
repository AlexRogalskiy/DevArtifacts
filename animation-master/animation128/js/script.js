var my_line = [];
var line_points = 10;
var num_lines = 1;

function setup() {
	createCanvas(vmin(80), vmin(80));
	init();
	noFill();
	noLoop();
}

function mousePressed() {
	init();
	draw();
}

function draw() {
	for (var i = 0; i <= num_lines; i++) {
		beginShape();
		for (var j = 0; j < my_line.length; j++) {
			my_line[j].x += random([-1, 1]);
			my_line[j].y += random([-1, 1]);
			curveVertex(my_line[j].x, my_line[j].y);
			// point(my_line[i].x, my_line[i].y);

			my_line[j].y += 5;
		}
		endShape();
	}
}

function init() {
	background(255);
	line_points = width / 10 / 2;
	num_lines = (width - 40) / 5;
	my_line = [];

	for (var i = 0; i <= line_points; i++) {
		my_line.push(createVector(map(i, 0, line_points, 0, width), 20));
	}
}

function vmin(viewportPercent) {
	viewportPercent = viewportPercent / 100
	var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
	return viewportPercent * viewportMinSize;
}
