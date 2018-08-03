window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

(function(global, $) {
  
  var Pen = {};
  var v = 1000;
  
  
  Pen.canvas = document.getElementById('c');
  Pen.$canvas = $(Pen.canvas);
  Pen.ctx = Pen.canvas.getContext('2d');
  if (!Pen.ctx.setLineDash) {
    Pen.ctx.setLineDash = function () {}
  }
  
  Pen.width = global.innerWidth;
  Pen.height = global.innerHeight;
  Pen.center = {
    x: Pen.width/2,
    y: Pen.height/2
  };
  
  Pen.canvas.width = Pen.width;
  Pen.canvas.height = Pen.height;
  
  Pen.Background = (function() {
    var Background = {};
    
    var color = "#1f1f1f";
    Background.setColor = function( hexColor ) {
      color = hexColor;
    };
    
    Background.draw = function() {
      Pen.ctx.fillStyle = color;
      Pen.ctx.fillRect(0, 0, Pen.width, Pen.height);
    };
    
    return Background;
  }());

  Pen.Polygon = function( x, y, r, theta, sides ) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.theta = theta;
    this.sides = sides;
    this.points = [];
    
    this.setSides = function( sides, growing ) {
      this.sides = sides;
      this._calculatePoints( growing );
    };
    
    this._calculatePoints = function( growing ) {
      this.points = [];
      
      var upSides = Math.ceil(this.sides);
      var downSides = Math.floor(this.sides);
      var partialSide = this.sides - downSides;
      
      var downInAngSum = Math.PI * (downSides - 2);
      var downInAng = Math.PI - (downInAngSum/downSides);
      
      var upInAngSum = Math.PI * (upSides - 2);
      var upInAng = Math.PI - (upInAngSum/upSides);
      
      var nAng = this.theta;
      
      for( var i = 0; i < upSides; i++ ) {
        var point = {};
        
        point.x = this.x + (r * Math.cos(nAng));
        point.y = this.y + (r * Math.sin(nAng));
        
        this.points.push(point);
        
        if( ! growing ) {
          nAng += downInAng - ((upInAng * partialSide) / downSides);
        } else {
          if (i == 0 && partialSide != 0) {
            nAng += upInAng * partialSide;
          } else {
            nAng += downInAng - ((upInAng * partialSide) / downSides);
          }
        }
      }
    }
    
    this.draw = function( color ) {
      Pen.ctx.beginPath();
      for ( var i = 0, numSides = this.points.length; i < numSides; i++ ) {
        var point = this.points[i];
        
        if (i == 0) {
          Pen.ctx.moveTo(point.x, point.y);
        } else {
          Pen.ctx.lineTo(point.x, point.y);
        }
      }
      Pen.ctx.closePath();
      Pen.ctx.strokeStyle = color;
      Pen.ctx.stroke();
    };
    
    this.drawSpokes = function ( color ) {
      if( this.sides <= 3 ) return;
      for ( var i = 0, numSides = this.points.length; i < numSides; i++ ) {
        var point = this.points[i];
        for ( var j = 0; j < (numSides-3); j++ ) {
          var nextPoint = i + j + 2;
          if ( nextPoint >= numSides ) nextPoint = nextPoint - numSides;
          Pen.ctx.beginPath();
          Pen.ctx.moveTo(point.x, point.y);
          Pen.ctx.lineTo(this.points[nextPoint].x, this.points[nextPoint].y);
          Pen.ctx.strokeStyle = color;
          Pen.ctx.stroke();
        }
      }
    };
  };
  
  Pen.Spiral = function( r, theta, phi, sides ) {
    if( sides < 3 ) throw "The number of sides must be 3 or more";
    
    this.r = r;  // Initial Radius
    this.theta = theta;  // Initial theta angle
    this.phi = phi;
    this.sides = sides;
    this.color = "#fff";
    
    this.draw = function() {
      var x = Pen.center.x + (r * Math.cos(theta));
      var y = Pen.center.y + (r * Math.sin(theta));
      
      var inAngSum = Math.PI * (this.sides - 2);
      
      Pen.ctx.beginPath();
      Pen.ctx.moveTo(Pen.center.x, Pen.center.y);
      Pen.ctx.strokeStyle = this.color;
      Pen.ctx.lineTo(x, y);
      Pen.ctx.stroke();
    };
  };
  
  
  var previousTime = null;
  var spiral = null;
  var polygon1 = null;
  var polygon2 = null;
  var velocity = 2;
  var growing = true;
  var minSides = 2;
  var maxSides = 8;
  
  Pen.init = function() {
    previousTime = +new Date;
    
    polygon1 = new Pen.Polygon( Pen.center.x-80, Pen.center.y, 80, 0, minSides);
    polygon2 = new Pen.Polygon( Pen.center.x+80, Pen.center.y, 80, Math.PI, maxSides);
    spiral = new Pen.Spiral(10, Math.PI/8, Math.PI/8);
    
  };
    
  Pen.loop = function() {
    var currentTime = +new Date;
    var dt = (currentTime - previousTime) / 1000;
    
    Pen.Background.draw();
    
    var sides1 = polygon1.sides;
    var sides2 = polygon2.sides;
    if ( growing ) {
      sides1 += velocity * dt;
      sides2 -= velocity * dt;
      if ( sides1 >= maxSides) {
        growing = false;
      }
    } else {
      sides1 -= velocity * dt
      sides2 += velocity * dt;
      if ( sides1 <= minSides) {
        growing = true;
      }
    }
    
    polygon1.setSides( sides1, growing );
    polygon1.draw( "#fff" );
    polygon1.drawSpokes( "#423565");
    polygon2.setSides( sides2, growing );
    polygon2.draw( "#fff" );
    polygon2.drawSpokes( "#423565");
    
    previousTime = currentTime;
    global.requestAnimationFrame( Pen.loop );
  };
  
  global.Pen = Pen;
}(this, jQuery));

$(function() {
  Pen.init();
  Pen.loop();
});