var canvas = document.createElement('canvas');
document.getElementsByTagName('div')[0].appendChild(canvas);
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var halfw = canvas.width / 2;
var halfh = canvas.height / 2;
var chainLength = 100;

var ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function Velocity(x, y) {
  this.x = x;
  this.y = y;
}

function findDistance(x1, y1, x2, y2) {

  if (x2 < x1) {
    var tmpX1 = x1;
    var tmpY1 = y1;
    x1 = x2;
    x2 = tmpX1;
    y1 = y2;
    y2 = tmpY1;
  }

  var result = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow(y2 - y1, 2));
  return Math.floor(result);

}

function Proton(x, y, c, i) {
  var parentProton = protons[i - 1];
  var vPossibility = 4;
  var startVX = Math.floor(Math.random() * vPossibility) + 1;
  var startVY = Math.floor(Math.random() * vPossibility) + 1;
  if (i !== 0) {

  }
  this.x = x;
  this.y = y;
  if (i === 0) {
    this.v = new Velocity(startVX, startVY);
  } else {
    //this.v = new Velocity(startVX, startVY);
    this.v = new Velocity(0, 0);
  }

  this.currDist = 0;
  this.i = i;
  this.size = 2;

  this.c = c;

  this.draw = function() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(this.x + this.size, this.y + this.size);
    ctx.fillStyle = 'hsl(' + c + ', 100%, 50%)';
    /*ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2, true);
    ctx.fill();*/

    /*var fizzSpace = this.size * 4;
    var offsetFizz = (((fizzSpace) / 2) * -1);
    var finish = ((this.size) * 2);

    for (var fx = offsetFizz; fx < finish; fx++) {
      for (var fy = offsetFizz; fy < finish; fy++) {
        var chance = Math.floor(Math.random() * 100) < 1;
        if (chance) {
          ctx.beginPath();
          var lightIntense = Math.floor(Math.random() * 20);
          ctx.fillStyle = 'hsl(' + c + ',100%,' + (80 + lightIntense) + '%)';
          ctx.fillRect(fx, fy, 2, 2);
          ctx.fill();
        }
      }
    }*/
    var dist = 0;

    if (i > 0) {
      dist = findDistance(this.x, this.y, parentProton.x, parentProton.y);

    }

    if (dist < chainLength)
      this.currDist = 0;
    if (this.i > 0) {
      this.v.x = (parentProton.x - this.x) * 0.1;
      this.v.y = (parentProton.y - this.y) * 0.1;
    }

    this.x += this.v.x;
    this.y += this.v.y;

    if (this.i == 0) {
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        var vPossibility = 4;
        var vx = Math.floor(Math.random() * vPossibility) + 1;
        var vy = Math.floor(Math.random() * vPossibility) + 1;

        if (this.x < 0) {
          this.x = 0;
          //if (this.i === 0)
          this.v.x = vx;
        }

        if (this.x > canvas.width) {
          this.x = canvas.width;
          //if (this.i === 0)
          this.v.x = vx * -1;
        }

        if (this.y < 0) {
          this.y = 0;
          //if (this.i === 0)
          this.v.y = vy;
        }

        if (this.y > canvas.height) {
          this.y = canvas.height;
          //if (this.i === 0)
          this.v.y = vx * -1;
        }

      }
    }

  }

}

var numOfProtons = 20;
var protons = [];
var x = Math.floor(Math.random() * canvas.width);
var y = Math.floor(Math.random() * canvas.width);

for (var i = 0; i < numOfProtons; i++) {

  protons.push(new Proton(x, y, 10, i));
}

function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  var right = protons[0].v.x > 0;
  
  for (var i = 0; i < numOfProtons; i++) {
    var currentProton = protons[i];

    if (numOfProtons > 1 && i < numOfProtons - 1) {
      
      var grd = ctx.createLinearGradient(0, 0, 100, 0);
      
      grd.addColorStop(0, 'red');   
      grd.addColorStop(1, 'orange');
      ctx.strokeStyle = grd;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      var x1 = currentProton.x + currentProton.size;
      var x2 = protons[i + 1].x + protons[i + 1].size;
      var y1 = currentProton.y + currentProton.size;
      var y2 = protons[i + 1].y + protons[i + 1].size;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      
    }
    ctx.stroke();

    currentProton.draw();
  }

  window.requestAnimationFrame(draw);
}

draw();