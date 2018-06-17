// js for mouse following
var RADIUS = 150;
var MAX_ANGLE = 45; 
var SELECTOR = 'ball';

var ball = document.getElementById(SELECTOR);

var xOrigin, yOrigin, x, y, rafId;

function calculateYRotation(x,y) {
  var distance = Math.sqrt(x*x + y*y);
  return distance < RADIUS ? distance / RADIUS * MAX_ANGLE : MAX_ANGLE;
}

function calculateZRotation(x,y) {
  var radians = Math.atan2(y,x);
  return radians/Math.PI * 180;
}

var setOrigins = _.debounce(function(e) {
  xOrigin = window.innerWidth / 2;
  yOrigin = window.innerHeight / 2;
}, 500);

function rotateBall(e) {
	x = e.pageX - xOrigin;
	y = e.pageY - yOrigin;
};

function updateStyle(){
  var yDeg = calculateYRotation(x,y);
  var zDeg = calculateZRotation(x,y);
  ball.style.cssText = '-webkit-transform: rotateZ('+zDeg+'deg) rotateX(0deg) rotateY('+yDeg+'deg);-moz-transform: rotateZ('+zDeg+'deg) rotateX(0deg) rotateY('+yDeg+'deg);transform: rotateZ('+zDeg+'deg) rotateX(0deg) rotateY('+yDeg+'deg);';
  raf = requestAnimationFrame(updateStyle);
}

setOrigins();
window.addEventListener('resize', setOrigins, false);
window.addEventListener('mousemove', rotateBall);

window.onmouseover = function(event){ 
  raf = requestAnimationFrame(updateStyle);
}

window.onmouseout = function(event){
  cancelAnimationFrame(raf);
}
