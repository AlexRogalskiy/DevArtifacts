console.clear();

var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    circle, rafId;

var mouse = {
  x: 0,
  y: 0,
  onMove: function(e) {
    this.x = e.pageX;
    this.y = e.pageY;
  }
};

window.addEventListener('mousemove', mouse.onMove.bind(mouse));

var resizer = {
  w: 0,
  h: 0,
  onResize: function() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    canvas.width = this.w;
    canvas.height = this.h;
    resize();
  }
};

window.addEventListener('resize', resizer.onResize.bind(resizer));

var Point = {
  x: 0, // used to draw
  y: 0,
  ox: 0, // origin
  oy: 0,
  targetX: 0, // For bounciness
  targetY: 0,
  maxX: 0,
  maxY: 0,
  dist: 0,
  maxDist: 0,
  velocityX: 0,
  velocityY: 0,
  
  update: function(x, y) {
    var dx = x - this.ox,
        dy = y - this.oy;
    this.dist = Math.sqrt(dx * dx + dy * dy);
    
    if(this.dist < this.maxDist) {
      
      /*
        Moves the point between it's originX and maxX
        according to the dist between mouseX and originX
        (so the closer the farther).
        Formula taken from the minimalmonkey wobble ball
        https://www.flashmonkey.co.uk/wobblewall/
      */
      
      var distRatio = 1 - (this.dist / this.maxDist);
      this.targetX = this.ox + ((this.maxX - this.ox) * distRatio);
      this.targetY = this.oy + ((this.maxY - this.oy) * distRatio);
    }
    else {
      this.targetX = this.ox;
      this.targetY = this.oy;
    }
        
    /*
      A good explanation here:
      Gives the "bounciness" to the shape
      https://medium.com/@gordonnl/interactive-elastic-ease-ca3815fda572
    */
    
    var accelerationX = (this.targetX - this.x) * this.spring;
    this.velocityX += accelerationX;
    this.velocityX *= this.friction;
    this.x += this.velocityX;

    var accelerationY = (this.targetY - this.y) * this.spring;
    this.velocityY += accelerationY;
    this.velocityY *= this.friction;
    this.y += this.velocityY;
  }
};

var Bouncy = function(context, params) {
  this.context = context;
  this.context.lineWidth = 2;
  this.drawDots = params.drawDots;
  this.drawFill = params.drawFill;
  this.dotsRadius = params.dotsRadius;
  this.x = 0;
  this.y = 0;
  this.radius = params.radius;
  this.number = params.number;
  
  this.lineWidth = params.lineWidth;
  this.backgroundColor = params.backgroundColor;
  this.fillStyle = params.fillColor;
  this.strokeStyle = params.color;
  this.points = [];

  var maxDist = params.maxDist * this.radius;
  
  for(var i = 0; i < this.number; i++) {
    var p = Object.create(Point);  

    // Circular distribution
    p.x = p.ox = p.targetX = this.radius * Math.cos(Math.PI * 2 / this.number * i);
    p.y = p.oy = p.targetY = this.radius * Math.sin(Math.PI * 2 / this.number * i);
    
    // Max target for the point
    p.maxX = Math.cos(Math.PI * 2 / this.number * i) * maxDist;
    p.maxY = Math.sin(Math.PI * 2 / this.number * i) * maxDist;
    
    p.maxDist = maxDist;
    p.friction = params.friction;
    p.spring = params.spring;
    this.points.push(p);
  }
};

Bouncy.prototype.update = function() {
  var ctx = this.context;
  ctx.fillStyle = this.backgroundColor;
  ctx.fillRect(0, 0, resizer.w, resizer.h);
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.lineWidth = params.lineWidth;
  ctx.fillStyle = params.fillColor;
  ctx.strokeStyle = params.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  
  var mouseX = mouse.x - this.x,
      mouseY = mouse.y - this.y;
  
  var firstPoint = this.points[0];
  
  // Link all points to the next one
  for(var i = 0; i < this.points.length; i++) {
    var p = this.points[i];
    p.update(mouseX, mouseY);
    
    ctx.lineTo(p.x, p.y);
    //if(this.drawDots) ctx.arc(p.x, p.y, this.dotsRadius, 0, Math.PI * 2);
  }
    
    ctx.lineTo(firstPoint.x, firstPoint.y);
    if(this.drawFill) ctx.fill();
    ctx.stroke();
    ctx.restore();
};

var params = {
  color: '#fff',
  fillColor: '#27ae60',
  backgroundColor: '#34495e',
  number: 4,
  lineWidth: 10,
  radius: 150,
  maxDist: 1.2,
  drawDots: false,
  dotsRadius: 1,
  drawFill: true,
  spring: 0.06,
  friction: 0.96
};

function update() {
  rafId = requestAnimationFrame(update);
  circle.update();
}

function resize() {
  if(!circle) return;
  circle.x = resizer.w / 2;
  circle.y = resizer.h / 2;
}

function start() {
  init();
  var gui = new dat.GUI();
  gui.add(params, 'number').min(3).max(100).step(1).onChange(init);
  gui.add(params, 'radius').min(1).max(500).step(1).onChange(init);
  gui.add(params, 'maxDist').min(1).max(2).step(0.1).onChange(init);
  gui.add(params, 'friction').min(0).max(1).step(0.02).onChange(init);
  gui.add(params, 'spring').min(0).max(1).step(0.02).onChange(init);
  gui.add(params, 'lineWidth').min(1).max(10).step(1).onChange(init);
  //gui.add(params, 'drawDots').onChange(init);
  //gui.add(params, 'dotsRadius').min(1).max(10).step(1).onChange(init);
  gui.addColor(params, 'color').onChange(init);
  gui.add(params, 'drawFill').onChange(init);
  gui.addColor(params, 'fillColor').onChange(init);
  gui.addColor(params, 'backgroundColor').onChange(init);
  mouse.x = resizer.w / 2;
  mouse.y = resizer.h / 2;
  update();
}

function init() {
  console.log(params);
  circle = new Bouncy(context, params);
  resizer.onResize();
}

start();