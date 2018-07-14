var doc = document;
var canvas = doc.querySelector('#canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;

var maxSectionsInput = doc.querySelector('.js-maxSections');
var maxWidthInput = doc.querySelector('.js-maxWidth');
var controls = doc.querySelector('.controls');
var randomBtn = doc.querySelector('.js-random');
var downloadBtn = doc.querySelector('.js-download');

var maxSections = 150;
var maxLineWidth = 250;

var lineStep = 0;
var sectionLength = 0;
var rowLength = 0;
var xOffset = 0;

calsVars();

//---------------------------------------------

var colors = [
  'crimson',
  'tomato',
  'salmon',
  'orangered',
  'palegoldenrod',
  'khaki',
  'gold',
  'yellowgreen',
  'olive',
  'aquamarine',
  'mediumturquoise',
  'darkturquoise',
  'darkcyan',
  'skyblue',
  'cornflowerblue',
  'rebeccapurple',
  'purple',
  'darkviole'
];

function getColorPos(prevColorPos) {
  var colorPos = Math.floor(Math.random() * colors.length);

  while (colorPos === prevColorPos) {
    colorPos = Math.floor(Math.random() * colors.length);
  }

  prevColorPos = colorPos;
  return colorPos;
}

//---------------------------------------------

function drawSection(params) {
  var x = params.x;
  var y = params.y;
  var lineWidth = params.lineWidth;
  var color = params.color;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + sectionLength);
  ctx.stroke();
}

//---------------------------------------------

function drawBlock(x) {
  var lastColorPos = 0;
  var colorPos1 = null;
  var colorPos2 = null;

  for (var i = 0; i < maxSections; i++) {
    var lineWidth = maxLineWidth - lineStep * i;

    var currentColorPos1 = getColorPos(colorPos1);
    colorPos1 = currentColorPos1;
    var currentColorPos2 = getColorPos(colorPos2);
    colorPos2 = currentColorPos2;

    drawSection({
      x: x + maxLineWidth/2,
      y: i * sectionLength,
      lineWidth: lineWidth,
      color: colors[currentColorPos2]
    });

    drawSection({
      x: x - maxLineWidth,
      y: height - i * sectionLength,
      lineWidth: lineWidth,
      color: colors[currentColorPos1]
    });

  }
}

//---------------------------------------------

function drawCones() {
  for (var i = 0; i <= rowLength + 2; i++) {
    drawBlock((i - 1) * maxLineWidth + xOffset);
  }
}

//---------------------------------------------

function calsVars() {
  lineStep = maxLineWidth / maxSections;
  sectionLength = height / maxSections;
  rowLength = Math.round(width / maxLineWidth);
  xOffset = (width - rowLength * maxLineWidth) / 2;
}

function maxSectionsChange() {
  maxSections = +this.value;
  calsVars();
  drawCones();
}

function maxWidthChange() {
  maxLineWidth = +this.value;
  calsVars();
  drawCones();
}

//---------------------------------------------

function rand(min, max) {
  return Math.round(Math.random() *(max - min) + min);
}

function randomizeVals() {
  maxSections = rand(maxSectionsInput.min, maxSectionsInput.max);
  maxSectionsInput.value = maxSections;

  maxLineWidth = rand(maxWidthInput.min, maxWidthInput.max);
  maxWidthInput.value = maxLineWidth;

  calsVars();
  drawCones();
}

//---------------------------------------------

function download() {
  var dataUrl = canvas.toDataURL();
  downloadBtn.href = dataUrl;
}

//---------------------------------------------

drawCones();

maxSectionsInput.addEventListener('input', maxSectionsChange);
maxWidthInput.addEventListener('input', maxWidthChange);

randomBtn.addEventListener('click', randomizeVals);
downloadBtn.addEventListener('click', download);
