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
    
    this.calculatePoints = function( growing ) {
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
        
        point.x = this.x + (this.r * Math.cos(nAng));
        point.y = this.y + (this.r * Math.sin(nAng));
        
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
    
    this.draw = function( strokeColor, fillColor ) {
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
      if( fillColor ) {
        Pen.ctx.fillStyle = fillColor;
        Pen.ctx.fill();
      }
      if( strokeColor ) {
        Pen.ctx.strokeStyle = strokeColor;
        Pen.ctx.stroke();
      }
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
  
  Pen.Text = function( text, x, y, font, color ) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.font = font;
    this.color = color;
    
    this.draw = function() {
      Pen.ctx.save();
      Pen.ctx.font = this.font;
      Pen.ctx.fillStyle = this.color;
      Pen.ctx.fillText( this.text, this.x, this.y );
      Pen.ctx.restore();
    };
  }
  
  Pen.calculateValueBetween = function ( fromValue, toValue, percentage ) {
    percentage = percentage/100;
    
    var dv = toValue - fromValue;
    return fromValue + (dv * percentage);
  };
  
  Pen.calculateRGBInterpolation = function ( fromColor, toColor, percentage ) {
    fromColor = tinycolor( fromColor );
    toColor = tinycolor( toColor );
    percentage = percentage/100;
    
    var fromRGB = fromColor.toRgb();
    var toRGB = toColor.toRgb();
    var newRGB = { r: 0, g: 0, b: 0, a: 0 };
    
    var dr = toRGB.r - fromRGB.r;
    var dg = toRGB.g - fromRGB.g;
    var db = toRGB.b - fromRGB.b;
    var da = toRGB.a - fromRGB.a;
    
    newRGB.r = fromRGB.r + (dr * percentage);
    newRGB.g = fromRGB.g + (dg * percentage);
    newRGB.b = fromRGB.b + (db * percentage);
    newRGB.a = fromRGB.a + (da * percentage);
    
    return tinycolor( newRGB );
  };
  Pen.calculateHSLInterpolation = function ( fromColor, toColor, percentage ) {
    fromColor = tinycolor( fromColor );
    toColor = tinycolor( toColor );
    percentage = percentage/100;
    
    var fromHsl = fromColor.toHsl();
    var toHsl = toColor.toHsl();
    var newHsl = { h: 0, s: 0, l: 0, a: 0 };
    
    var dh = toHsl.h - fromHsl.h;
    var ds = toHsl.s - fromHsl.s;
    var dl = toHsl.l - fromHsl.l;
    var da = toHsl.a - fromHsl.a;
    
    newHsl.h = fromHsl.h + (dh * percentage);
    newHsl.s = fromHsl.s + (ds * percentage);
    newHsl.l = fromHsl.l + (dl * percentage);
    newHsl.a = fromHsl.a + (da * percentage);
    
    return tinycolor( newHsl );
  };
  Pen.calculateHSVInterpolation = function ( fromColor, toColor, percentage ) {
    fromColor = tinycolor( fromColor );
    toColor = tinycolor( toColor );
    percentage = percentage/100;
    
    var fromHsv = fromColor.toHsv();
    var toHsv = toColor.toHsv();
    var newHsv = { h: 0, s: 0, v: 0, a: 0 };
    
    var dh = toHsv.h - fromHsv.h;
    var ds = toHsv.s - fromHsv.s;
    var dv = toHsv.v - fromHsv.v;
    var da = toHsv.a - fromHsv.a;
    
    newHsv.h = fromHsv.h + (dh * percentage);
    newHsv.s = fromHsv.s + (ds * percentage);
    newHsv.v = fromHsv.v + (dv * percentage);
    newHsv.a = fromHsv.a + (da * percentage);
    
    return tinycolor( newHsv );
  };
  
  
  var previousTime = null;
  var polygonRGB = null;
  var polygonHSL = null;
  var polygonHSV = null;
  var rgbText = null;
  var hslText = null;
  var hsvText = null;
  
  var r = {
    from: 1,
    to: 100,
    min: 0,
    max: 100,
    v: 200,
    current: 0,
    growing: false
  };
  var color = {
    from: "#ff00ff",
    to: "#00ff00",
    min: 0,
    max: 100,
    v: 50,
    current: 0,  // Percentage
    growing: false
  };
  
  Pen.init = function() {
    previousTime = +new Date;
    
    polygonRGB = new Pen.Polygon(Pen.center.x-(r.to*2), Pen.center.y, r.to, 0, 6);
    polygonRGB.calculatePoints();
   
    polygonHSL = new Pen.Polygon(Pen.center.x, Pen.center.y, r.to, 0, 6);
    polygonHSL.calculatePoints();
    
    polygonHSV = new Pen.Polygon(Pen.center.x+(r.to*2), Pen.center.y, r.to, 0, 6);
    polygonHSV.calculatePoints();
    
    var textY = Pen.center.y + r.to + 20;
    var textX = Pen.center.x-(r.to*2)-20;
    rgbText = new Pen.Text( "RGB", textX, textY, "20px Georgia", "#fff");
    textX = Pen.center.x-20;
    hslText = new Pen.Text( "HSL", textX, textY, "20px Georgia", "#fff");
    textX = Pen.center.x+(r.to*2)-20;
    hsvText = new Pen.Text( "HSV", textX, textY, "20px Georgia", "#fff");
    
    
  };
    
  Pen.loop = function() {
    var currentTime = +new Date;
    var dt = (currentTime - previousTime) / 1000;
    
    // === Per frame actions
    
    Pen.Background.draw();
    
    /*
      if ( r.growing ) {
        r.current += r.v * dt;
        if ( r.current > r.max ) {
          r.current = r.max;
          r.growing = false;
        }
      } else {
        r.current -= r.v * dt;
        if ( r.current < r.min ) {
          r.current = r.min;
          r.growing = true;
        }
      }
      var currentR = Pen.calculateValueBetween( r.from, r.to, r.current );
      polygon.r = currentR;
      polygon.calculatePoints();
    */
    
    if ( color.growing ) {
      color.current += color.v * dt;
      if ( color.current > 100 ) {
        color.current = 100;
        color.growing = false;
      }
    } else {
      color.current -= color.v * dt;
      if ( color.current < 0 ) {
        color.current = 0;
        color.growing = true;
      }
    }
    var currentColorRGB = Pen.calculateRGBInterpolation( color.from, color.to, color.current ).toHexString();
    var currentColorHSL = Pen.calculateHSLInterpolation( color.from, color.to, color.current ).toHexString();
    var currentColorHSV = Pen.calculateHSVInterpolation( color.from, color.to, color.current ).toHexString();
    
    polygonRGB.draw( currentColorRGB, currentColorRGB );
    polygonHSL.draw( currentColorHSL, currentColorHSL );
    polygonHSV.draw( currentColorHSV, currentColorHSV );
    
    rgbText.draw();
    hslText.draw();
    hsvText.draw();
    
    // === End: Per frame actions
    
    previousTime = currentTime;
    global.requestAnimationFrame( Pen.loop );
  };
  
  global.Pen = Pen;
}(this, jQuery));

$(function() {
  Pen.init();
  Pen.loop();
});