function Particle(x,y) {
	this.pos = createVector(x,y);
	this.prev = this.pos.copy();
	this.vel = p5.Vector.random2D();
	this.acc = createVector();
	
	this.update = function() {
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.acc.mult(0);
	}
	
	this.show = function() {
		stroke(0, 25);
		strokeWeight(1);
		line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
		this.prev = this.pos.copy();
	}
	
	this.attracted = function(target) {
		var force = p5.Vector.sub(target, this.pos);
		var dsquared = force.magSq(-15);
		dsquared = constrain(dsquared, 200, 400);
		var g = 16;
		var strength = g/dsquared;
		force.setMag(strength);
		this.acc.add(force);
	}
}

var attractors = [];
var particles = [];
var cycle_count = 0;
var show_attractors = false;

var debug_switch = document.getElementById('debug');

debug_switch.addEventListener("change", function() { show_attractors = !show_attractors; });

function init() {
	attractors = [];
	particles = [];
	
	for (var i = 0; i < 1000; i++) {
		particles.push(new Particle(200, 200));
	}
	
	for (var i = 0; i < random(3,10); i++) {
		
		attractors.push({
			pos: createVector(random(100, width-100), random(100, height-100)),
			xoff: random(),
			yoff: random(),
			xoff_inc: random(0.001, 0.009),
			yoff_inc: random(0.001, 0.009)
		});
	}
	
	background(255);
	cycle_count = 0;
}

function setup() {
	createCanvas(400, 400);
	init();
}

function draw() {
	background(255);
	stroke(255, 0, 0);
	strokeWeight(4);
	
	for (var i = attractors.length - 1; i >= 0; i--) {
		var new_x = map(noise(attractors[i].xoff), 0, 1, 0, width);
		var new_y = map(noise(attractors[i].xoff, attractors[i].yoff), 0, 1, 0, height);
		
		attractors[i].pos.x = new_x;
		attractors[i].pos.y = new_y;
		
		if (show_attractors) {
			point(attractors[i].pos.x, attractors[i].pos.y);
		}
		
		attractors[i].xoff += attractors[i].xoff_inc;
		attractors[i].yoff += attractors[i].yoff_inc;
	}
	
	for (var i = particles.length - 1; i >= 0; i--) {
		for (var j = attractors.length - 1; j >= 0; j--) {
			particles[i].attracted(attractors[j].pos);
		}
		
		particles[i].show();
		particles[i].update();
	}
	
	cycle_count += 1;
	
	if (cycle_count === 600) {
		init();
	}
}