(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');
  canvas.setHeight(1000);
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.objectCaching = true;

  fabric.loadSVGFromURL('./images/tiger2.svg', function(objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
    obj.scale(0.5);

    // load shapes
    for (var i = 1; i < 4; i++) {
      for (var j = 1; j < 6; j++) {
        obj.clone(function(i, j) {
          return function(clone) {
            clone.set({
              left: i * 200 - 100,
              top: j * 200 - 100
            });
            canvas.add(clone);
            animate(clone);
          };
        }(i, j));
      }
    }
  });

  function animate(obj) {
    obj.rotate(0).animate({ angle: 360 }, {
      duration: 3000,
      onComplete: function(){ animate(obj) },
      easing: function(t, b, c, d) { return c*t/d + b }
    });
  }

  function cache() {
    fabric.Object.prototype.objectCaching = !fabric.Object.prototype.objectCaching;
    canvas.forEachObject(function(obj, i) {
      obj.set('dirty', true);
    });
  }

  (function render(){
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
  })();

  document.getElementById('cache').onclick = cache;
})();
