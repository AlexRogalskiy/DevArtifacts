// Original inspriation based on the work at
// https://github.com/tholman/generative-artistry/blob/master/content/tutorials/cubic-disarray.md

// Output Dimensions
var canvasWidth = 300;
var canvasHeight = 600;

// Square Attributes
var squareSize = 30;
var lineWidth = 2;

// Randomness Modifiers.
var translationMultiplier = 10;
var rotationMultiplier = 18;

var ctx = (function initializeCanvas() {
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext('2d');
  var pixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvasWidth * pixelRatio;
  canvas.height = canvasHeight * pixelRatio;
  ctx.scale(pixelRatio, pixelRatio);
  ctx.lineWidth = lineWidth;
  return ctx;
}());

var drawSquare = function(width, height) {
  ctx.beginPath();
  ctx.rect(-width/2, -height/2, width, height);
  ctx.stroke();
};

// Vertical Step
for(var y = squareSize; y <= canvasHeight - squareSize; y += squareSize) {
  // Horizontal Step
  for(var x = squareSize; x <= canvasWidth - squareSize; x += squareSize) {
    ctx.save();

    var progressY = y / canvasHeight;
    var plusOrMinusRotation = Math.random() < 0.5 ? -1 : 1;
    var rotateAmt = progressY * Math.PI / 180 * plusOrMinusRotation * rotationMultiplier * Math.random();

    var plusOrMinusOffset = Math.random() < 0.5 ? -1 : 1;
    var translateAmtX = progressY * plusOrMinusOffset * translationMultiplier * Math.random();
    var translateAmtY = progressY * plusOrMinusOffset * translationMultiplier * Math.random();

    ctx.translate(x + translateAmtX, y + translateAmtY);
    ctx.rotate(rotateAmt);

    drawSquare(squareSize, squareSize);
    ctx.restore();
  }
}
