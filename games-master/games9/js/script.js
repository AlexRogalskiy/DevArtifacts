// this code is a work-in-progress.
// ~~** Bless this mess **~~

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;

var blockSize = 20;

// --------------------------  -------------------------- //

function Vector( x, y ) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.set = function( v ) {
  this.x = v.x;
  this.y = v.y;
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

// --------------------------  -------------------------- //

/*jshint unused: false, undef: true */
/*global blockSize: false */

function getAngle( a, b ) {
  return Math.atan2( b.y - a.y, b.x - a.x );
}

function getMagnitude( x, y ) {
  return Math.sqrt( x*x + y*y );
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}

// extends objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function getSlope( a, b ) {
  return ( b.y - a.y ) / ( b.x - a.x );
}

function getYIntersect( point, slope ) {
  return point.y - slope * point.a;
}

function normalizeAngle( angle ) {
  return modulo( angle, Math.PI * 2 );
}

function getDegrees( angle ) {
  return angle* ( 180 / Math.PI );
}

// round values to 3 digits to resolve JS rounding errors
function roundPoint( point ) {
  return {
    x: Math.round( point.x * 1000 ) / 1000,
    y: Math.round( point.y * 1000 ) / 1000
  };
}

function getLineMinMaxXY( pointA, pointB ) {
  pointA = roundPoint( pointA );
  pointB = roundPoint( pointB );
  return {
    minX: Math.min( pointA.x, pointB.x ),
    minY: Math.min( pointA.y, pointB.y ),
    maxX: Math.max( pointA.x, pointB.x ),
    maxY: Math.max( pointA.y, pointB.y )
  };
}

function getIsSamePoint( pointA, pointB ) {
  return pointA.x == pointB.x && pointA.x == pointB.x;
}

function getLinesSharePoint( lineST, lineUV ) {
  // return getIsSamePoint( lineST.pointA, lineUV.pointA ) ||
}

function getSlope( a, b ) {
  return ( b.y - a.y ) / ( b.x - a.x );
}

// y intercept
function getYInt( point, slope ) {
  return point.y - slope * point.x;
}

function getMidPoint( pointA, pointB ) {
  return {
    x: ( pointA.x + pointB.x ) / 2,
    y: ( pointA.y + pointB.y ) / 2
  };
}

// --------------------------  -------------------------- //

function Particle( x, y ) {
  this.position = new Vector( x, y );
  this.velocity = new Vector();
  this.accel = new Vector();
  this.previousPosition = new Vector( x, y );
  this.jumpingFrames = 0;
}

// var zeroPoint = { x: 0, y: 0 };

Particle.prototype.update = function() {
  this.updateJump();
  this.integrate();
};

Particle.prototype.integrate = function() {
  // set previous position
  this.previousPosition.set( this.position );
  // integrate velocity
  this.velocity.add( this.accel );
  // apply friction
  this.velocity.scale( 0.95 );
  // integrate position
  this.position.add( this.velocity );
  if ( isNaN( this.position.x ) ) {
    debugger
  }
  // reset acceleration
  this.accel.zero();
  this.isStatic = this.position.equals( this.previousPosition );
};

Particle.prototype.applyForce = function( force ) {
  this.accel.add( force );
};

// --------------------------  -------------------------- //


Particle.prototype.startJump = function() {
  // console.log('start jump');
  this.isJumping = true;
};

Particle.prototype.endJump = function() {
  // console.log('end jump');
  this.isJumping = false;
  this.jumpingFrames = 0;
};

var jumpForce = new Vector( 0, -2 );

// apply jump force for only 3 frames
Particle.prototype.updateJump = function() {
  if ( !this.isJumping ) {
    return;
  }
  var jumpI = 1 - (this.jumpingFrames / 10);
  jumpI *= jumpI;
  this.applyForce( new Vector( 0, -4 * jumpI ) );
  this.jumpingFrames++;
  // can only apply jump force for 3 frames
  if ( this.jumpingFrames >= 10 ) {
    this.endJump();
  }
};


// --------------------------  -------------------------- //

function circle( x, y, radius ) {
  ctx.beginPath();
  ctx.arc( x, y, radius, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}

var plusOneBlock = new Vector( 1, 1 );




Particle.prototype.render = function() {
  // big circle
  ctx.fillStyle = 'hsla(0, 0%, 10%, 1)';
  circle( this.position.x, this.position.y, 2 );
  // dot
  ctx.fillStyle = 'hsla(0, 100%, 50%, 0.5)';
  circle( this.position.x, this.position.y, blockSize * 0.5  );
  // movement path block
  if ( !this.minBlock ) {
    return;
  }
  var positionBlock = Vector.copy( this.minBlock );
  var sizeBlock = Vector.subtract( this.maxBlock, positionBlock );
  sizeBlock.add( plusOneBlock );
  sizeBlock.scale( blockSize );
  positionBlock.scale( blockSize );
  // ctx.fillStyle = 'hsla(240, 100%, 50%, 0.2)';
  // ctx.fillRect( positionBlock.x, positionBlock.y, sizeBlock.x, sizeBlock.y );
  // logger1.textContent = [this.position.x, this.position.y];
  // logger2.textContent = [this.minBlock.x, this.minBlock.y, this.maxBlock.x, this.maxBlock.y];
  // console.log( positionBlock.x, positionBlock.y, sizeBlock.x, sizeBlock.y );
  // debugger
  delete this.minBlock;
  delete this.maxBlock;
};

// --------------------------  -------------------------- //

function Face( pointA, pointB ) {
  this.pointA = pointA;
  this.pointB = pointB;
  this.angle = getAngle( this.pointA, this.pointB );
  this.slope = getSlope( this.pointA, this.pointB );
  this.yInt = getYInt( this.pointA, this.slope );
  // debugger
  // console.log( this.pointA, this.pointB, blockSize );
}

function isSameLinear( a, b ) {
  return a == b || ( Math.abs( a ) == Infinity && Math.abs( b ) == Infinity );
}

function getIntersectionPoint( pointA, pointB, pointC, pointD ) {
  var slopeAB = getSlope( pointA, pointB );
  var yIntAB = getYInt( pointA, slopeAB );
  var slopeCD = getSlope( pointC, pointD );
  var yIntCD = getYInt( pointC, slopeCD );

  var isSameSlope = isSameLinear( slopeAB, slopeCD );
  var isSameYInt = isSameLinear( yIntAB, yIntCD );

  // collinear
  if ( isSameSlope && isSameYInt ) {
    // return particle position
    return Vector.copy( pointB );
  }

  // if parallel
  if ( isSameSlope ) {
    return;
  }

 // if AB is a single point
  if ( pointA.x == pointB.x && pointA.y == pointB.y ) {
    var isPointOnLine = slopeCD * pointA.x + yIntCD == pointA.y;
    if ( isPointOnLine ) {
      // return particle position
      return Vector.copy( pointB );
    } else {
      return;
    }
  }

  var x, y;
  if ( Math.abs( slopeCD ) == Infinity ) {
    // CD vertical 
    x = pointC.x;
    y = slopeAB * pointC.x + yIntAB;
    return new Vector( x, y );
  }

  if ( Math.abs( slopeAB ) == Infinity ) {
    x = pointA.x;
    y = slopeCD * pointA.x + yIntCD;
    return new Vector( x, y );
  }


  x = ( yIntCD - yIntAB ) / ( slopeAB - slopeCD );
  y = slopeAB * x + yIntAB;
  if ( isNaN(x) || isNaN(y) ) {
    debugger;
  }

  return new Vector( x, y );
}

// round values to 3 digits to resolve JS rounding errors
function roundPoint( point ) {
  return new Vector(
    Math.round( point.x * 1000 ) / 1000,
    Math.round( point.y * 1000 ) / 1000
  );
}

function getIsPointWithinSegment( pointA, pointB, pointC ) {
  pointA = roundPoint( pointA );
  pointB = roundPoint( pointB );
  pointC = roundPoint( pointC );
  var minX = Math.min( pointA.x, pointB.x );
  var minY = Math.min( pointA.y, pointB.y );
  var maxX = Math.max( pointA.x, pointB.x );
  var maxY = Math.max( pointA.y, pointB.y );

  // check if line is horizontal
  var isWithinHorizontal = pointA.x == pointB.x ? pointC.x == pointA.x :
    pointC.x >= minX && pointC.x <= maxX;
  // check if line is horizontal
  var isWithinVertical = pointA.y == pointB.y ? pointC.y == pointA.y :
    pointC.y >= minY && pointC.y <= maxY;

  return isWithinHorizontal && isWithinVertical;
}

function extendPoint( point, slope ) {
  var yInt = getYInt( point, slope );
  var x = point.x + 100;
  var y = slope * ( point.x + 100 ) + yInt;
  return new Vector( x, y );
}

// given line AB, what side is point C on
  // http://stackoverflow.com/a/22668810/182183
function getLineSide( pointA, pointB, pointC ) {
  return ( pointB.x - pointA.x ) * ( pointC.y - pointA.y ) -
    ( pointC.x - pointA.x ) * ( pointB.y - pointA.y );
}

Face.prototype.getLineSide = function( point ) {
  return getLineSide( this.pointA, this.pointB, point );
};

Face.prototype.applyCollision = function( particle ) {
  var currentLineSide = this.getLineSide( particle.position );
  // if its 'in front of' line, no collision
  // on other side of line
  if ( currentLineSide < 0 ) {
    return;
  }

  // disregard stationary particles
  // if ( particle.velocity.x === 0 && particle.velocity.x === 0 ) {
  //   return;
  // }

  var intersectionPoint = this.getMovementIntersection( particle );

  if ( !intersectionPoint ) {
    return;
  }

  var didCollide = this.getDidCollide( particle, intersectionPoint );
  if ( !didCollide ) {
    return;
  }

  var collisionPoint, previousIntersect;

  // slope perpendicular to face
  if ( Math.abs( this.slope ) == Infinity ) {
    // vertical
    previousIntersect = new Vector(
      this.pointA.x,
      particle.previousPosition.y
    );
    collisionPoint = new Vector(
      this.pointA.x,
      particle.position.y
    );
  } else if ( this.slope === 0 ) {
    // horizontal
    previousIntersect = new Vector(
      particle.previousPosition.x,
      this.pointA.y
    );
    collisionPoint = new Vector(
      particle.position.x,
      this.pointA.y
    );
  } else {
    var normalSlope = 1 / this.slope * -1;
    var extendPreviousPoint = extendPoint( particle.previousPosition, normalSlope );
    var extendCollisionPoint = extendPoint( particle.position, normalSlope );
    previousIntersect = getIntersectionPoint( particle.previousPosition, extendPreviousPoint, this.pointA, this.pointB );
    collisionPoint = getIntersectionPoint( particle.position, extendCollisionPoint, this.pointA, this.pointB );
  }

  var thePoint = new Vector( 80, 35 );

  if ( this.pointA.equals( thePoint ) && collisionPoint.x < 80 ) {
    // debugger
  }

  // update point position
  particle.position.set( collisionPoint );
  // update velocity
  // particle.velocity = Vector.subtract( collisionPoint, particle.previousPosition );
  // see demo 08-point-line-collision
  // new velocity is distance traveled parallel to face
  particle.velocity = Vector.subtract( collisionPoint, previousIntersect );
};

Face.prototype.getMovementIntersection = function( particle ) {
  return getIntersectionPoint( particle.previousPosition, particle.position, this.pointA, this.pointB );
};

Face.prototype.getDidCollide = function( particle, intersectionPoint ) {
  var isWithinMovement = getIsPointWithinSegment( particle.previousPosition, particle.position, intersectionPoint );
  var isWithinFace = this.getIsPointWithinSegment( intersectionPoint );
  var isOnFace = this.getIsPointWithinSegment( particle.position );
  var wasOnFace = this.getIsPointWithinSegment( particle.previousPosition );
  var isIntersectingFace = isWithinFace || isOnFace || wasOnFace;
  return isWithinMovement && isIntersectingFace;
};

Face.prototype.getIsPointWithinSegment = function( point ) {
  return getIsPointWithinSegment( this.pointA, this.pointB, point );
};

// -----  ----- //

Face.prototype.render = function() {
  // face
  ctx.strokeStyle = '#222';
  ctx.beginPath();
  ctx.moveTo( this.pointA.x, this.pointA.y );
  ctx.lineTo( this.pointB.x, this.pointB.y );
  ctx.stroke();
  ctx.closePath();
  // behind face
  ctx.strokeStyle = 'hsla(0, 0%, 50%, 0.5)';
  ctx.beginPath();
  var axOffset = Math.cos( this.angle + Math.PI / 4 ) * blockSize * 0.3;
  var ayOffset = Math.sin( this.angle + Math.PI / 4 ) * blockSize * 0.3;
  var bxOffset = Math.cos( this.angle + Math.PI * 3/4 ) * blockSize * 0.3;
  var byOffset = Math.sin( this.angle + Math.PI * 3/4 ) * blockSize * 0.3;
  ctx.moveTo( this.pointA.x + axOffset, this.pointA.y + ayOffset );
  ctx.lineTo( this.pointB.x + bxOffset, this.pointB.y + byOffset );
  ctx.stroke();
  ctx.closePath();
};

// A is position of pointA
// B represents po
var facePointsASCII = {
  // on right, facing right
  ']': '  A' +
       '   ' +
       '  B',
  // on left, facing left
  '[': 'B  ' +
       '   ' +
       'A  ',
  // top facing up
  '-': 'A B' +
       '   ' +
       '   ',
  // bottom facing down
  '_': '   ' +
       '   ' +
       'B A',
  // low slant up and left, skinny part
  '.': '   ' +
       'A  ' +
       '  B',
  // low slant up and left, fat part
  ':': 'A  ' +
       '  B' +
       '   ',
  // low slant up and right, skinny part
  ',': '   ' +
       '  B' +
       'A  ',
  // low slant up and right, fat part
  ';': '  B' +
       'A  ' +
       '   ',
  // low slant down and left, skinny part
  '`': 'B  ' +
       '  A' +
       '   ',
  // low slant down and left, fat part
  '~': '   ' +
       'B  ' +
       '  A',
  // low slant down and right, skinny part
  '*': '  A' +
       'B  ' +
       '   ',
  // low slant up and right, fat part
  '8': '   ' +
       '  A' +
       'B  ',
  // diagonal up and right
  'Z': '  B' +
       '   ' +
       'A  ',
  // diagonal up and left
  'S': 'A  ' +
       '   ' +
       '  B',
  // diagonal down and right
  'z': '  A' +
       '   ' +
       'B  ',
  // diagonal down and left
  's': 'B  ' +
       '   ' +
       '  A',
  // high slant up and right, fat part
  'D': ' B ' +
       '   ' +
       'A  ',
  // high slant up and right, skinny part
  'd': '  B' +
       '   ' +
       ' A ',
  // high slant up and left, fat part
  'B': ' A ' +
       '   ' +
       '  B',
  // high slant up and left, skinny part
  'b': 'A  ' +
       '   ' +
       ' B ',
  // high slant down and right, fat part
  '$': 'B  ' +
       '   ' +
       ' A ',
  // high slant down and right, skinny part
  '4': ' B ' +
       '   ' +
       '  A',
  // high slant down and left, fat part
  '%': '  A' +
       '   ' +
       ' B ',
  // high slant down and left, skinny part
  '5': ' A ' +
       '   ' +
       'B  '

};

var asciiPoints = {
  0: new Vector( 0, 0 ),
  1: new Vector( 0.5, 0 ),
  2: new Vector( 1, 0 ),

  3: new Vector( 0, 0.5 ),
  4: new Vector( 0.5, 0.5 ),
  5: new Vector( 1, 0.5 ),

  6: new Vector( 0, 1 ),
  7: new Vector( 0.5, 1 ),
  8: new Vector( 1, 1 )
};

// --------------------------  -------------------------- //


function Environment( asciiSource ) {
  this.faces = [];
  this.faceGrid = {};
  // parse source
  var maxX = 0;
  var lines = asciiSource.split('\n');
  for ( var blockY = 0, maxY = lines.length; blockY < maxY; blockY++ ) {
    var line = lines[ blockY ];
    this.parseSourceLine( line, blockY );
    maxX = Math.max( maxX, line.length );
  }
  maxX *= blockSize;
  maxY *= blockSize;

}

Environment.prototype.parseSourceLine = function( line, blockY ) {
  for ( var blockX = 0, len = line.length; blockX < len; blockX++ ) {
    var character = line[ blockX ];
    if ( character && character != ' ' ) {
      var block = new Vector( blockX, blockY );
      this.createFace( character, block );
    }
  }
};

Environment.prototype.createFace = function( character, block ) {
  var pointASCII = facePointsASCII[ character ];
  // parse points 
  var aIndex = pointASCII.indexOf('A');
  var bIndex = pointASCII.indexOf('B');
  var pointA = Vector.add( asciiPoints[ aIndex ], block );
  var pointB = Vector.add( asciiPoints[ bIndex ], block );
  pointA.scale( blockSize );
  pointB.scale( blockSize );

  var face = new Face( pointA, pointB );
  this.faces.push( face );
  // register face to grid this.faceGrid[ blockX ][ blockY ]
  var column = this.faceGrid[ block.x ];
  // create column if not already there
  if ( !column ) {
    column = this.faceGrid[ block.x ] = {};
  }
  column[ block.y ] = face;

  this.checkJoints( face );
};

function isSamePoint( pointA, pointB ) {
  return pointA.x == pointB.x && pointA.y == pointB.y;
}

Environment.prototype.checkJoints = function( face ) {
  // check all other faces to see if these two faces share same point and angle is accute
  for ( var i=0, len = this.faces.length; i < len; i++ ) {
    var otherFace = this.faces[i];
    var isABSame = isSamePoint( face.pointA, otherFace.pointB );
    var isBASame = isSamePoint( face.pointB, otherFace.pointA );
    var angleDelta = normalizeAngle( otherFace.angle - face.angle );
    if ( isABSame && angleDelta && angleDelta < Math.PI ) {
      // A, [A/B], B
      extendFace( face, 'pointA' );
      extendFace( otherFace, 'pointB' );
    } else if ( isBASame && angleDelta && angleDelta > Math.PI ) {
      extendFace( otherFace, 'pointA' );
      extendFace( face, 'pointB' );
    }
  }
};


function extendFace( face, pointName ) {
  var otherPointName = pointName == 'pointA' ? 'pointB' : 'pointA';
  var direction;
  if ( Math.abs( face.slope ) < 1 ) {
    // horizontal, change x values
    direction = Math.sign( face[ pointName ].x - face[ otherPointName ].x );
    face[ pointName ].x += 5 * direction;
    face[ pointName ].y = face.slope * face[ pointName ].x + face.yInt;
  } else {
    // vertical, change y values
    direction = Math.sign( face[ pointName ].y - face[ otherPointName ].y );
    face[ pointName ].y += 5 * direction;
    face[ pointName ].x = Math.abs( face.yInt ) == Infinity ? face[ pointName ].x :
      ( face[ pointName ].y - face.yInt ) / face.slope;
  }
}
// -----  ----- //

Environment.prototype.getGridFace = function( block ) {
  var column = this.faceGrid[ block.x ];
  return column && column[ block.y ];
};

Environment.prototype.applyCollisions = function( particle ) {
  var beforePosition = Vector.copy( particle.position );
  var faces = this.getMovementPathFaces( particle );
  // do it twice to handle joints
  this.applyFaceCollisions( particle, faces );
  var afterPosition = Vector.copy( particle.position );
  if ( particle.position.x < 80 ) {
    // debugger
  }
};

var minusOneBlock = new Vector( -1, -1 );
var plusOneBlock = new Vector( 1, 1 );


var isLogging = false;
var loggingFrames = 0;

var corner = new Vector( 80, 40 );

Environment.prototype.getMovementPathFaces = function( particle ) {
  // TODO don't check if particle is stationary
  var previousBlock = Vector.copy( particle.previousPosition );
  var currentBlock = Vector.copy( particle.position );
  previousBlock.block( blockSize );
  currentBlock.block( blockSize );
  // nudgePositionBlock( previousBlock, particle.previousPosition, particle.velocity, 1 );
  // nudgePositionBlock( currentBlock, particle.position, particle.velocity, -1 );
  var minBlock = getMinVector( previousBlock, currentBlock );
  var maxBlock = getMaxVector( previousBlock, currentBlock );
  minBlock.add( minusOneBlock );
  maxBlock.add( plusOneBlock );
  particle.minBlock = minBlock;
  particle.maxBlock = maxBlock;
  // debugger
  // get faces with in grid of movement path
  var faces = [];
  for ( var row = minBlock.y; row <= maxBlock.y; row++ ) {
    for ( var col = minBlock.x; col <= maxBlock.x; col++ ) {
      var column = this.faceGrid[ col ];
      var face = column && column[ row ];
      if ( face ) {
        faces.push( face );
      }
    }
  }
  if ( particle.position.equals( corner ) ) {
    // debugger;
    isLogging
  }
  return faces;
};

function nudgePositionBlock( block, position, velocity, direction ) {
  block.x += position.x % blockSize === 0 ? Math.sign( velocity.x || 1 ) * direction : 0;
  block.y += position.y % blockSize === 0 ? Math.sign( velocity.y || 1 ) * direction : 0;
}

function getMinVector( a, b ) {
  return new Vector(
    Math.min( a.x, b.x ),
    Math.min( a.y, b.y )
  );
}

function getMaxVector( a, b ) {
  return new Vector(
    Math.max( a.x, b.x ),
    Math.max( a.y, b.y )
  );
}

Environment.prototype.applyFaceCollisions = function( particle, faces ) {
  for ( var i=0, len = faces.length; i < len; i++ ) {
    var face = faces[i];
    face.applyCollision( particle );
  }
};

// -----  ----- //

Environment.prototype.render = function() {
  this.renderFaces();
};

Environment.prototype.renderFaces = function() {
  for ( var i=0, len = this.faces.length; i < len; i++ ) {
    this.faces[i].render();
  }
};

// --------------------------  -------------------------- //

var envSource =
'                                __     __           \n' +
'   ____        __________     8*  $  8*  s  zs      \n' +
'  ]    `~    8*          [   z    48*     sz  s     \n' +
'  ]      s  z            [  ]                  s    \n' +
'  ]       $%             [  ]                   [   \n' +
'  ]       45    ,;:.     [  z        Z--S      Z    \n' +
'   :.           s  z     [ z         s__z     Z     \n' +
'    ]            sz     Z z                   `~    \n' +
'   8*                   sz    ,;            S   `~  \n' +
'  ]           db            ,;     ,;------  S    `[\n' +
'  ]           DB          ,;     ,;           S    [\n' +
'  ]          Z  S        Z     ,;        b         [\n' +
'  ]  ,;:.  ,;    :.      [               B  Z      [\n' +
'  z--    --        ------           Z:.   --       [\n' +
' z            ,;b        ,;b        [              [\n' +
']           ,;  B      ,;  B        [             d \n' +
']  ------   $  8*      $  8*   -----     ZS       D \n' +
']           48*        48*              Z  S     Z  \n' +
']               ,;--:.                         ,;   \n' +
' ---------------      -------------------------     \n';








// --------------------------  -------------------------- //

// --------------------------  -------------------------- //

var env = new Environment( envSource );
var particles = [
  new Particle( 80, 40 )
];

var particle = particles[0];

// var particle = new Particle( 200, 160 );


// hash of keys that are pressed down
var keysDown = {};
var onceKeysDown = {};
var keysUp = {};

function onKeyDown( event ) {
  // dismiss keyboard auto-repeats
  if ( !keysDown[ event.keyCode ] ) {
    keysDown[ event.keyCode ] = true;
    onceKeysDown[ event.keyCode ] = true;
  }

  if ( onceKeyDownUpdates[ event.keyCode] || repeatKeyDownUpdates[ event.keyCode ] ) {
    event.preventDefault();
  }
}

function onKeyUp( event ) {
  keysUp[ event.keyCode ] = true;
  delete keysDown[ event.keyCode ];
  if ( keyUpUpdates[ event.keyCode] ) {
    event.preventDefault();
  }
}

document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );

var leftForce = new Vector( -0.4, 0 );
var rightForce = new Vector( 0.4, 0 );

var downForce = new Vector( 0, 0.4 );

var onceKeyDownUpdates = {
  // up
  38: function() {
    eachParticles( function( particle ) {
      particle.startJump();
    });
  }
};

var keyUpUpdates = {
  // up
  38: function() {
    eachParticles( function( particle ) {
      particle.endJump();
    });
  }
};

var repeatKeyDownUpdates = {
  // left
  37: function() {
    eachParticles( function( particle ) {
      particle.applyForce( leftForce );
    });
  },
  // right
  39: function() {
    eachParticles( function( particle ) {
      particle.applyForce( rightForce );
    });
  }
};



function eachParticles( fn ) {
  for ( var i=0, len = particles.length; i < len; i++ ) {
    var particle = particles[i];
    if ( typeof fn == 'string' ) {
      particle[ fn ]();
    } else {
      fn( particle );
    }
  }
}

var gravity = new Vector( 0, 0.4 );

function update() {
  keyHashUpdate();
  // reset keyup hash
  keysUp = {};

  eachParticles( function( particle ) {
    particle.applyForce( gravity );
  });

  eachParticles('update');

  eachParticles( function( particle ) {
    env.applyCollisions( particle );
  });
}

function keyHashUpdate() {
  var keycode;
  for ( keycode in keysDown ) {
    triggerKeyUpdate( keycode, repeatKeyDownUpdates );
    // reset flag, only trigger update once, keydown event might repeat
    if ( onceKeysDown[ keycode ] ) {
      triggerKeyUpdate( keycode, onceKeyDownUpdates );
      delete onceKeysDown[ keycode ];
    }
  }
  for ( keycode in keysUp ) {
    triggerKeyUpdate( keycode, keyUpUpdates );
  }
}

function triggerKeyUpdate( keycode, updates ) {
  var keyUpdate = updates[ keycode ];
  if ( keyUpdate ) {
    keyUpdate();
  }
}

function render() {
  ctx.clearRect( 0, 0, w, h );
  env.render();
  eachParticles('render');
}


var isAnimating = false;

function animate() {
  update();
  render();
  if ( isAnimating ) {
    requestAnimationFrame( animate );
  }
}

function stop() {
  isAnimating = false;
}

function start() {
  // particle.y = 160;
  isAnimating = true;
  animate();
}

start();
