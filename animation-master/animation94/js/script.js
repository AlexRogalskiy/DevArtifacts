var doc = document;
var canvas = doc.querySelector('#canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;

//---------------------------------------------

var maxSectionsInput = doc.querySelector('.js-maxSections');
var maxHeightInput = doc.querySelector('.js-maxHeight');
var controls = doc.querySelector('.controls');
var randomBtn = doc.querySelector('.js-random');
var downloadBtn = doc.querySelector('.js-download');

//---------------------------------------------

var treeHeight = height * 1.5;
var maxSections = 5;
var minLineWidth = 3;
var maxLineWidth = 40;
var space = 600;

var sectionLength = 0;
var rowLength = 0;
var xOffset = 0;

var header = 'font-size: 16px; font-weight: bold; color: royalblue;';
var bred = 'font-weight: bold;color: crimson;';

calcVars();

//---------------------------------------------

function calcVars() {
  sectionLength = treeHeight / maxSections;
  rowLength = Math.round(width / (maxLineWidth + space));
  xOffset = width / (rowLength + 1) - maxLineWidth;
}

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
  'darkviolet'
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

function drawArc(params) {
  var x = params.x;
  var y = params.y;
  var r = params.r || sectionLength / 2;
  var lineWidth = params.lineWidth || 0;
  var color = params.color || 'green';
  var acc = params.odd || false;

  ctx.fillStyle = color;

  var startAngle = 0;
  var endAngle = (Math.PI/180) * 360;

  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.arc(x, y, r, startAngle, endAngle, acc);
  ctx.fill();
}

//---------------------------------------------

function Branch(params) {
  this.type = params.type;
  this.left = params.left;
  this.bottom = params.bottom;
  this.bottomRight = params.bottomRight || this.bottom;
  this.bottomLeft = params.bottomLeft || this.bottom;
  this.max = params.max;
  this.level = params.level;
  this.currentStep = 1;
  this.colorPos = null;
  // Branch angle
  this.angle = params.angle || 0;
  // Branch direction
  this.maxLineWidth = params.maxLineWidth || maxLineWidth;
  this.lineStep = Math.round((this.maxLineWidth - minLineWidth) / this.max * 100) / 100;
  this.halfLineStep = this.lineStep / 2;
  this.maxSectionLength = params.maxSectionLength || sectionLength;

  this.xOffset = this.maxLineWidth / 2;

  this.sectionStart = {
    left: this.left,
    right: params.right || this.left + this.maxLineWidth,
    bottomRight: this.bottomRight,
    bottomLeft: this.bottomLeft,
    bottom: this.bottom,
    width: this.maxLineWidth
  };
  this.sectionEnd = {};

  this.drawSection();
}

//---------------------------------------------

Branch.prototype.endPoint = function () {
  if (this.angle === 0){
    return {x: 0, y: 0};
  }
  var Arad = this.angle * Math.PI / 180;
  var a = Math.round(Math.sin(Arad) * this.sectionLength);
  var b = Math.round(Math.cos(Arad) * this.sectionLength);

  return {x: b, y: a};
};

//---------------------------------------------

// It fixes too thin lines at the end of sections
Branch.prototype.endPointCorrect = function () {
  if (this.angle === 0){
    return {x: 0, y: 0};
  }

  var Arad = this.angle * Math.PI / 180;
  var a = Math.round(Math.sin(Arad) * this.sectionEnd.width);
  var b = Math.round(Math.cos(Arad) * this.sectionEnd.width);

  return {x: b, y: a};
};

//---------------------------------------------

Branch.prototype.drawSection = function() {

  var type = this.angle ? '/' : '|';

  this.colorPos = getColorPos(this.colorPos);
  this.color = colors[this.colorPos];
  ctx.fillStyle = this.color;

  this.sectionLength = rand(sectionLength/3, sectionLength);

  if (this.level === 0 ){
    this.sectionLength = rand(sectionLength/2, sectionLength * 1.2);
  }
  this.branchOffset = this.sectionLength / 2;

  this.sectionEnd.width = this.sectionStart.width - this.lineStep;

  var endCoords = this.endPoint();
  var endCoordCorrect = this.endPointCorrect();

  this.sectionEnd.left = this.sectionStart.left + endCoords.x  + this.halfLineStep;
  this.sectionEnd.right = this.sectionEnd.left + this.sectionEnd.width;
  this.sectionEnd.top = this.sectionStart.bottom - this.sectionLength;
  //For straight branch
  this.sectionEnd.topRight = this.sectionEnd.top;
  this.sectionEnd.topLeft = this.sectionEnd.top;

  if (this.angle) {
    this.sectionEnd.top = this.sectionStart.bottom - endCoords.y;
    this.sectionEnd.topRight = this.sectionEnd.top;
    this.sectionEnd.topLeft = this.sectionEnd.top;

    // Tried to fix to thin lines on big angles and failed
    if (this.angle > 90) { // left
      // console.log('%c \\ left: ' + this.angle, 'background: ' + this.color);
      // this.sectionEnd.topLeft -= endCoordCorrect.y;
      // this.sectionEnd.left -= endCoordCorrect.x;
    }
    else { // right
      // console.log('%c / right: ' + this.angle, 'background: ' + this.color);
      // this.sectionEnd.topRight -= endCoordCorrect.y;
      // this.sectionEnd.right -= endCoordCorrect.x;
    }
  }

  var d = [ 'M',
            this.sectionStart.left, this.sectionStart.bottomLeft, // bottom left
            this.sectionStart.right, this.sectionStart.bottomRight, // bottom right
            this.sectionEnd.right, this.sectionEnd.topRight,  //top right
            this.sectionEnd.left, this.sectionEnd.topLeft, // top left
            'Z'
          ].join(' ');

  var path = new Path2D(d);
  ctx.fill(path);

  // Add branches
  if (this.level < maxSections) {
    this.level++;

    var maxBranches = this.level <= 2 ? 1 : rand(0,2);
    var midAngle = rand(80,110);
    var fullAngle = rand(50,130);
    var startAngle = midAngle - fullAngle / 2;
    var stepAngle = fullAngle / maxBranches;

    for (var i = 0; i <= maxBranches; i++) {
      var currenAngle = startAngle + stepAngle * i;

      var branch = new Branch({
        type: '/',
        left: this.sectionEnd.left,
        right: this.sectionEnd.right,
        bottom: this.sectionEnd.top,
        bottomRight: this.sectionEnd.topRight,
        bottomLeft: this.sectionEnd.topLeft,
        maxLineWidth: this.sectionEnd.width,
        maxSectionLength: this.sectionLength,
        max: 2,
        angle: currenAngle,
        level: this.level
      });
    }
  }

  // Circles
  this.addCircles();
};

//---------------------------------------------

Branch.prototype.addCircles = function () {
  var circLevel = this.level === 1 ? 1.4 : this.level;

  var circParams = {
    x: this.sectionEnd.right - this.sectionEnd.width/2,
    y: this.sectionEnd.top,
    color: this.color
  };

  for (var i = 5; i >= 1; i--) {
    circParams.r = this.sectionEnd.width * (i * circLevel)/10;

    if(i < 5) {
      if(i % 2 === 0){
        circParams.color = 'black';
      }
      else {
        this.colorPos = getColorPos(this.colorPos);
        circParams.color = colors[this.colorPos];
      }
    }

    drawArc(circParams);
  }
}

//---------------------------------------------

function drawTrees() {

  ctx.fillStyle = 'black';
  var d = [ 'M',
            0, 0,
            width, 0,
            width, height,
            0, height
          ].join(' ');

  var p = new Path2D(d);
  ctx.fill(p);

  for (var i = 0; i < rowLength; i++) {
    var left = i * (maxLineWidth + xOffset) + xOffset;

    var branch = new Branch({
      left: left,
      bottom: height,
      max: maxSections,
      maxSectionLength: sectionLength,
      level: 0
    });
  }
}

//---------------------------------------------

function rand(min, max) {
  return Math.round(Math.random() *(max - min)) + min;
}

function randomizeVals() {
  maxSections = rand(+maxSectionsInput.min, +maxSectionsInput.max);
  maxSectionsInput.value = maxSections;

  var min = +maxHeightInput.min;
  var max = +maxHeightInput.max;
  var heightIndex = Math.round(Math.random() *(max - min)* 10)/10  + min;
  treeHeight = height * heightIndex;
  maxHeightInput.value = heightIndex;

  calcVars();
  drawTrees();
}

//---------------------------------------------

function maxSectionsChange() {
  maxSections = +this.value;
  calcVars();
  drawTrees();
}

function maxHeightChange() {
  treeHeight = +this.value * height;
  calcVars();
  drawTrees();
}

//---------------------------------------------

function download() {
  var dataUrl = canvas.toDataURL();
  downloadBtn.href = dataUrl;
}

//---------------------------------------------

drawTrees();

maxSectionsInput.addEventListener('input', maxSectionsChange);
maxHeightInput.addEventListener('input', maxHeightChange);

randomBtn.addEventListener('click', randomizeVals);
downloadBtn.addEventListener('click', download);
