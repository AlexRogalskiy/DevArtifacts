var vertices = [];
var spline_size = 150;

function setup() {
	createCanvas(vmin(80), vmin(80));
	init();
}

function mousePressed() {
	init();
}

function init() {
	blendMode(BLEND);
	background(255);
	blendMode(DIFFERENCE);
	noFill();
	stroke(238, 139, 80, 2);
	strokeWeight(1);
	spline_size = width/2-width*0.1;
	resetSpline(spline_size);
}

function vmin(viewportPercent) {
	viewportPercent = viewportPercent / 100
	var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
	return viewportPercent * viewportMinSize;
}

function resetSpline(size) {
	vertices = [];
	for (var i = 0; i <= TAU; i+=0.1) {
		vertices.push({x: size * sin(i), y: size * cos(i)});
	}
}

function draw() {
	translate(width/2, height/2);
	
	beginShape();
	for (var i = 0; i < vertices.length; i++) {
		var range = i*0.01+0.1;
		var offsetX = map(random([-1,1]), -1, 1, -range, range);
		var offsetY = map(random([-1,1]), -1, 1, -range, range);
		
		vertices[i].x += offsetX;
		vertices[i].y += offsetY;
		
		curveVertex(vertices[i].x, vertices[i].y);
	}
	endShape(CLOSE);
	
	if (frameCount % 400 === 0) {
		spline_size -= 10;
		resetSpline(spline_size);
	}
}