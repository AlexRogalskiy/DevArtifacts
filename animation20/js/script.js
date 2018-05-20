var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width, height;
var mouseX = targetX = window.innerWidth * 0.5;
var mouseY = targetY = window.innerHeight * 0.5;
var trails = [];
resize();

function Trail(xRad, yRad, colorOffset, rotation) {
  this.trailArray = [];
  this.x = 0;
  this.y = 0;
  this.xRad = xRad;
  this.yRad = yRad;
  this.colorOffset = colorOffset;
  this.rotation = rotation;
  console.log(this.rotation);
}

Trail.prototype.update = function(t) {
  this.x = targetX + Math.sin(t) * this.xRad;
  this.y = targetY + Math.cos(t) * this.yRad;

  if (this.trailArray.length == 40) {
    var last = this.trailArray.pop();
    last.x = this.x;
    last.y = this.y;
    this.trailArray.unshift(last);
  } else {
    this.trailArray.unshift({
      x: this.x,
      y: this.y
    });
  }

}

Trail.prototype.draw = function(t) {
  ctx.save();
  ctx.translate(targetX, targetY);
  ctx.rotate(this.rotation*Math.PI/180);
  ctx.translate(-targetX, -targetY);
  for (var i = 0, l = this.trailArray.length; i < l; i++) {
    ctx.globalAlpha = 0.5 - (i * 0.01);
    ctx.beginPath();
    ctx.arc(this.trailArray[i].x, this.trailArray[i].y, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'hsl(' + (Math.round(t) + this.colorOffset) + ', 50%, 50%)';
    ctx.fill();
  }
  
  ctx.restore();


}

for (var i = 0; i < 12; i++) {
    addTrail(i);
}

function addTrail(i) {
  setTimeout(function() {
    var trail = new Trail(60, 30, i * 7, i * 10);
    trails.push(trail);
  }, i * 300);
}

var time = 0;

function loop(t) {
  ctx.clearRect(0, 0, width, height);
  targetX += (mouseX-targetX)*0.01;
  targetY += (mouseY-targetY)*0.01;
  for (var i = 0, l = trails.length; i < l; i++) {
    trails[i].update(time);
    trails[i].draw(time * 3);
  }
  time += 0.08;
  requestAnimationFrame(loop);
}

loop(0);

window.addEventListener('resize', resize);
window.addEventListener('mousemove', function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
})

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}