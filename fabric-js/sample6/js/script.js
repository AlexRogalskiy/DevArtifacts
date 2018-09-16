(function() {

  function add() {
    var red = new fabric.Rect({
      top: 100, left: 0, width: 80, height: 50, fill: 'red' });
    var blue = new fabric.Rect({
      top: 0, left: 100, width: 50, height: 70, fill: 'blue' });
    var green = new fabric.Rect({
      top: 100, left: 100, width: 60, height: 60, fill: 'green' });
    canvas.add(red, blue, green);
  }

  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c');
  var red = new fabric.Rect({
    top: 100, left: 0, width: 80, height: 50, fill: 'red' });
  var blue = new fabric.Rect({
    top: 0, left: 100, width: 50, height: 70, fill: 'blue' });
  var green = new fabric.Rect({
    top: 100, left: 100, width: 60, height: 60, fill: 'green' });
  fabric.Object.prototype.transparentCorners = false;
  canvas.add(red, blue, green)
  var group = $('group'),
      ungroup = $('ungroup'),
      multiselect = $('multiselect'),
      addmore = $('addmore'),
      discard = $('discard');

      addmore.onclick = add;

      multiselect.onclick = function() {
        canvas.discardActiveObject();
        var sel = new fabric.ActiveSelection(canvas.getObjects(), {
          canvas: canvas,
        });
        canvas.setActiveObject(sel);
        canvas.requestRenderAll();
      }

      group.onclick = function() {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'activeSelection') {
          return;
        }
        canvas.getActiveObject().toGroup();
        canvas.requestRenderAll();
      }

      ungroup.onclick = function() {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'group') {
          return;
        }
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
      }

      discard.onclick = function() {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }


})();
