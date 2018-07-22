window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
var c, $;
var balls, planks;
var fps = 30;

function go(start) {
  c = document.getElementById("canv");
  $ = c.getContext("2d");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  $.lineWidth = 10;
  balls = new Balls();
  planks = new Plank();
  if (start) {
    draw();
  }
}

function draw() {
  $.fillStyle = 'hsla(252, 95%, 85%, 1)';
  $.fillRect(0, 0, c.width, c.height);
  var t = "Detour".split("").join(String.fromCharCode(0x2004));
  $.font = "5em Poiret One";
  $.fillStyle = 'hsla(213, 95%, 15%, 1)';
  $.fillText(t, c.width / 2 - 180, c.height / 2);
  var t2 = "Drag To Draw Through Trail";
  $.font = "2em Poiret One";
  $.fillStyle = 'hsla(213, 95%, 15%, 1)';
  $.fillText(t2, c.width / 2 - 180, c.height / 2 + 100);
  balls.fr(balls, $, planks);
  planks.draw(planks, $);
  window.requestAnimFrame(draw);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
};

var Ball = function() {
  this.x = c.width / 2;
  this.y = 0;
  this.r = random(2, 20);
  this.col = 'rgb(' + Math.floor(Math.random() * 130) + ',' + Math.floor(Math.random() * 80) + ',' + Math.floor(Math.random() * 256) + ')';
  this.g = 980;
  this.vx = 0;
  this.vy = 0;
  this.draw = function(it, $, planks) {
    if (!it.roll(it, planks)) {
      return false;
    }
    $.strokeStyle = "hsla(0,5%,5%,1)";
    $.fillStyle = it.col;
    $.beginPath();
    $.arc(it.x, it.y, it.r, 0, 360, false);
    $.fill();
    $.closePath();
    return true;
  }
  this.bounds = function(it, nx, ny) {
    var left = it.x > nx ? nx : it.x;
    var right = it.x > nx ? it.x : nx;
    var top = it.y > ny ? ny : it.y;
    var bottom = it.y > ny ? it.y : ny;
    return [left, top, right, bottom];
  }
  this.roll = function(it, planks) {
    it.vy += (1 / fps) * it.g;
    var nY = it.y + (1 / fps) * it.vy;
    var nX = it.x + (1 / fps) * it.vx;
    var s = planks.size(planks);
    for (var i = 0; i < s; i++) {
      var _p = planks.planks[i];
      var b = (_p.ex - _p.sx) * (nY - it.y) - (_p.ey - _p.sy) * (nX - it.x);
      if (b == 0)
        continue;
      var ang = [it.x - _p.sx, it.y - _p.sy];
      var dr = ((nY - it.y) * ang[0] - (nX - it.x) * ang[1]) / b;
      var ds = ((_p.ey - _p.sy) * ang[0] - (_p.ex - _p.sx) * ang[1]) / b;
      if (dr > 0 && dr < 1 && ds > 0 && ds < 1) {

        var a = (_p.ex == _p.sx) ? 0 : (_p.ey - _p.sy) / (_p.ex - _p.sx);
        var b = -(a * _p.sx) - _p.sy;
        var a1 = (nX == it.x) ? 0 : (nY - it.y) / (nX - it.x);
        var b1 = (a1 * it.x) - it.y;
        var r = Math.sqrt(random(5, 7) / 10);
        if (a1 * a == -1) {
          it.vy *= -r;
          it.vx *= -r;
        } else {
          var a = (_p.ex == _p.sx) ? 0 : -1 / ((_p.ey - _p.sy) / (_p.ex - _p.sx));
          var b = -(a * _p.sx) + _p.sy;
          var p = [1, a + b];
          var p2 = [2, a * 2 + b];
          var w = Math.sqrt(Math.pow(p2[0] - p[0], 2) + Math.pow(p2[1] - p[1], 2));
          var ref = it.rebound([it.vx, it.vy], [(p2[0] - p[0]) / w, (p2[1] - p[1]) / w]);
          it.vx = r * ref[0];
          it.vy = r * ref[1];
        }
        nY = it.y + (1 / fps) * it.vy;
        nX = it.x + (1 / fps) * it.vx;
        break;
      }
    }
    it.y = nY;
    it.x = nX;
    if (c.height < it.y || c.width < it.x || 0 > it.x) {
      return false;
    }
    return true;
  }
  this.rebound = function(sp, n) {
    var t = -(n[0] * sp[0] + n[1] * sp[1]) / (n[0] * n[0] + n[1] * n[1]);
    return [sp[0] + t * n[0] * 2.0, sp[1] + t * n[1] * 2.0];
  }
}

var Balls = function() {
  this.balls = [new Ball()];
  this.f = 0;
  this.fr = function(it, col, _p) {
    it.f++;
    var size = it.balls.length;
    if (it.f >= Balls.nxt) {
      it.f = 0;
      if (size < Balls.max) {
        it.gen(it);
      }
    }
    for (var i = 0; i < size; i++) {
      var b = it.balls[i];
      if (!b.draw(b, col, _p)) {
        it.balls.splice(i, 1);
        i--;
        size--;
      }
    }
  }
  this.gen = function(it) {
    it.balls.push(new Ball());
  }
}
Balls.nxt = 7;
Balls.max = 100;
var Line = function(x, y) {
  this.sx = x;
  this.sy = y;
  this.ex = x;
  this.ey = y;
  this.col = 'rgb(' + Math.floor(Math.random() * 130) + ',' + Math.floor(Math.random() * 80) + ',' + Math.floor(Math.random() * 256) + ')';

  this.bounds = function(it) {
    var left = it.sx > it.ex ? it.ex : it.sx;
    var right = it.sx > it.ex ? it.sx : it.ex;
    var top = it.sy > it.ey ? it.ey : it.sy;
    var bottom = it.sy > it.ey ? it.sy : it.ey;
    return [left, top, right, bottom];
  }
  this.draw = function(it, $) {
    $.strokeStyle = it.col;
    $.shadowColor = 'hsla(0,0%,0%,.3)';
    $.shadowBlur = 55;
    $.shadowOffsetX = 10;
    $.shadowOffsetY = 10;
    $.beginPath();
    $.moveTo(it.sx, it.sy);
    $.lineTo(it.ex, it.ey);
    $.closePath();
    $.stroke();
  }
  this.checked = function(it) {
    return Math.sqrt(Math.pow(it.ex - it.sx, 2) + Math.pow(it.ey - it.sy, 2)) > Line.min;
  }
}
Line.min = 50;
var Plank = function() {

  this.planks = [];
  this.curr = null;
  this.size = function(it) {
    return it.planks.length;
  }
  this.draw = function(it, $) {

    var s = it.planks.length;
    for (var i = 0; i < s; i++) {
      var _p = it.planks[i];
      _p.draw(_p, $);
    }
    if (it.curr != null) {
      it.curr.draw(it.curr, $);
    }
  }
  this.start = function(it, x, y) {
    if (it.curr == null)
      it.curr = new Line(x, y);
  }
  this.fin = function(it, x, y) {
    it.curr.ex = x;
    it.curr.ey = y;
    if (it.curr.checked(it.curr)) {
      if (it.planks.length >= Plank.max)
        it.planks.shift();
      it.planks.push(it.curr);
    }
    it.curr = null;
  }
  this.roll = function(it, x, y) {
    if (it.curr != null) {
      it.curr.ex = x;
      it.curr.ey = y;
    }
  }
}
Plank.max = 10;

window.addEventListener("mousedown", msdn, false);
window.addEventListener("mouseup", msup, true);
window.addEventListener("mousemove", roll, true);
window.addEventListener("resize", resize, false);

function msdn(e) {
  planks.start(planks, e.x + window.pageXOffset, e.y + window.pageYOffset);
}

function msup(e) {
  planks.fin(planks, e.x + window.pageXOffset, e.y + window.pageYOffset);
}

function roll(e) {
  planks.roll(planks, e.x + window.pageXOffset, e.y + window.pageYOffset);
}

function resize() {
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
  c.style.position = 'absolute';
  c.style.left = (window.innerWidth - w) *
    .01 + 'px';
  c.style.top = (window.innerHeight - h) *
    .01 + 'px';
  go();
};

go(true);