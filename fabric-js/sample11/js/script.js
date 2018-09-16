(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');
  fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
  fabric.Object.prototype.transparentCorners = false;

  for (var i = 0, len = 5; i < len; i++) {
    for (var j = 0, jlen = 5; j < jlen; j++) {
      fabric.Sprite.fromURL('./images/sprite.png', createSprite(i, j));
    }
  }

  function createSprite(i, j) {
    return function(sprite) {
      sprite.set({
        left: i * 100 + 50,
        top: j * 100 + 50,
        angle: fabric.util.getRandomInt(-30, 30)
      });
      canvas.add(sprite);
      setTimeout(function() {
        sprite.play();
      }, fabric.util.getRandomInt(1, 10) * 100);
    };
  }

  (function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
  })();
})();
