/*
  Johan Karlsson (DonKarlssonSan)
*/
function Particle() {
  this.x = random([0, w]);
  this.y = random([0, h]);
  this.oldX = this.x;
  this.oldY = this.y;
}

Particle.prototype.move = function(stepSize) {
  this.oldX = this.x;
  this.oldY = this.y;
  this.x += random(-stepSize, stepSize);
  this.y += random(-stepSize, stepSize);
  if(this.x < 0) this.x = 0;
  if(this.x > w) this.x = w;
  if(this.y < 0) this.y = 0;
  if(this.y > h) this.y = h;
}

Particle.prototype.draw = function() {
  line(this.oldX, this.oldY, this.x, this.y);
}

var particles;
var iterations;
var px;
var w;
var h;

function setup() {
  cursor(HAND);
  iterations = 5;
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  reset();
  stroke(0, 10);
}

function draw() {
  for(var i = 0; i < iterations; i++) {
    particles.forEach(p => {
      var x = floor(p.x);
      var y = floor(p.y);
      var off = (y * w + x) * 4; 
      var stepSize = 30;
      if(px[off+3] > 100) {
        stepSize = 2;
      }
      p.move(stepSize);
      p.draw();
    });
  }
}

function initParticles() {
  particles = [];
  for(var i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function initImage() {
  var message = "I love you";
  var tSize = 150;
  textSize(tSize);
  var tWidth = textWidth(message);
  text(message, w / 2 - tWidth / 2, h / 2 + tSize / 2);
  var image = get(0, 0, w, h);
  image.loadPixels();
  px = image.pixels;
  background(255);
}

function reset() {
  initParticles();
  clear();
  initImage();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = windowWidth;
  h = windowHeight;
  reset();
}

function mouseClicked() {
  reset();
}