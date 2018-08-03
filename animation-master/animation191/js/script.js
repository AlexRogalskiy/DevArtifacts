window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

(function(global, $) {
  
  var Pen = {};
  var v = 1000;
  
  
  Pen.canvas = document.getElementById('c');
  Pen.$canvas = $(Pen.canvas);
  Pen.ctx = Pen.canvas.getContext('2d');
  if ( ! Pen.ctx.setLineDash ) {
    Pen.ctx.setLineDash = function () {}
  }
  
  Pen.width = global.innerWidth;
  Pen.height = global.innerHeight;
  
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
  
  Pen.Circle = function( x, y, r ) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = '#FFCC00';
    
    this.draw = function() {
        Pen.ctx.beginPath();
        Pen.ctx.arc( this.x, this.y, this.r, 0, 2 * Math.PI, false );
        Pen.ctx.fillStyle = this.fill;
        Pen.ctx.fill();
    };
  };
  
  Pen.Pacman = function( x, y, r, angle ) {
    Pen.Circle.call( this, x, y, r );
    this.angle = angle;
    
    this.mouthV = Math.PI * 5;
    this.mouthIsClosing = true;
    this.maxMouthAngle = Math.PI/2;
    
    this.mouthAngle = this.maxMouthAngle;
    
    this.draw = function() {
      Pen.ctx.beginPath();
      var startingAngle = (this.mouthAngle / 2) + angle;
      var endingAngle = (2 * Math.PI) - (this.mouthAngle / 2) + angle;
      Pen.ctx.arc( this.x, this.y, this.r, startingAngle, endingAngle, false);
      Pen.ctx.lineTo( this.x, this.y );
      Pen.ctx.fillStyle = this.fill;
      Pen.ctx.fill();
    };
    this.updateMouth = function( dt ) {
      var dTheta = dt * this.mouthV;
      if ( this.mouthIsClosing ) {
        this.mouthAngle -= dTheta;
        if( this.mouthAngle <= 0 ) {
          this.mouthIsClosing = false;
          this.mouthAngle = 0;
        }
      } else {
        this.mouthAngle += dTheta;
        if( this.mouthAngle >= this.maxMouthAngle ) {
          this.mouthIsClosing = true;
          this.mouthAngle = this.maxMouthAngle;
        }
      }
    };
  };
  
  Pen.Animator = (function() {
    var Animator = {};
    
    Animator.moveObjectTo = function( object, x, y, v, dt ) {
            
      var xf = Math.abs( x - object.x );
      var yf = Math.abs( y - object.y );
      var theta = Math.atan(yf/xf);
      
      var d = v * dt;
      var xd = d * Math.cos( theta );
      var yd = d * Math.sin( theta );
      
      if ( object.x > x ) {
        object.x -= xd;
        if( object.x < x ) object.x = x;
      } else if ( object.x < x ) {
        object.x += xd;
         if( object.x > x ) object.x = x;
      }
      
      if ( object.y > y ) {
        object.y -= yd;
        if( object.y < y ) object.y = y;
      } else if ( object.y < y ) {
        object.y += yd;
        if( object.y > y ) object.y = y;
      }
    };
    
    return Animator;
  }());
  
  var previousTime = null;
  var pacman = null;
  
  Pen.init = function() {
    previousTime = +new Date;
    
    pacman = new Pen.Pacman( Pen.width/2, Pen.height/2, 20, 0 );
  };
    
  Pen.loop = function() {
    var currentTime = +new Date;
    var dt = (currentTime - previousTime) / 1000;
    
    Pen.Background.draw();
    
    pacman.updateMouth(dt);
    pacman.draw();
    
    previousTime = currentTime;
    global.requestAnimationFrame( Pen.loop );
  };
  
  global.Pen = Pen;
}(this, jQuery));

$(function() {
  Pen.init();
  Pen.loop();
});