var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var strokeWidth = '5';
var strokeColor = 'blue';
var fillColor = 'black';
var minRadius = 3;
var maxRadius = 40;
var noOfCircles = 500;
var speedFactor =8;

// canvas initialization
var canvas = document.getElementById('mainCanvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var pen = canvas.getContext('2d');
pen.lineWidth = strokeWidth;
pen.strokeStyle = strokeColor;
pen.fillStyle = fillColor;
var circleArray = [];
var mouse ={
  x : undefined,
  y : undefined
};
var colorArr = [
  "#2B3A42",
  "#3F5765",
  "#BDD4DE",
  "#EFEFEF",
  "#FF530D"
];
// mouse event listner
canvas.addEventListener('mousemove', function(e){
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener('resize', function(e){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// class Circle
function Circle(circleX,circleY,circleRadius,dx,dy){
  this.circleX = circleX;
  this.circleY = circleY;
  this.circleRadius = circleRadius;
  this.dx = dx;
  this.dy = dy;
  this.color = colorArr[Math.floor(Math.random()*4 +1)];

  this.draw = function(){
    // draw animated circles
    pen.beginPath();
    pen.arc(this.circleX,this.circleY,this.circleRadius,0,Math.PI*2,false);
    pen.closePath();
    // pen.stroke();
    pen.fillStyle = this.color;
    pen.fill();
  }

  this.update = function(){
    //collisitoin detection
    if(this.circleX + this.circleRadius > canvasWidth || this.circleX - this.circleRadius < 0){
      this.dx = -this.dx;
    }
    if(this.circleY + this.circleRadius > canvasHeight || this.circleY - this.circleRadius < 0){
      this.dy = -this.dy;
    }


    this.circleX += this.dx;
    this.circleY += this.dy;

    //interactivity
    if(mouse.x - this.circleX < 50 && mouse.x-this.circleX >-50 && mouse.y - this.circleY < 50 && mouse.y-this.circleY >-50){
      this.circleRadius++;
      if(this.circleRadius > maxRadius){
        this.circleRadius = maxRadius;
      }
    }
    else if(this.circleRadius > minRadius){
      this.circleRadius--;
    }
    this.draw();
  }
}

function animate(){
  requestAnimationFrame(animate);
  pen.clearRect(0,0,canvasWidth,canvasHeight);
  for(var i=0;i<circleArray.length;i++){
    circleArray[i].update();
  }
}

function init(){
  // create multiple circles
  for(var i=0;i<noOfCircles;i++){
    var circleX = Math.random() * canvasWidth;
    var circleY = Math.random() * canvasHeight;
    var dx = (Math.random() - 0.5) * speedFactor;
    var dy = (Math.random() - 0.5) * speedFactor;
    circleArray.push(new Circle(circleX,circleY,minRadius,dx,dy));
  }
  animate();
}
init();
