
var c = document.getElementById('canv');
var $ = c.getContext("2d");

var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;

window.addEventListener('resize', function() {
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
});

var pts = [0, 0, 0];
var vert = [];
var ln = [];
var _lns = [];

vert.push(
  [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],

  [0, 0, 1.5], [0, 0, -1.5], [1.5, 0, 0], [-1.5, 0, 0], [0, 1.5, 0], [0, -1.5, 0]
);

for (var i in vert) {
  var v = vert[i];
  v[0] *= 70;
  v[1] *= 70;
  v[2] *= 70;
}

ln.push(
  [0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]
);

_lns.push(
  [0, 3, 8], [1, 2, 8], [4, 7, 9], [5, 6, 9], [0, 6, 11], [2, 4, 11], [1, 7, 10], [3, 5, 10], [0, 5, 13], [1, 4, 13], [2, 7, 12], [3, 6, 12]
);
run();

function run() {
  window.requestAnimationFrame(run);
  go();
}

var t_ = 0;

function txt() {
  var t = "FlexMetrix".split("").join(String.fromCharCode(0x2004));
  $.font = "4.5em Poiret One";
  $.fillStyle = 'hsla(255,255%,255%,1)';
  $.fillText(t, (c.width - $.measureText(t).width) * 0.5, c.height * 0.89);
}

function go() {

  $.clearRect(0, 0, w, h);
  $.fillStyle = 'hsla(234, 20%, 25%, 1)';
  $.fillRect(0, 0, w, h);
  txt();
  pts[0] += .0013;
  pts[1] += .0023;
  pts[2] += .0033;
  t_++;
  var t = 55 * (Math.sin(t_ / 10));
  vert[8][2] = vert[10][0] = vert[12][1] = 55 + t;
  vert[9][2] = vert[11][0] = vert[13][1] = -55 - t;
  var _verts = [];

  for (var i in vert) {
    var v = vert[i];
    var y = v[1] * Math.cos(pts[0]) - v[2] * Math.sin(pts[0]);
    var z = v[2] * Math.cos(pts[0]) + v[1] * Math.sin(pts[0]);
    var x = v[0] * Math.cos(pts[1]) - z * Math.sin(pts[1]);
    z = z * Math.cos(pts[1]) + v[0] * Math.sin(pts[1]);
    var x_ = x * Math.cos(pts[2]) - y * Math.sin(pts[2]);
    y = y * Math.cos(pts[2]) + x * Math.sin(pts[2]);
    z += 180;
    var _nz = 260 / z;
    var _nx = x_ * _nz + w / 2;
    var _ny = y * _nz + h / 2;

    $.beginPath();
    $.arc(_nx, _ny, 3 * _nz, 0, Math.PI * 2, true);
    $.fillStyle = 'hsla(' + (i * 55) + ',100%, 60%, 0.95)';
    $.fill();
    $.closePath();

    _verts.push([_nx, _ny, z]);
  }

  for (var i in ln) {
    var l = ln[i];
    $.lineWidth = 10;
    $.beginPath();
    $.strokeStyle = 'hsla(201, 85%, 70%, 1)';
    $.moveTo(_verts[l[0]][0], _verts[l[0]][1]);
    $.lineTo(_verts[l[1]][0], _verts[l[1]][1]);
    $.stroke();
    $.closePath();
  }

  for (var i in _lns) {
    var _l = _lns[i];
    $.lineWidth = 4;
    $.beginPath();
    $.strokeStyle = 'hsla(' + (i * 55) + ',100%, 60%, 0.95)';
    $.moveTo(_verts[_l[0]][0], _verts[_l[0]][1]);
    $.bezierCurveTo(_verts[_l[2]][0], _verts[_l[2]][1], _verts[_l[2]][0], _verts[_l[2]][1], _verts[_l[1]][0], _verts[_l[1]][1]);
    $.stroke();
    $.closePath();
  }
}