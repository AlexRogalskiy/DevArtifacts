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
  
  
  Pen.Background = (function() {
    var Background = {};
    
    Background.draw = function( polygon, growing, color1, color2, color3 ) {
      var points = [];
      for( var i = 0, numSides = polygon.points.length; i < numSides; i ++){
        var polygonPoint = polygon.points[i];
        
        var thetaX = polygonPoint.x - Pen.center.x;
        var thetaY = polygonPoint.y - Pen.center.y;
        var theta = Math.atan( Math.abs(thetaY) / Math.abs(thetaX) );
        
        if( thetaX >= 0 && thetaY >= 0 );
        else if( thetaX < 0 && thetaY >= 0 ) theta = Math.PI - theta;
        else if( thetaX < 0 && thetaY < 0 ) theta = Math.PI + theta;
        else theta = (Math.PI*2) - theta; 
        
        var m = (polygonPoint.y - Pen.center.y)/(polygonPoint.x - Pen.center.x);
        var point = {};
        
        if ( theta >= (Math.PI/4) && theta < ((Math.PI*3)/4)) {
          point.y = Pen.height;
          point.x = ((point.y - Pen.center.y)/m) + Pen.center.x;
        } else if ( theta >= ((Math.PI*3)/4) && theta < ((Math.PI*5)/4) ) {
          point.x = 0;
          point.y = m * (point.x - Pen.center.x) + Pen.center.y;
        } else if ( theta >= ((Math.PI*5)/4) && theta < ((Math.PI*7)/4) ) {
          point.y = 0;
          point.x = ((point.y - Pen.center.y)/m) + Pen.center.x;
        } else {
          point.x = Pen.width;
          point.y = m * (point.x - Pen.center.x) + Pen.center.y;
        }
        
        points.push(point);
      }
      
      Pen.ctx.fillStyle = color1;
      Pen.ctx.fillRect(0, 0, Pen.width, Pen.height);
      
      var colorNum = 1;
      
      for( var i = 0, numSides = points.length; i < numSides; i++ ){
        var point = points[i];
        var nextPoint = ((i+1) >= numSides) ? points[0] : points[i+1];
        
        if( growing ) {
          if((i % 2) == 0 && (numSides % 2) == 0) continue;
          if((i % 2) != 0 && (numSides % 2) != 0) continue;
        } else {
          if((i % 2) == 0) continue;
        }
        
        Pen.ctx.beginPath();
        Pen.ctx.moveTo(Pen.center.x, Pen.center.y);
        Pen.ctx.lineTo(point.x, point.y);
        
        if ( point.x != nextPoint.x && point.y != nextPoint.y ) {
          if( point.x == 0  && nextPoint.x != 0) Pen.ctx.lineTo(0, 0);
          if( point.y == 0 && nextPoint.y != 0 ) Pen.ctx.lineTo(Pen.width, 0);
          if( point.x == Pen.width && nextPoint.x != Pen.width ) Pen.ctx.lineTo(Pen.width, Pen.height);
          if( point.y == Pen.height && nextPoint.y != Pen.height ){
            Pen.ctx.lineTo(0, Pen.height);
            if( nextPoint.x != 0 ) Pen.ctx.lineTo(0, 0);
          } 
        }
        
        Pen.ctx.lineTo(nextPoint.x, nextPoint.y);
        Pen.ctx.closePath();
        
        /*
          if( colorNum == 1 ) Pen.ctx.fillStyle = color1;
          if( colorNum == 2 ) Pen.ctx.fillStyle = color2;
          if( colorNum == 3 ) Pen.ctx.fillStyle = color3;
        */
        
        Pen.ctx.fillStyle = color2;
        
        Pen.ctx.fill();
        
        colorNum++;
        if ( colorNum > 3 ) colorNum = 1;
      }
    };
    
    
    return Background;
  }());
  
  
  var previousTime = null;
  var spiral = null;
  var polygon = null;
  var velocity = 2;
  var growing = true;
  var minSides = 4;
  var maxSides = 8;
  
  Pen.init = function() {
    previousTime = +new Date;
    
    polygon = new Pen.Polygon( Pen.center.x, Pen.center.y, 80, 0, minSides);
  };
    
  Pen.loop = function() {
    var currentTime = +new Date;
    var dt = (currentTime - previousTime) / 1000;
    
    var sides = polygon.sides;
    if ( growing ) {
      sides += velocity * dt;
      if ( sides >= maxSides) {
        growing = false;
      }
    } else {
      sides -= velocity * dt
      if ( sides <= minSides) {
        growing = true;
      }
    }
    
    polygon.setSides( sides, growing );
    
    Pen.Background.draw( polygon, growing, "#1f1f1f", "#282828", "#2f2f2f" );
    
    polygon.draw( "#fff" );
    //polygon.drawSpokes( "#423565" );
    
    previousTime = currentTime;
    global.requestAnimationFrame( Pen.loop );
  };
  
  global.Pen = Pen;
}(this, jQuery));

$(function() {
  Pen.init();
  Pen.loop();
});