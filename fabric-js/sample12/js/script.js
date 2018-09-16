(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');

  var rect = new fabric.Rect({
    left: 150,
    top: 200,
    originX: 'left',
    originY: 'top',
    width: 150,
    height: 120,
    angle: -10,
    fill: 'rgba(255,0,0,0.5)',
    transparentCorners: false
  });

  canvas.add(rect).setActiveObject(rect);

  function observeBoolean(property) {
    document.getElementById(property).onclick = function() {
      canvas.item(0)[property] = this.checked;
      canvas.renderAll();
    };
  }

  function observeNumeric(property) {
    document.getElementById(property).oninput = function() {
      canvas.item(0)[property] = parseFloat(this.value);
      canvas.renderAll();
    };
  }

  function observeValue(property) {
    document.getElementById(property).oninput = function() {
      canvas.item(0)[property] = this.value;
      canvas.renderAll();
    };
  }

  function observeRadio(property) {
    document.getElementById(property).onchange = function() {
      var name = document.getElementById(this.id).name;
      canvas.item(0)[name] = this.value;
      canvas.renderAll();
    };
  }

  function observeOptionsList(property) {
    var list = document.querySelectorAll('#' + property +
    ' [type="checkbox"]');
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].onchange = function() {
        canvas.item(0)[property](this.name, this.checked);
        canvas.renderAll();
      };
    };
  }

  observeBoolean('hasControls');
  observeBoolean('hasBorders');
  observeBoolean('hasRotatingPoint');
  observeBoolean('visible');
  observeBoolean('selectable');
  observeBoolean('evented');
  observeBoolean('transparentCorners');
  observeBoolean('centeredScaling');
  observeBoolean('centeredRotation');

  observeNumeric('padding');
  observeNumeric('cornerSize');
  observeNumeric('rotatingPointOffset');
  observeValue('borderColor');
  observeValue('cornerColor');
  observeValue('cornerStrokeColor');
  observeRadio('cornerStyle1');
  observeRadio('cornerStyle2');

  observeOptionsList('setControlVisible');
})();
