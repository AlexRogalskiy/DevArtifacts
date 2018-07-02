function Elem (id) {
  this.id = id;
  this.ref = document.getElementById(this.id);
}

Elem.prototype.spin = function (axis, deg) {
  var original = this.ref.style.webkitTransform;
}
Elem.prototype.spinAll = function () {
  var Xaxis, Yaxis, Zaxis, transZ;
  Xaxis = document.getElementById('controlX').value + 'deg';
  Yaxis = document.getElementById('controlY').value + 'deg';
  Zaxis = document.getElementById('controlZ').value + 'deg';
  transZ = document.getElementById('transZ').value + 'em';
  this.ref.style.webkitTransform = 'translateX(20em) translateY(5em) rotateX('+Xaxis+') rotateY('+Yaxis+') rotateZ('+Zaxis+') translateZ('+transZ+')';
}

var cube = new Elem('cubicle'),
    button = document.getElementById('spinBtn');

button.addEventListener('click',function (e) {
  cube.spinAll();
},false);
