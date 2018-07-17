var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    width,
    height;

function resize(){
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize',resize);

document.body.appendChild(canvas);

////////////////////////////////////////

function Polygon(options) {
  if (!(this instanceof Polygon)) { return new Polygon(options); }

  for (var key in options) {
    if (options.hasOwnProperty(key)) { this[key] = options[key]; }
  }
}

var twoPI = 2 * Math.PI;

Polygon.prototype = {
  sides: 6,
  size: 20,
  x: 20,
  y: 0,
  fill: '#000000',
  ctx: false,
  img: false,
  rotation: 0,
  preDraw: function() {},
  postDraw: function() {},
  draw: function() {
    // Polygon math from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
    if (this.ctx) {
      var ctx = this.ctx,
          i = this.sides;

      ctx.save();
      this.preDraw();
      
      ctx.translate(this.x,this.y);
      
      ctx.translate(this.size/2,this.size/2);
      ctx.rotate(this.rotation * (Math.PI * 2 ));
      

      ctx.beginPath();
      ctx.moveTo(this.size, 0);

      while (i--) {
        ctx.lineTo(
          this.size * Math.cos(i * twoPI / this.sides),
          this.size * Math.sin(i * twoPI / this.sides)
        );
      }
      
      ctx.translate(-this.size/2,-this.size/2);
      

      //ctx.closePath();
      ctx.fillStyle = this.fill;
      ctx.fill();
      
      this.postDraw();
      ctx.restore();
    }
    
    return this;
  }
};


var count = 10,
    spacing = width / count,
    polygons = [];

function randomRange(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

while (count--){
  polygons.push(
    Polygon({
      ctx: ctx,
      sides: 6,
      size: randomRange(spacing / 4,spacing),
      x: spacing * count,
      fill: '#FFF'
    })
  );
}

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
      // IE Fallback
      function(callback){ window.setTimeout(callback, 20); };

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.globalCompositeOperation = "source-over";
  
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  ctx.globalCompositeOperation = "destination-out";
  
  ctx.save();
  ctx.restore();
  
  var i = polygons.length;
  while (i--){ polygons[i].draw(); }
  
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);


new TimelineLite()
  .staggerFrom(polygons,1,{
    size: 0,
    ease: Cubic.easeOut,
  delay: 0.5,
  },0.5);

var tl = new TimelineMax({
    repeat: -1,
    //yoyo: true
  })
  .staggerTo(polygons,4,{
    y: height,
    rotation: 2,
    ease: Bounce.easeOut
  },0.5)
  .staggerTo(polygons,2,{
    y: 0,
    ease: Cubic.easeInOut
  },0.5);

tl.play();
