var bendXPos;
var bendXInc;
var bendMulptiplier;

function setup() {
	createCanvas(1400, 1400);
	noLoop();
	init();
}

// function mousePressed() {
// 	init();
// 	draw();
// }

function draw() {
	noFill();
	var yOff = 0;
	for (var i = width*0.1; i < height-width*0.1; i+=10) {
		beginShape();
		vertex(width*0.1, i);
		
		var x = sin(bendXPos)*bendMulptiplier+(bendXInc+width*0.01);
		vertex(x, i+yOff);
		// vertex(x, i+yOff+(x*yOff*0.01));
		
		vertex(width-width*0.1, i);
		stroke(0);
		strokeWeight(1);
		endShape();
		
		bendXPos += bendXInc;
		yOff += i < height/2 ? 1 : -1;
	}
}

function init() {
	background(255);
	bendXPos = random(width*0.25, width-width*0.5);
	bendXInc = TAU*(width*random(0.01, 0.05));
	bendMulptiplier = random(width*0.01, width*0.05)
}

function vmin(viewportPercent) {
	viewportPercent = viewportPercent / 100
	var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
	return viewportPercent * viewportMinSize;
}