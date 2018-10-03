
console.clear();

var btnRayon = 60;
var btnLineWidth = 2;

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

canvas.width = btnRayon*2;
canvas.height = btnRayon*2;
var mousePos = {};

start();

function start(){
	document.addEventListener('mousemove', onMousemove);
	TweenMax.ticker.addEventListener('tick', update);
}

function onMousemove(e){
	mousePos = {
		x: e.clientX,
		y: e.clientY
	}
}

function createShadow(angle){
	
	var rayon = btnRayon*2;
	var center = {
		x: rayon/2*Math.cos(angle) + btnRayon,
		y: rayon/2*Math.sin(angle) + btnRayon
	}
	
	context.beginPath();
	
	context.arc(center.x, center.y, rayon, 0, 2 * Math.PI, false);
	
	context.lineWidth = 3;
	var grd=context.createRadialGradient(center.x,center.y, rayon/10,center.x,center.y,rayon);
	grd.addColorStop(0.1,"rgba(0,0,0,0.85)");
	grd.addColorStop(1,"rgba(0,0,0,0)");
	context.fillStyle = grd;
	context.fill();
	context.closePath();
}

function createButton(hover){

	context.beginPath();
	
	context.arc(btnRayon, btnRayon, btnRayon - btnLineWidth, 0, 2 * Math.PI, false);
	
	context.lineWidth = btnLineWidth;
	context.strokeStyle = '#FFFFFF';
	context.stroke();	
	
	context.closePath();
}

function calculAngle(p1, p2){
	return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

function getDistance(p1, p2){
	return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) );
}

function update(){
	
	var canvasPos = canvas.getBoundingClientRect();
	
	var canvasCenter = {
		x: canvasPos.left + canvas.width/2,
		y: canvasPos.top + canvas.height/2
	}
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var angle = calculAngle({
		x: canvasCenter.x,
		y: canvasCenter.y
	}, mousePos);
	
	var distance = getDistance({
		x: canvasCenter.x,
		y: canvasCenter.y
	}, mousePos);
	
	var hover = false;
	
	if(distance < btnRayon){
		hover = true;
	} else {
		hover = false;
	}

	var button = document.querySelector('.button');
	
	if (!hover){
		button.classList.remove('hover');
	} else {
		button.classList.add('hover');
	}

	createButton(hover);
	createShadow(angle);
	
	// context.rect(0 ,0 , btnRayon*2, btnRayon*2);
	// context.fillStyle = "red";
	// context.fill();
	
	
}

