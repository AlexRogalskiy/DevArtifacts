(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

  fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
    return {
      left: object.left + this._offset.left,
      top: object.top + this._offset.top
    };
  }

  var btn = document.getElementById('inline-btn'),
      btnWidth = 85,
      btnHeight = 18;

  function positionBtn(obj) {
    var absCoords = canvas.getAbsoluteCoords(obj);

    btn.style.left = (absCoords.left - btnWidth / 2) + 'px';
    btn.style.top = (absCoords.top - btnHeight / 2) + 'px';
  }

  fabric.Image.fromURL('./images/pug.jpg', function(img) {

    canvas.add(img.set({ left: 250, top: 250, angle: 30 }).scale(0.25));

    img.on('moving', function() { positionBtn(img) });
    img.on('scaling', function() { positionBtn(img) });
    positionBtn(img);
  });
})();
