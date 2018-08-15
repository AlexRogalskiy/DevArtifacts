var bendXPos;
var bendXInc;
var bendMulptiplier;

function setup() {
	createCanvas(1080, 1920);
	noLoop();
	init();
}

// function mousePressed() {
// 	init();
// 	draw();
// }

function draw() {
	background(255);
	noFill();
	var yOff = 0;
	for (var i = height*0.1; i < height-height*0.1; i+=10) {
		beginShape();
		vertex(width*0.1, i);
		
		var x = sin(bendXPos)*bendMulptiplier+(bendXInc+width*0.5);
		// vertex(x, i+yOff);
		vertex(x, i+yOff+(x*yOff*0.01));
		
		vertex(width-width*0.1, i);
		stroke(0);
		strokeWeight(1);
		endShape();
		
		bendXPos += bendXInc;
		yOff += i < height/4 ? 2.125 : -0.5;
	}
}

function init() {
	background(255);
	// bendXPos = random(width*0.005, width-width*0.01);
	// bendXInc = TAU*(width*random(0.005, 0.01));
	// bendMulptiplier = random(width*0.05, width*0.1);
	
	bendXPos = 646.2956195168695;
	bendXInc = 62.85876637927578;
	bendMulptiplier = 180.43452805444937;
	
	console.log({
		bendXPos,
		bendXInc,
		bendMulptiplier
	});
}

function vmin(viewportPercent) {
	viewportPercent = viewportPercent / 100
	var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
	return viewportPercent * viewportMinSize;
}