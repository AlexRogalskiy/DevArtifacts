var ctx = can.getContext("2d"),
	w, h;
can.width = w = window.innerWidth;
can.height = h = window.innerHeight;

var SOLVE = true,
    DEBUG = true,
	POINTS = 5,
	SIZE = 30,
	STIFFNESS = 0.75,
	DAMPING = 0.1,
  PLASTIC = 1,
	MASS = 1,
	ROOF = true;

var world = {
	friction: 1,
	  gravity: [0, 1]
};

function r(m, M) {
	return Math.random() * (M - m) + m;
}

function dif(p1, p2) {
	return [p2[0] - p1[0], p2[1] - p1[1]];
}

function disSqr(p1, p2) {
	var dx = p2[0] - p1[0],
		dy = p2[1] - p1[1];
	return dx * dx + dy * dy;
}

function dis(p1, p2) {
	return Math.sqrt(disSqr(p1, p2));
}

function dot(p1, p2) {
	return p1[0] * p2[0] + p1[1] * p2[1];
}

function len(p1) { 
	return p1[0] * p1[0] + p1[1] * p1[1];
}

function norm(p1) {  
	var l = len(p1);
	if (l > 0) {
		l = Math.sqrt(l);
		p1[0] /= l;
		p1[1] /= l;
	}
	return p1;
}

function clone(p1) {
	return [p1[0], p1[1]];
}

function add(p1, p2) {
	p1[0] += p2[0];
	p1[1] += p2[1];
	return p1;
}

function mulS(p1, s) {
	p1[0] *= s;
	p1[1] *= s;
	return p1;
}

function cross(p1, p2) { 
	return p1[0] * p2[1] - p1[1] * p2[0];
}

function perp(p1) { 
	var x = p1[0]; 
	p1[0] = -p1[1]; 
	p1[1] = p1[0]; 
	return p1;
}


function Body(o) {
	var a = [];
	a.gravityScale = 1;
	a.frictionScale = 1;
	for (var i = 0; i < POINTS; i++) {    
		var pos = Math.PI * 2 / POINTS * i + Math.PI / POINTS;
		var p = add([Math.cos(pos) * SIZE, Math.sin(pos) * SIZE], o);
		p.velocity = [0, 0];
		a.push(p);
	}
	a.center = [0, 0];
	a.center.velocity = [0, 0];
	a.stiffness = STIFFNESS;    
	a.damping = DAMPING;
	a.mass = 1;
	calc_constraints(a);
	return a;
}

function calc_constraints(body) {  
	var i, j, a, b, c, n;

	body.center.rest = {};
	for (i = 0; i < body.length; i++) {
		a = body[i];
		a.rest = {};    //distance
		    
		for (j = 0; j < body.length; j++) {
			if (j == i) continue;     
			b = body[j];      
			a.rest[j] = dis(a, b);
		}
		add(body.center, a);
	}
	mulS(body.center, 1 / body.length);
	for (i = 0; i < body.length; i++) {
		a = body[i];
		body.center.rest[i] = dis(body.center, a);
		a.rest[body.length] = body.center.rest[i];
	}
}


function draw_body(body) {
	ctx.beginPath();
	ctx.moveTo(body[0][0], body[0][1]);
	var i,a;
	for (i = 1; i < body.length; i++) {
		ctx.lineTo(body[i][0], body[i][1]);
	}
	ctx.closePath();
	ctx.fillStyle = "#ff7c3a";
	ctx.fill();
	if(DEBUG){
		ctx.fillStyle="red";
		for (i = 0; i < body.length+1; i++) {
			a = body[i] || body.center;
			ctx.fillRect(a[0]-1,a[1]-1,2,2);
		}
	}
}

function apply_velocity(body) {
	for (var i = 0; i < body.length + 1; i++) {
		var a = body[i] || body.center;
		add(a.velocity, mulS(clone(world.gravity), body.gravityScale));
		mulS(a.velocity, world.friction * body.frictionScale);
		add(a, a.velocity);  
		if (a[1] > h) {      
			a[1] = h;
			if (a.velocity[1] > 0) a.velocity[1] *= -1; //simulate tangent friction
			a.velocity[0] *= 0.9;
		}
		if(ROOF){
			if (a[1] < 0) {    
				a[1] = 0;    
				if (a.velocity[1] < 0) a.velocity[1] *= -1;   
			}    
		}
		if (a[0] < 0) {      
			a[0] = 0;
			if (a.velocity[0] < 0) a.velocity[0] *= -1;
		}    
		if (a[0] > w) {      
			a[0] = w;
			if (a.velocity[0] > 0) a.velocity[0] *= -1;
		}
	}
}

function solve_constraints(body) {  
	var a, b, c, l, d, rv, van, force, i, j, cr,f;
	for (i = 0; i < body.length + 1; i++) {
		a = body[i] || body.center;

		for (j = body.length; j >= 0; j--) {
			if (j == i) continue;
			b = body[j] || body.center;

			l = dis(a, b);
			d = norm(dif(a, b));
			rv = dif(a.velocity, b.velocity);
			van = dot(d, rv);
			force = (l - a.rest[j]) * body.stiffness;
      a.rest[j] += force * (1-PLASTIC) ;
      
			force += body.damping * van;

			mulS(d, force/4 * (1/body.mass));

			add(a,d);
			add(a.velocity, d);
			mulS(d, -1);
			add(b,d);
			add(b.velocity, d);
		}
	}
}

function move_body(body) {
	apply_velocity(body);
	if(SOLVE)solve_constraints(body);
}

function draw() {
	ctx.fillStyle = "#ffea84";
	ctx.globalAlpha = 1;
	ctx.fillRect(0, 0, w, h);

	ctx.globalAlpha = 1;
	draw_body(body);
	if (closest && closest.length) {
		ctx.fillStyle = "white";
		for(var i = 0; i < closest.length; i++){
			ctx.fillRect(closest[i][0] - 3, closest[i][1] - 3, 6, 6);
		}

	}
}

function update() {
	move_body(body);
	if (MOUSE_DOWN && closest.length) {
		var c = [0,0],i,d,dh;
		for(i = 0; i < closest.length; i++){
			add(c,closest[i]);
		}
		mulS(c,1/closest.length);
		d = dif(c, MOUSE_DOWN);
		mulS(d, 0.5*(1/closest.length));
		dh = mulS(clone(d), 0.5);
		for(i = 0; i < closest.length; i++){
			add(closest[i],d);
			add(closest[i].velocity, dh);
		}
	}
}

function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
}

var body = Body([w / 2, h / 2]);
loop();

var MOUSE_DOWN = false;
var last_mouse = [0, 0];
var closest = [];
var SHIFT_DOWN = false;

var touched = false;
function mousedown(e){
  if(e.touches)e = e.touches[0];
	MOUSE_DOWN = [e.clientX, e.clientY];
	body.gravityScale = 1;
	body.frictionScale = 1;
	var d = Infinity,
		nd, a, c;
	for (var i = 0; i < body.length + 1; i++) {
		a = body[i] || body.center;
		nd = disSqr(MOUSE_DOWN, a);
		if (nd < d) {
			d = nd;
			c = a;
		}
	}
	closest.push(c);
}
function mousemove(e) {  
  if(e.touches)e = e.touches[0];
  var x = e.clientX, y = e.clientY;
	if (MOUSE_DOWN) {
		MOUSE_DOWN = [x,y];
	}
	last_mouse = [x,y];
}
function mouseup(e) {
	last_mouse = MOUSE_DOWN;
	MOUSE_DOWN = false;
	body.gravityScale = 1;
	body.frictionScale = 1;
	if(SHIFT_DOWN === false)closest = [];
}

can.addEventListener("mousedown", function(){
  if(touched)return;
  mousedown.apply(this,arguments);
});
can.addEventListener("touchstart", function(){
  touched = true;
  mousedown.apply(this,arguments);
});
document.addEventListener("mousemove",mousemove);
document.addEventListener("touchmove",mousemove);

document.addEventListener("mouseup", mouseup);
document.addEventListener("touchend", mouseup);

document.addEventListener("keydown", function(e) {
	SHIFT_DOWN = e.shiftKey;
});
document.addEventListener("keyup", function(e) {
	console.log(e);
	if (e.keyCode == 32) {
		body = Body(last_mouse);
	}
	if(!(SHIFT_DOWN = e.shiftKey)){
		closest = [];
	}
});

BodyStiffness.oninput = function(){
	STIFFNESS = body.stiffness = +this.value;
};
BodyDamping.oninput = function(){
	DAMPING = body.damping = +this.value;
};
BodyPlastic.oninput = function(){
	PLASTIC = +this.value;
};
BodySize.oninput = function(){
	SIZE = +this.value;
	body = Body([w/2,h/2]);
};
BodyMass.oninput = function(){
	MASS = body.mass = +this.value;
};
BodyPoints.onchange = function(){
	POINTS = +this.value;
	body = Body([w/2,h/2]);
};
Springs.onchange = function(){
	SOLVE = this.checked;
};
Debug.onchange = function(){
	DEBUG = this.checked;
};
Roof.onchange = function(){
	ROOF = this.checked;
};
