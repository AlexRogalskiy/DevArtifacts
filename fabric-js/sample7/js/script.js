
var canvas = new fabric.Canvas('c');
fabric.Image.fromURL('./images/pug_small.jpg', function(img) {
  img.scale(0.5).set({
    left: 150,
    top: 150,
    angle: -15
  });
  canvas.add(img).setActiveObject(img);
});

var info = document.getElementById('info');

canvas.on({
  'touch:gesture': function() {
    var text = document.createTextNode(' Gesture ');
    info.insertBefore(text, info.firstChild);
  },
  'touch:drag': function() {
    var text = document.createTextNode(' Dragging ');
    info.insertBefore(text, info.firstChild);
  },
  'touch:orientation': function() {
    var text = document.createTextNode(' Orientation ');
    info.insertBefore(text, info.firstChild);
  },
  'touch:shake': function() {
    var text = document.createTextNode(' Shaking ');
    info.insertBefore(text, info.firstChild);
  },
  'touch:longpress': function() {
    var text = document.createTextNode(' Longpress ');
    info.insertBefore(text, info.firstChild);
  }
});