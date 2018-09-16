  (function() {
  var canvas = this.__canvas = new fabric.Canvas('canvas');
  fabric.Image.fromURL('./images/printio.jpg', function(image) {
    canvas.add(image);
    image.transformMatrix = [1, 0, 0, 1, 0, 0];
  });

  function update() {
    canvas.requestRenderAll();
    var matrix = canvas.item(0).transformMatrix;
    document.getElementById('a-val').innerHTML = matrix[0];
    document.getElementById('b-val').innerHTML = matrix[1];
    document.getElementById('c-val').innerHTML = matrix[2];
    document.getElementById('d-val').innerHTML = matrix[3];
    document.getElementById('tx-val').innerHTML = matrix[4];
    document.getElementById('ty-val').innerHTML = matrix[5];
    document.getElementById('scaleX').innerHTML = canvas.item(0).scaleX;
    document.getElementById('scaleY').innerHTML = canvas.item(0).scaleY;
    document.getElementById('skewX').innerHTML = canvas.item(0).skewX;
    document.getElementById('skewY').innerHTML = canvas.item(0).skewY;
    document.getElementById('top').innerHTML = canvas.item(0).top;
    document.getElementById('left').innerHTML = canvas.item(0).left;
    document.getElementById('flipX').innerHTML = canvas.item(0).flipX;
    document.getElementById('flipY').innerHTML = canvas.item(0).flipY;
    document.getElementById('angle').innerHTML = canvas.item(0).angle;
  }

  document.getElementById('a').oninput = function() {
    canvas.item(0).transformMatrix[0] = parseFloat(this.value, 10);
    update();
  };
  document.getElementById('b').oninput = function() {
    canvas.item(0).transformMatrix[1] = parseFloat(this.value, 10);
    update();
  };
  document.getElementById('c').oninput = function() {
    canvas.item(0).transformMatrix[2] = parseFloat(this.value, 10);
    update();
  };
  document.getElementById('d').oninput = function() {
    canvas.item(0).transformMatrix[3] = parseFloat(this.value, 10);
    update();
  };
  document.getElementById('tx').oninput = function() {
    canvas.item(0).transformMatrix[4] = parseFloat(this.value, 10);
    update();
  };
  document.getElementById('ty').oninput = function() {
    canvas.item(0).transformMatrix[5] = parseFloat(this.value, 10);
    update();
  };
  document.getElementById('merge').onclick = function() {
    var obj = canvas.item(0);
    var currentT = obj.calcTransformMatrix();
    var transformMatrix = obj.transformMatrix;
    var mT = fabric.util.multiplyTransformMatrices(currentT, transformMatrix);
    var options = fabric.util.qrDecompose(mT);
    var newCenter = { x: options.translateX, y: options.translateY };
    obj.transformMatrix = [ 1,0,0,1,0,0];
    obj.flipX = false;
    obj.flipY = false;
    obj.set(options);
    obj.setPositionByOrigin(newCenter, 'center', 'center');
    document.getElementById('numbers').reset();
    update();
  };
})();