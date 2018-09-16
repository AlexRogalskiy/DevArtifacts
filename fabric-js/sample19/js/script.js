(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');
  fabric.Object.prototype.transparentCorners = false;

  function loadPattern(url) {
    fabric.util.loadImage(url, function(img) {
      text.set('fill', new fabric.Pattern({
        source: img,
        repeat: document.getElementById('repeat').value
      }));
      shape.set('fill', new fabric.Pattern({
        source: img,
        repeat: document.getElementById('repeat').value
      }));
      canvas.renderAll();
    });
  }

  var text = new fabric.Text('Honey,\nI\'m subtle', {
    fontSize: 250,
    left: 0,
    top: 0,
    lineHeight: 1,
    originX: 'left',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    statefullCache: true,
    scaleX: 0.4,
    scaleY: 0.4
  });
  var shape = new fabric.Rect({
    width: 200,
    height: 100,
    left: 10,
    top: 300,
  });
  canvas.add(text, shape);

  loadPattern('./images/honey_im_subtle.png');

  document.getElementById('patterns').onchange = function() {
    loadPattern('./images/' + this.value);
  };
  document.getElementById('repeat').onchange = function() {
    text.fill.repeat = this.value;
    canvas.renderAll();
  };
})();
