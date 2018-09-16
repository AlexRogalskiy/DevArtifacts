(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');
  fabric.Object.prototype.transparentCorners = false;

  var $ = function(id){return document.getElementById(id)};

  var rect = new fabric.Rect({
    width: 100,
    height: 100,
    top: 100,
    left: 100,
    fill: 'rgba(255,0,0,0.5)'
  });

  canvas.add(rect);

  var angleControl = $('angle-control');
  angleControl.oninput = function() {
    rect.set('angle', parseInt(this.value, 10)).setCoords();
    canvas.requestRenderAll();
  };

  var scaleControl = $('scale-control');
  scaleControl.oninput = function() {
    rect.scale(parseFloat(this.value)).setCoords();
    canvas.requestRenderAll();
  };

  var topControl = $('top-control');
  topControl.oninput = function() {
    rect.set('top', parseInt(this.value, 10)).setCoords();
    canvas.requestRenderAll();
  };

  var leftControl = $('left-control');
  leftControl.oninput = function() {
    rect.set('left', parseInt(this.value, 10)).setCoords();
    canvas.requestRenderAll();
  };

  var skewXControl = $('skewX-control');
  skewXControl.oninput = function() {
    rect.set('skewX', parseInt(this.value, 10)).setCoords();
    canvas.requestRenderAll();
  };

  var skewYControl = $('skewY-control');
  skewYControl.oninput = function() {
    rect.set('skewY', parseInt(this.value, 10)).setCoords();
    canvas.requestRenderAll();
  };

  function updateControls() {
    scaleControl.value = rect.scaleX;
    angleControl.value = rect.angle;
    leftControl.value = rect.left;
    topControl.value = rect.top;
    skewXControl.value = rect.skewX;
    skewYControl.value = rect.skewY;
  }
  canvas.on({
    'object:moving': updateControls,
    'object:scaling': updateControls,
    'object:resizing': updateControls,
    'object:rotating': updateControls,
    'object:skewing': updateControls
  });
})();
