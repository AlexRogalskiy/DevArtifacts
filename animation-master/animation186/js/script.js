/*jshint unused: false, undef: true */
/*global blockSize: false */

// ----- utils ----- //

// extends objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}

function normalizeAngle( angle ) {
  return modulo( angle, Math.PI * 2 );
}

function getDegrees( angle ) {
  return angle * ( 180 / Math.PI );
}



// --------------------------  -------------------------- //

function line( ctx, a, b ) {
  ctx.beginPath();
  ctx.moveTo( a.x, a.y );
  ctx.lineTo( b.x, b.y );
  ctx.stroke();
  ctx.closePath();
}

/*jshint browser: true, undef: true, unused: true */

// -------------------------- vector -------------------------- //

function Vector( x, y ) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.set = function( v ) {
  this.x = v.x;
  this.y = v.y;
};

Vector.prototype.setCoords = function( x, y ) {
  this.x = x;
  this.y = y;
};

Vector.prototype.add = function( v ) {
  this.x += v.x;
  this.y += v.y;
};

Vector.prototype.subtract = function( v ) {
  this.x -= v.x;
  this.y -= v.y;
};

Vector.prototype.scale = function( s )  {
  this.x *= s;
  this.y *= s;
};

Vector.prototype.multiply = function( v ) {
  this.x *= v.x;
  this.y *= v.y;
};

// custom getter whaaaaaaat
Object.defineProperty( Vector.prototype, 'magnitude', {
  get: function() {
    return Math.sqrt( this.x * this.x  + this.y * this.y );
  }
});

Vector.prototype.equals = function ( v ) {
  return this.x == v.x && this.y == v.y;
};

Vector.prototype.zero = function() {
  this.x = 0;
  this.y = 0;
};

Vector.prototype.block = function( size ) {
  this.x = Math.floor( this.x / size );
  this.y = Math.floor( this.y / size );
};

Object.defineProperty( Vector.prototype, 'angle', {
  get: function() {
    return normalizeAngle( Math.atan2( this.y, this.x ) );
  }
});

// ----- class functions ----- //
// return new vectors

Vector.subtract = function( a, b ) {
  return new Vector( a.x - b.x, a.y - b.y );
};

Vector.add = function( a, b ) {
  return new Vector( a.x + b.x, a.y + b.y );
};

Vector.copy = function( v ) {
  return new Vector( v.x, v.y );
};

Vector.isSame = function( a, b ) {
  return a.x == b.x && a.y == b.y;
};

Vector.getDistance = function( a, b ) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt( dx * dx + dy * dy );
};

Vector.addDistance = function( vector, distance, angle ) {
  var x = vector.x + Math.cos( angle ) * distance;
  var y = vector.y + Math.sin( angle ) * distance;
  return new Vector( x, y );
};

// --------------------------  -------------------------- //


// -------------------------- Particle -------------------------- //


function Particle( x, y ) {
  this.position = new Vector( x, y );
  this.previousPosition = new Vector( x, y );
}

Particle.prototype.update = function( friction, gravity ) {
  var velocity = Vector.subtract( this.position, this.previousPosition );
  // friction
  velocity.scale( friction );
  this.previousPosition = Vector.copy( this.position );
  this.position.add( velocity );
  this.position.add( gravity );
};

// --------------------------  -------------------------- //

Particle.prototype.render = function( ctx ) {
  // big circle
  ctx.fillStyle = 'hsla(0, 0%, 10%, 0.5)';
  circle( ctx, this.position.x, this.position.y, 4 );
  // dot
  // ctx.fillStyle = 'hsla(0, 100%, 50%, 0.5)';
  // circle( this.position.x, this.position.y, 5  );
};

function circle( ctx, x, y, radius ) {
  ctx.beginPath();
  ctx.arc( x, y, radius, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}

// --------------------------  -------------------------- //


function StickConstraint( particleA, particleB, distance ) {
  this.particleA = particleA;
  this.particleB = particleB;
  if ( distance ) {
    this.distance = distance;
  } else {
    var delta = Vector.subtract( particleA.position, particleB.position );
    this.distance = delta.magnitude;
  }

  this.distanceSqrd = this.distance * this.distance;
}

StickConstraint.prototype.update = function() {
  var delta = Vector.subtract( this.particleA.position, this.particleB.position );
  var mag = delta.magnitude;
  var scale = ( this.distance - mag ) / mag * 0.5;
  delta.scale( scale );
  this.particleA.position.add( delta );
  this.particleB.position.subtract( delta );
};

StickConstraint.prototype.render = function( ctx ) {
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.5)';
  ctx.lineWidth = 2;
  line( ctx, this.particleA.position, this.particleB.position );
};
// --------------------------  -------------------------- //

function PinConstraint( particle, position ) {
  this.particle = particle;
  this.position = position;
}

PinConstraint.prototype.update = function() {
  this.particle.position = Vector.copy( this.position );
};

PinConstraint.prototype.render = function() {};



// --------------------------  -------------------------- //

function ChainLinkConstraint( particleA, particleB, distance, shiftEase ) {
  this.particleA = particleA;
  this.particleB = particleB;
  this.distance = distance;
  this.distanceSqrd = distance * distance;
  this.shiftEase = shiftEase === undefined ? 0.85 : shiftEase;
}

ChainLinkConstraint.prototype.update = function() {
  var delta = Vector.subtract( this.particleA.position, this.particleB.position );
  var deltaMagSqrd = delta.x * delta.x + delta.y * delta.y;

  if ( deltaMagSqrd <= this.distanceSqrd ) {
    return;
  }
  var newPosition = Vector.addDistance( this.particleA.position, this.distance, delta.angle + Math.PI );
  var shift = Vector.subtract( newPosition, this.particleB.position );
  shift.scale( this.shiftEase );
  this.particleB.previousPosition.add( shift );
  this.particleB.position.set( newPosition );
};

ChainLinkConstraint.prototype.render = function( ctx ) {
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.5)';
  ctx.lineWidth = 2;
  line( ctx, this.particleA.position, this.particleB.position );
};

function line( ctx, a, b ) {
  ctx.beginPath();
  ctx.moveTo( a.x, a.y );
  ctx.lineTo( b.x, b.y );
  ctx.stroke();
  ctx.closePath();
}

// --------------------------  -------------------------- //

function LinkConstraint( particleA, particleB, distance ) {
  this.particleA = particleA;
  this.particleB = particleB;
  this.distance = distance;
  this.distanceSqrd = distance * distance;
}

LinkConstraint.prototype.update = function() {
  var delta = Vector.subtract( this.particleA.position, this.particleB.position );
  var deltaMagSqrd = delta.x * delta.x + delta.y * delta.y;

  if ( deltaMagSqrd <= this.distanceSqrd ) {
    return;
  }
  var mag = delta.magnitude
  var scale = ( this.distance - mag ) / mag * 0.5;
  delta.scale( scale );
  this.particleA.position.add( delta );
  this.particleB.position.subtract( delta );
};

LinkConstraint.prototype.render = function( ctx ) {
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.5)';
  ctx.lineWidth = 2;
  line( ctx, this.particleA.position, this.particleB.position );
};

function line( ctx, a, b ) {
  ctx.beginPath();
  ctx.moveTo( a.x, a.y );
  ctx.lineTo( b.x, b.y );
  ctx.stroke();
  ctx.closePath();
}


// --------------------------  -------------------------- //

function Ribbon( props ) {
  extend( this, props );

  // create particles

  this.particles = [];
  this.constraints = [];

  var x = this.controlPoint.x + this.width / 2;
  var leftParticles = this.leftParticles = this.createParticles( x );
  x = this.controlPoint.x - this.width / 2;
  var rightParticles = this.rightParticles = this.createParticles( x );
  
  // create constraints
  var stick = new StickConstraint( leftParticles[0], rightParticles[0], this.width );
  this.constraints.push( stick );
  // control particle
  this.controlParticle = new Particle( this.controlPoint.x, this.controlPoint.y );
  var pin = new PinConstraint( this.controlParticle, this.controlPoint );
  this.constraints.push( pin );

  var leftLink = new LinkConstraint( this.controlParticle, leftParticles[0], this.width / 2 );
  var rightLink = new LinkConstraint( this.controlParticle, rightParticles[0], this.width / 2 );
  this.constraints.push( leftLink );
  this.constraints.push( rightLink );

  for ( var i=1, len = leftParticles.length; i < len; i++ ) {
    var link = new LinkConstraint( leftParticles[i], rightParticles[i], this.width );
    this.constraints.push( link );
  }
}

Ribbon.prototype.createParticles = function( x ) {
  var particles = [];
  for ( var i=0; i < this.sections; i++ ) {
    var y = this.controlPoint.y + this.sectionLength * i;
    var particle = new Particle( x, y );
    particles.push( particle );
    this.particles.push( particle );
    // create links
    if ( i > 0 ) {
      var link = new ChainLinkConstraint( particles[ i-1 ], particle, this.sectionLength, this.chainLinkShiftEase );
      this.constraints.push( link );
    }
  }
  return particles;
};

Ribbon.prototype.update = function() {
  var i, len;
  for ( i=0, len = this.particles.length; i < len; i++ ) {
    this.particles[i].update( this.friction, this.gravity );
  }

  for ( i=0, len = this.constraints.length; i < len; i++ ) {
    this.constraints[i].update();
  }
  for ( i=0, len = this.constraints.length; i < len; i++ ) {
    this.constraints[i].update();
  }
};


Ribbon.prototype.render = function( ctx ) {


  ctx.fillStyle = '#E11';
  ctx.strokeStyle = '#E11';
  var particle;
  for ( var i=0, len = this.leftParticles.length - 1; i < len; i++ ) {
    ctx.beginPath();
    var particle0 = this.leftParticles[i];
    ctx.moveTo( particle0.position.x, particle0.position.y );
    particle = this.rightParticles[i];
    ctx.lineTo( particle.position.x, particle.position.y );
    particle = this.rightParticles[ i+1 ];
    ctx.lineTo( particle.position.x, particle.position.y );
    particle = this.leftParticles[ i+1 ];
    ctx.lineTo( particle.position.x, particle.position.y );
    ctx.lineTo( particle0.position.x, particle0.position.y );
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

};

// --------------------------  -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = canvas.width = window.innerWidth - 0;
var h = canvas.height = window.innerHeight - 0;

canvas.addEventListener( 'mousedown', onMousedown, false );
var rect = canvas.getBoundingClientRect();
canvasOffsetLeft = rect.left;
canvasOffsetTop = rect.top;

// --------------------------  -------------------------- //

var friction = 0.75;
var gravity = new Vector( 0, 0.4 );
var movementStrength = 0.9;
var springStrength = 0.5;

var follicles = [];
var pins = [];


// --------------------------  -------------------------- //

var ribbon = new Ribbon({
  controlPoint: new Vector( 130, 180 ),
  sections: 60,
  width: 40,
  sectionLength: 10,
  friction: 0.92,
  gravity: new Vector( 0, 0.2 ),
  chainLinkShiftEase: 0.9
});


// --------------------------  -------------------------- //

var didMouseDown = false;
var rotateAngle = 0;
var rotateSpeed = 0.06;
var rotateLength = h/3;

function update() {
  ribbon.update();

  if ( !didMouseDown ) {
    rotateAngle += rotateSpeed;
    var x = w/2 + Math.cos( rotateAngle * 1.3 ) * h/4;
    var y = h/2 + Math.sin( rotateAngle ) * h/4;
    move( x, y );
  }

}

function render() {
  ctx.clearRect( 0, 0, w, h );
  ribbon.render( ctx );
}

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// --------------------------  -------------------------- //

var canvasOffsetLeft, canvasOffsetTop;


function onMousedown( event ) {
  event.preventDefault();
  moveDragPoint( event );
  didMouseDown = true;
  window.addEventListener( 'mousemove', moveDragPoint, false );
  window.addEventListener( 'mouseup', onMouseup, false );
}

function moveDragPoint( event ) {
  var x = parseInt( event.pageX - canvasOffsetLeft, 10 );
  var y = parseInt( event.pageY - canvasOffsetTop, 10 );
  move( x, y );
}

function move( x, y ) {
  ribbon.controlPoint.setCoords( x, y );
}

function onMouseup() {
  window.removeEventListener( 'mousemove', moveDragPoint, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
}
