// My first time making something with canvas :)

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

(function( win, document ) {
  
  var TWO_PI = 2 * Math.PI,
      MAX_SWAY = 5,
      SWAY_INCREMENT = 0.1,
      MAX_ROTATION = Math.PI / 32,
      canvas = document.querySelector('#scene'),
      ctx = canvas.getContext('2d'),
      Tree, Leaf,
      mainBackgroundColor = '#063637',
      circleColor = '#304158',
      treeColor = '#021015',
      width, height,
      circleSize, circleRadius,
      circleEdgeX, circleEdgeY,
      centerX, centerY,
      trees = [],
      treeData = [
        {
          total: 13,
          size: 0.36,
          position: {
            x: 0.3,
            y: 1.025
          }
        },
        {
          total: 15,
          size: 0.25,
          position: {
            x: 0.4,
            y: 1.02
          }
        },
        {
          total: 14,
          size: 0.425,
          position: {
            x: 0.47,
            y: 1.04
          }
        },
        {
          total: 15,
          size: 0.375,
          position: {
            x: 0.54,
            y: 1.045
          }
        },
        {
          total: 15,
          size: 0.34,
          position: {
            x: 0.77,
            y: 0.99
          }
        }
      ];
  
  // Helpers
  function getRandom( min, max ) {
    return Math.random() * (max - min) + min;
  }
  
  // Borrowed from processing.js
  function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }
  
  // A set of leaves
  Tree = function( tree ) {
    this.total = tree.total;
    this.data = tree;
    this.setPosition();
    this.leaves = [];
    this.sway = getRandom( -MAX_SWAY, MAX_SWAY );
    this.direction = this.sway < 0 ? 'left' : 'right';
    
    for ( var i = 0; i < this.total; i++ ) {
      this.leaves.push( new Leaf( this.size ) );
    }
  };

  Tree.prototype.setPosition = function() {
    this.size = this.data.size * (circleRadius / 2);
    this.position = {
      x: this.data.position.x * circleSize + circleEdgeX,
      y: this.data.position.y * circleSize + circleEdgeY
    };
    this.offset = 0.7 * this.size;
    
    return this;
  };

  Tree.prototype.updateLeafSize = function() {
    var tree = this;
    tree.leaves.forEach(function( leaf ) {
      leaf.setSize( tree.size );
    });
    
    return tree;
  };
  
  Tree.prototype.renderLeaves = function() {
    var tree = this;
    tree.leaves.forEach(function( leaf, i ) {
      var x = tree.position.x,
          y = tree.position.y - ( tree.offset * i ),
          sway = i ? tree.sway / (tree.total - i) : 0;

      leaf.render( x, y, sway );
    });
  };
  
  Tree.prototype.update = function() {
    return this
      .setPosition()
      .updateLeafSize();
  };
  
  Tree.prototype.render = function() {
    if ( this.direction === 'right' && this.sway < MAX_SWAY ) {
      this.sway += SWAY_INCREMENT;
    } else if ( this.direction === 'right' && this.sway >= MAX_SWAY ) {
      this.sway -= SWAY_INCREMENT;
      this.direction = 'left';
    } else if ( this.direction === 'left' && this.sway > -MAX_SWAY ) {
      this.sway -= SWAY_INCREMENT;
    } else if ( this.direction === 'left' && this.sway <= -MAX_SWAY ) {
      this.sway += SWAY_INCREMENT;
      this.direction = 'right';
    }
    
    this.renderLeaves();
  };
  
  // A triangle
  Leaf = function( size ) {
    this.size = size;
  };
  
  Leaf.prototype.setSize = function( size ) {
    this.size = size;
  };
  
  // Renders an equilateral triangle
  // Thanks http://stackoverflow.com/questions/8935930/create-equilateral-triangle-in-the-middle-of-canvas
  Leaf.prototype.render = function( cx, cy, sway ) {
    var height = this.size * Math.sqrt(3) / 2,
        rotation = map( sway, -MAX_SWAY, MAX_SWAY, -MAX_ROTATION, MAX_ROTATION );
    ctx.fillStyle = treeColor;
    
    ctx.save();
    
    ctx.translate( cx, cy );
    ctx.translate( sway, 0 );
    ctx.rotate( rotation );
  
    ctx.beginPath();
        
        ctx.moveTo(0, -height / 2);
        ctx.lineTo( -this.size / 2, height / 2);
        ctx.lineTo(this.size / 2, height / 2);
        ctx.lineTo(0, -height / 2);
        
        ctx.fill(); 
        
    ctx.closePath();
    ctx.restore();
    
  };
  
  function makeFullScreen() {
    width = document.body.offsetWidth;
    height = document.body.offsetHeight;
    
    if ( win.chrome && win.devicePixelRatio > 1 ) {
      width *= 2;
      height *= 2;
      canvas.style.width = (width / 2) + 'px';
      canvas.style.height = (height / 2) + 'px';
    }
    
    var widthRadius = ( 0.78 * width ) / 2;
    var heightRadius = ( 0.78 * height ) / 2;
    circleRadius = Math.min( widthRadius, heightRadius );
    circleSize = circleRadius * 2;
    
    centerX = width / 2;
    centerY = height / 2;
    
    circleEdgeX = centerX - circleRadius;
    circleEdgeY = centerY - circleRadius;
    
    canvas.width = width;
    canvas.height = height;
    
    
    trees.forEach(function( tree ) {
      tree.update();
    });
    
    render();
  }
  
  function render() {
    
    ctx.fillStyle = mainBackgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.arc( centerX, centerY, circleRadius, 0, TWO_PI, false );
    ctx.fillStyle = circleColor;
    ctx.fill();
    ctx.strokStyle = treeColor;
    ctx.stroke();
    
    trees.forEach(function( tree ) {
      tree.render();
    });
  }
  
  function loop() {
    render();
    win.requestAnimationFrame( loop );
  }
  
  function makeTrees() {
    var i = 0,
        len = treeData.length;
    
    for ( ; i < len; i++ ) {
      trees.push( new Tree( treeData[ i ] ) );
    }
  }
  
  function init() {
    makeFullScreen(); 
    makeTrees();
    loop();
    addEventListener('resize', makeFullScreen, false);
  }
  
  init();

}( window, document ));