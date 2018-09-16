  this.__canvases = [ ];
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  
  (function(){
  var canvas = new fabric.Canvas('c1');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));

  canvas.selectionColor = 'rgba(0,255,0,0.3)';
  canvas.selectionBorderColor = 'red';
  canvas.selectionLineWidth = 5;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c3');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));

  canvas.item(0).set({
    borderColor: 'red',
    cornerColor: 'green',
    cornerSize: 6,
    transparentCorners: false
  });
  canvas.setActiveObject(canvas.item(0));
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c19');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));

  canvas.item(0).set({
    borderColor: 'gray',
    cornerColor: 'black',
    cornerSize: 12,
    transparentCorners: true
  });
  canvas.setActiveObject(canvas.item(0));
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c15');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.item(0).hasBorders = false;
  canvas.setActiveObject(canvas.item(0));
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c16');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.item(0).hasControls = false;
  canvas.setActiveObject(canvas.item(0));
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c10');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.item(0).hasControls = canvas.item(0).hasBorders = false;

  canvas.on({
    'mouse:down': function(e) {
      if (e.target) {
        e.target.opacity = 0.5;
        canvas.renderAll();
      }
    },
    'mouse:up': function(e) {
      if (e.target) {
        e.target.opacity = 1;
        canvas.renderAll();
      }
    },
    'object:moved': function(e) {
      e.target.opacity = 0.5;
    },
    'object:modified': function(e) {
      e.target.opacity = 1;
    }
  });
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c11');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.hoverCursor = 'pointer';
  this.__canvases.push(canvas);
})();
  
  (function(){
  var canvas = new fabric.Canvas('c12');
  canvas.add(new fabric.Rect({ left: 110, top: 110, fill: '#f0f', width: 50, height: 50 }));
  canvas.add(new fabric.Rect({ left: 50, top: 50, fill: '#77f', width: 40, height: 40 }));

  canvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });

  canvas.hoverCursor = 'pointer';

  function animate(e, dir) {
    if (e.target) {
      fabric.util.animate({
        startValue: e.target.get('angle'),
        endValue: e.target.get('angle') + (dir ? 10 : -10),
        duration: 100,
        onChange: function(value) {
          e.target.setAngle(value);
          canvas.renderAll();
        },
        onComplete: function() {
          e.target.setCoords();
        }
      });
      fabric.util.animate({
        startValue: e.target.get('scaleX'),
        endValue: e.target.get('scaleX') + (dir ? 0.2 : -0.2),
        duration: 100,
        onChange: function(value) {
          e.target.scale(value);
          canvas.renderAll();
        },
        onComplete: function() {
          e.target.setCoords();
        }
      });
    }
  }
  canvas.on('mouse:down', function(e) { animate(e, 1); });
  canvas.on('mouse:up', function(e) { animate(e, 0); });
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c2');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.selection = false;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c4');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.add(new fabric.Rect({ left: 50, top: 50, fill: 'green', width: 30, height: 30 }));
  canvas.add(new fabric.Rect({ left: 150, top: 50, fill: 'green', width: 30, height: 30 }));
  canvas.add(new fabric.Rect({ left: 150, top: 150, fill: 'green', width: 30, height: 30 }));
  canvas.add(new fabric.Rect({ left: 50, top: 150, fill: 'green', width: 30, height: 30 }));

  canvas.item(0).selectable = false;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c5');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.backgroundColor = 'rgba(0,0,255,0.3)';
  canvas.renderAll();
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c17');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.setBackgroundImage('../assets/pug.jpg', canvas.renderAll.bind(canvas));
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c13');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.setOverlayImage('../assets/jail_cell_bars.png', canvas.renderAll.bind(canvas));
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c6');
  canvas.add(new fabric.Rect({ width: 50, height: 50, fill: '#77f', top: 100, left: 100 }));
  canvas.item(0).lockRotation = true;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c7');
  canvas.add(new fabric.Rect({ width: 50, height: 50, fill: '#77f', top: 100, left: 100 }));
  canvas.item(0).lockScalingX = canvas.item(0).lockScalingY = true;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c8');
  canvas.add(new fabric.Rect({ width: 50, height: 50, fill: '#77f', top: 100, left: 100 }));
  canvas.item(0).lockMovementX = true;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c9');
  canvas.add(new fabric.Rect({ width: 50, height: 50, fill: '#77f', top: 100, left: 100 }));
  canvas.item(0).lockMovementY = true;
  this.__canvases.push(canvas);
})();

(function(){
  var canvas = new fabric.Canvas('c18');

  canvas.add(new fabric.Rect({ width: 50, height: 50, fill: '#77f', top: 75, left: 75 }));
  canvas.item(0).hasRotatingPoint = true;

  canvas.add(new fabric.Circle({ radius: 40, fill: '#f55', top: 125, left: 125, scaleY: 0.5, flipY: true }));
  canvas.item(1).hasRotatingPoint = true;

  this.__canvases.push(canvas);
})();

