var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.width = "100%";
canvas.style.height = "100%";

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var _ctx = canvas.getContext('2d');

var flr = Math.floor;

function rnd(num1) {
  return flr(Math.random() * num1) + 1;
}
var geo = (function() {
    var mod = {};
    mod.vec2 = function(x,y) {
      this.x = x;
      this.y = y;
      this.add = function(v) {
        this.x += v.x;
        this.y += v.y;
      }
    }
    return mod;
  })();

var app = (function(geo, ctx) {
  var module = {};
  
  var maxVel = 3;
  //var numOfDots = 70;
  var numOfDots = (canvas.width * canvas.height) > 100000 ? 70 : 10;
  var dotSize = 3;
  var hs = dotSize / 2;
  var dots = [];
  
  function genVel() {
    return new geo.vec2(rnd(5),rnd(5));
  }
  
  function dot(x,y, vel) {
    this.pos = new geo.vec2(x, y);
    this.vel = vel;
    this.getDist = function(dot2) {
      let finalX = this.pos.x < dot2.pos.x ? (this.pos.x - dot2.pos.x) : (dot2.pos.x - this.pos.x);
      let finalY = this.pos.y < dot2.pos.y ? (this.pos.y - dot2.pos.y) : (dot2.pos.y - this.pos.y);
      
      return Math.sqrt((finalX * finalX) + (finalY * finalY));
    }
  }
  
  module.init = function() {
    dots = [];
    for (var i=0; i<numOfDots; i++) {
      dots.push(
        new dot(rnd(canvas.width), rnd(canvas.height), genVel())
      );
    }
  };
  
  module.render = function() {
    ctx.fillStyle = 'rgba(50,50,50,0.6)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    // draw lines for close dots
    let colorOnePercent = flr(255 / 100);
    for (let d=0,dlen = dots.length; d<dlen; d++) {
      let firstDot = dots[d];
      for (let d2=0, d2len = dots.length; d2<d2len; d2++) {
        let secondDot = dots[d2];
        if (d==d2) {
          continue;
        }
        
        let distFound = flr(firstDot.getDist(secondDot));
        
        if (distFound < 100) {
          let intense = 300 - (colorOnePercent * distFound);
          ctx.strokeStyle = 'rgb(' + intense + ', ' + intense + ', ' + intense + ')';
        
          ctx.beginPath();
          ctx.moveTo(firstDot.pos.x, firstDot.pos.y);
          ctx.lineTo(secondDot.pos.x, secondDot.pos.y);
          ctx.stroke();
        }
      }
    }
    
    ctx.fillStyle = '#bbb';
    for(let i=0,len=dots.length;i<len;i++) {
      let _dot = dots[i];
      ctx.beginPath();
      ctx.arc(_dot.pos.x, _dot.pos.y, dotSize, 0, Math.PI * 2, true);
      ctx.fill();
      
      let testPos = new geo.vec2(_dot.pos.x, _dot.pos.y);
      testPos.add(_dot.vel);
      
      let w = canvas.width,
          h = canvas.height;
      if (testPos.x - hs < 0) {
        _dot.vel.x = rnd(maxVel);
      }
      if (testPos.y - hs < 0) {
        _dot.vel.y = rnd(maxVel);
      }
      if (testPos.y + hs > h) {
        _dot.vel.y = 0 - rnd(maxVel);
      }
      if (testPos.x + hs > w) {
        _dot.vel.x = 0 - rnd(maxVel);
      }
      
      _dot.pos.add(_dot.vel);
    }
    
    window.requestAnimationFrame(module.render);
  }
  
  return module;
  })(geo, _ctx);


app.init();
app.render();

window.onresize = function() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
};