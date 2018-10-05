var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Aliases
var rnd = Math.random,
    flr = Math.floor;

var PEN,
    halfw = canvas.width / 2,
    halfh = canvas.height / 2;

(function(PEN) {
  
  var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0, '#444');   
  grd.addColorStop(1, '#666');
  
  var dots = [],
      ships = [],
      numberOfDots = halfw / 10,
      numberOfShips = 20,
      piDivde180 = Math.PI / 180,
      piTimes2 = 2 * Math.PI;
  
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
  
  PEN.Vector = function(x, y) {
    this.x = x;
    this.y = y;

  };
  
  PEN.init = function() {
    for (var i = numberOfDots; i > 0; i--) {
      dots.push (new PEN.Dot(i * 20));
    }
    for (var i = 0; i < numberOfShips; i++) {
      ships.push(new PEN.Vector(flr(rnd() * halfw * 2) - halfw, flr(rnd() * halfh * 2) - halfh));
    }
    
  };
  
  PEN.draw = function() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0,0,canvas.width, canvas.height)
    
    ctx.translate(halfw, halfh);
    
    for (var i = 0; i < numberOfDots; i++) {
      var currentDot = dots[i];
      currentDot.step();
      currentDot.draw();
    }
    
    window.requestAnimationFrame(PEN.draw);
  };
  
  PEN.Dot = function(size) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.size = size;
    this.rotation = 0;
    this.distance = 15 / this.z;
    
    this.step = function() {
      this.rotation += 0.5;
      
      if (this.rotation > 360) {
        this.rotation = 0;
        
      }
    }
    
    this.draw = function() {
            
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(halfw, halfh);
      
      ctx.strokeStyle = 'rgb(0,100,0)';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, piTimes2);
      ctx.stroke();
      ctx.beginPath();
      
      var numOfSlices = 8,
          anglePerSlice = 360 / numOfSlices;
      for (var i = 0; i < numOfSlices; i++) {
        ctx.moveTo(0,0);
        ctx.lineTo(Math.cos((i * anglePerSlice) * piDivde180) * canvas.width, Math.sin((i * anglePerSlice) * piDivde180) * canvas.height );
      }
      
      ctx.stroke();
      
      ctx.strokeStyle = 'rgb(0,200,0)';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, (this.rotation - 10) * piDivde180, this.rotation * piDivde180);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0,0);
      
      var scanx = Math.cos(this.rotation * piDivde180) * this.size,
          scany = Math.sin(this.rotation * piDivde180) * this.size
      
      ctx.lineTo(scanx, scany)
      ctx.stroke();
      
      
      
      for (var i = 0; i < numberOfShips; i++) {
      
        var currentShip = ships[i];
        if (findDistance(scanx, scany, currentShip.x, currentShip.y ) < 15){
          ctx.beginPath();
          var shipGradient = ctx.createRadialGradient(currentShip.x,currentShip.y,0.1,currentShip.x,currentShip.y,10);
          shipGradient.addColorStop(0,"white");
          shipGradient.addColorStop(0.4,"rgba(0,255,0, 1)");
          shipGradient.addColorStop(1,"rgba(0,255,0,0.1)");
          ctx.fillStyle = shipGradient;

          ctx.arc(currentShip.x, currentShip.y, 10, 0, piTimes2);

          ctx.fill();
        }
      }
      
    };
    
  }
  
})(PEN || (PEN =  {}));

PEN.init();
PEN.draw();

window.onresize = function() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvase.offsetHeight;
  halfw = canvas.width / 2;
  halfh = canvas.height / 2;
  
}