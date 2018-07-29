console.clear();

var $shape = document.getElementById('shape');
var $shadow = document.getElementById('shadow');
var $toggle = document.getElementById('toggle');
var rectangle = false;
var resetTimer;

var mouse = {
  x: 0,
  y: 0,
  ox: 0,
  oy: 0,
  move: function(event) {
    this.ox = this.x;
    this.oy = this.y;
    this.x = event.pageX;
    this.y = event.pageY;
    
    moveShape();
    clearTimeout(resetTimer);
    resetTimer = setTimeout(reset, 40);
  }
};

var time = Date.now(), speed = 0;
window.addEventListener('mousemove', mouse.move.bind(mouse));
window.addEventListener('click', toggleShape);

function update() {
    requestAnimationFrame(update);
    var elapsed = Date.now() - time;
    var dist = pDist(mouse.x, mouse.y, mouse.ox, mouse.oy);
    speed = dist / elapsed;
    time = Date.now();
}

function pDist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function toggleShape() {
  rectangle = !rectangle;
  TweenMax.set($shape, {className: rectangle ? '-=circle' : '+=circle'});
  TweenMax.set($shape, {scaleX: 0, scaleY: 0});
  TweenMax.to($shape, 0.2, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [5]});
}

function moveShape() {
  var angle = Math.atan2(mouse.y - mouse.oy, mouse.x - mouse.ox) * 180 / Math.PI;
    var scale = Math.max(1, Math.min(3, speed));
  TweenMax.to($shape, 0.1, {x: mouse.x, y: mouse.y, scaleX: scale, rotation: angle, ease: Expo.easeOut});
  TweenMax.to($shadow, 0.1, {x: mouse.x, y: mouse.y + 60, scaleY: scale, ease: Expo.easeOut});
}

function reset() {
    TweenMax.to($shape, 0.1, {scaleX: 1, scaleY: 1, ease: Expo.easeOut});
}

update();