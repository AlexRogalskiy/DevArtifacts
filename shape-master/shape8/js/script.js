var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = window.innerWidth,
  cx = cw / 2;
var ch = canvas.height = window.innerHeight,
  cy = ch / 2;
var rad = Math.PI / 180;
var elId = null;
var arrastrar = false;
var spring = .005; //elasticidad
var sprng = true;
var friccion = .97;
var destRy = [];
var anclas = 8;
var colores = [45, 145, 205, 325];

var m = {
  x: cx,
  y: cy
}
var o = {
    x: cx,
    y: cy,
    r: 35,
    velocidadX: 0,
    velocidadY: 0
  } //la pelota 

function Destino(o, n) {
  var rand = randomIntFromInterval(180, 250);
  var a = 360 / anclas;
  this.A = randomIntFromInterval(n * a, (n + 1) * a);
  this.r = randomIntFromInterval(15, 25);
  this.x = o.x + rand * Math.cos(this.A * rad);
  this.y = o.y + rand * Math.sin(this.A * rad);
  this.hue = colores[randomIntFromInterval(0, colores.length - 1)];
}

for (var i = 0; i < anclas; i++) {
  var dest = new Destino(o, i);
  destRy.push(dest);
}

function Animacion() {
  elId = window.requestAnimationFrame(Animacion);
  ctx.clearRect(0, 0, cw, ch);
  
  if (arrastrar) {
    o.x = m.x + o.deltax;
    o.y = m.y + o.deltay;
    sprng = false;
  }
  
  dibujarPelota(o);
  ctx.globalCompositeOperation = "destination-over";
  dibujarPuntos(destRy, o);
  if (sprng) {
    for (var i = 0; i < destRy.length; i++) {
      movimiento(o, destRy[i]);
    }
  }

}

function dibujarPelota(o) {
  ctx.fillStyle = Grd(o.x, o.y, o.r, 25);
  ctx.beginPath();
  ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
  ctx.fill();
  if (ctx.isPointInPath(m.x, m.y)) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
}

function movimiento(o, destino) {
  var distanciaX = (destino.x - o.x);
  var distanciaY = (destino.y - o.y);
  var accelerationX = distanciaX * spring;
  var accelerationY = distanciaY * spring;
  o.velocidadX += accelerationX;
  o.velocidadY += accelerationY;

  o.velocidadX *= friccion;
  o.velocidadY *= friccion;

  o.x += o.velocidadX;
  o.y += o.velocidadY;

  return o;
}

function dibujarPuntos(ry, o) {
  for (var i = 0; i < ry.length; i++) {
    ctx.fillStyle = Grd(ry[i].x, ry[i].y, ry[i].r, ry[i].hue);
    ctx.beginPath();
    ctx.arc(ry[i].x, ry[i].y, ry[i].r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#E0E4CC";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(ry[i].x, ry[i].y);
    ctx.stroke();
  }
}

// EVENTOS

canvas.addEventListener("mousedown", function(evt) {
  m = oMousePos(canvas, evt);

  ctx.beginPath()
  ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
  if (ctx.isPointInPath(m.x, m.y)) {
    o.deltax = o.x - m.x;
    o.deltay = o.y - m.y;
    arrastrar = true;
    sprng = false;
  }
}, false);

canvas.addEventListener("mousemove", function(evt) {

  m = oMousePos(canvas, evt);
  /*if (arrastrar) {
    o.x = m.x + o.deltax;
    o.y = m.y + o.deltay;
    sprng = false;
  }*/
}, false);

canvas.addEventListener("mouseup", function(evt) {
  arrastrar = false;
  sprng = true;
}, false);

canvas.addEventListener("mouseout", function(evt) {
  arrastrar = false;
  sprng = true;
}, false);

function oMousePos(canvas, evt) {
  var ClientRect = canvas.getBoundingClientRect();
  return { //objeto
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}

function randomIntFromInterval(mn, mx) {
  return ~~(Math.random() * (mx - mn + 1) + mn);
}

function Grd(x, y, r, h) {
  grd = ctx.createRadialGradient(x - .2 * r, y - .6 * r, 0, x - .2 * r, y - .6 * r, r);
  grd.addColorStop(0, 'hsl(' + h + ',100%,60%)');
  grd.addColorStop(0.4, 'hsl(' + h + ',100%,40%)');
  grd.addColorStop(1, 'hsl(' + h + ',100%,30%)');
  return grd;
}

function Init() {

  if (elId) {
    window.cancelAnimationFrame(elId);
    elId = null;
  }

  cw = canvas.width = window.innerWidth,
    cx = cw / 2;
  ch = canvas.height = window.innerHeight,
    cy = ch / 2;

  o = {
      x: cx,
      y: cy,
      r: 35,
      velocidadX: 0,
      velocidadY: 0
    } //la pelota 

  destRy.length = 0;
  for (var i = 0; i < anclas; i++) {
    var dest = new Destino(o, i);
    destRy.push(dest);
  }

  Animacion();

};

window.setTimeout(function() {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);