// Output Dimensions
var canvasWidth = 300;
var canvasHeight = 300;

// Square Attributes
var squareSize = 30;
var lineWidth = 0.5;

// Randomness Modifiers.
var translationMultiplier = 7;
var rotationMultiplier = 20;


var logoWidth = 1000;
var logoHeight = 1000;
var logoImg = new Image();
logoImg.src = 'cash-logo-1000.png';


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

var drawSquare = function(rotateAmt, x, y) {
  setTimeout(function() {
    ctx.save();

    var halfSquare = squareSize/2;
    var xScale = logoWidth/canvasWidth;
    var yScale = logoHeight/canvasHeight;
    var imageX = xScale * x - xScale * halfSquare;
    var imageY = yScale * y - xScale * halfSquare;

    ctx.translate(x - halfSquare, y - halfSquare);
    ctx.rotate(rotateAmt);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(1, 1, squareSize, squareSize);
    ctx.stroke();

    ctx.drawImage(logoImg, imageX, imageY, squareSize * xScale, squareSize * yScale,
      0, 0, squareSize, squareSize);

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.rect(0, 0, squareSize, squareSize);
    ctx.stroke();

    ctx.restore();
  }, 1000);
};

// Vertical Step
for(var y = squareSize; y <= canvasHeight - squareSize; y += squareSize) {
  // Horizontal Step
  for(var x = squareSize; x <= canvasWidth - squareSize; x += squareSize) {

    var progressY = y / canvasHeight;
    var plusOrMinusRotation = Math.random() < 0.5 ? -1 : 1;
    var rotateAmt = progressY * Math.PI / 180 * plusOrMinusRotation * rotationMultiplier * Math.random();

    var plusOrMinusOffset = Math.random() < 0.5 ? -1 : 1;
    var translateAmtX = progressY * plusOrMinusOffset * translationMultiplier * Math.random();
    var translateAmtY = progressY * plusOrMinusOffset * translationMultiplier * Math.random();

    drawSquare(rotateAmt, x + translateAmtX, y + translateAmtY);
  }
}
