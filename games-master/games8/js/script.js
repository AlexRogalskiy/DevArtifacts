
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

var TAU = Math.PI * 2;
var PI = Math.PI;


// --------------------------  -------------------------- //

function line( ctx, a, b ) {
  ctx.beginPath();
  ctx.moveTo( a.x, a.y );
  ctx.lineTo( b.x, b.y );
  ctx.stroke();
  ctx.closePath();
}

function dot( ctx, v ) {
  ctx.beginPath();
  ctx.arc( v.x, v.y, 5, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}

function fillCircle( ctx, v, radius ) {
  ctx.beginPath();
  ctx.arc( v.x, v.y, radius, 0, TAU );
  ctx.fill();
  ctx.closePath();
}


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
  this.previousPosition.set( this.position );
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


function PinConstraint( particle, position ) {
  this.particle = particle;
  this.position = position;
}

PinConstraint.prototype.update = function() {
  this.particle.position.set( this.position );
};

PinConstraint.prototype.render = function() {};

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

function SpringAngleConstraint( particleA, particleB, strength, angle ) {
  this.particleA = particleA;
  this.particleB = particleB;
  this.strength = strength;
  if ( angle === undefined ) {
    var delta = Vector.subtract( particleB.position, particleA.position );
    this.angle = delta.angle;
  } else {
    this.angle = angle;
  }
}

SpringAngleConstraint.prototype.update = function() {
  var positionA = this.particleA.position;
  var positionB = this.particleB.position;
  var delta = Vector.subtract( positionB, positionA );
  var deltaAngle = delta.angle;
  var angleDiff = normalizeAngle( this.angle - deltaAngle );
  angleDiff = angleDiff > Math.PI ? angleDiff - Math.PI * 2 : angleDiff;
  var springAngle = deltaAngle + Math.PI / 2;
  var springForce = new Vector( Math.cos( springAngle ), Math.sin( springAngle ) );
  springForce.scale( angleDiff * this.strength * Math.PI * 2 );
  this.particleB.position.add( springForce );
};

SpringAngleConstraint.prototype.render = function( ctx ) {
  var end = Vector.addDistance( this.particleA.position, 50, this.angle );
  ctx.strokeStyle = 'hsla(0, 0%, 50%, 0.5)';
  line( ctx, this.particleA.position, end );
};


function ChainLinkConstraint( particleA, particleB, distance, shiftEase ) {
  this.particleA = particleA;
  this.particleB = particleB;
  this.distance = distance;
  this.distanceSqrd = distance * distance;
  this.shiftEase = shiftEase === undefined ? 0.85 : shiftEase;
}

// --------------------------  -------------------------- //

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

// --------------------------  -------------------------- //

function Ribbon( props ) {
  extend( this, props );

  // create particles

  this.particles = [];
  this.constraints = [];

  this.controlParticle = new Particle( this.controlPoint.x, this.controlPoint.y );
  var pin = new PinConstraint( this.controlParticle, this.controlPoint );
  this.constraints.push( pin );

  var x = this.controlPoint.x;
  for ( var i=0; i < this.sections; i++ ) {
    var y = this.controlPoint.y + this.sectionLength * i;
    var particle = new Particle( x, y );
    this.particles.push( particle );
    // create links
    var linkParticle = i === 0 ? this.controlParticle : this.particles[ i-1 ];
    var link = new ChainLinkConstraint( linkParticle, particle, this.sectionLength, this.chainLinkShiftEase );
    this.constraints.push( link );
  }
}

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

Ribbon.prototype.addBreeze = function( v ) {
  for ( var i=0, len = this.particles.length; i < len; i++ ) {
    this.particles[i].position.add( v );
  }
};

Ribbon.prototype.render = function( ctx ) {
  ctx.strokeStyle = '#B19';
  ctx.lineWidth = this.width;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo( this.controlParticle.x, this.controlParticle.y );
  for ( var i=0, len = this.particles.length; i < len; i++ ) {
    var particle = this.particles[i];
    ctx.lineTo( particle.position.x, particle.position.y );
  }
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;
};

// --------------------------  -------------------------- //

// x, y
// angle
// springStrength
// curl
// segmentLength
// friction
// gravity
// movementStrength
function Follicle( props ) {
  extend( this, props );
  delete this.x;
  delete this.y;
  this.particleA = new Particle( props.x, props.y );
  var positionB = Vector.addDistance( this.particleA.position, this.segmentLength, this.angle );
  this.particleB = new Particle( positionB.x, positionB.y );
  this.stick0 = new StickConstraint( this.particleA, this.particleB );
  this.springAngle0 = new SpringAngleConstraint( this.particleA, this.particleB, this.springStrength, this.angle );

  var angle1 = this.angle + this.curl;
  var positionC =  Vector.addDistance( this.particleB.position, this.segmentLength, angle1 );
  this.particleC = new Particle( positionC.x, positionC.y );
  this.stick1 = new StickConstraint( this.particleB, this.particleC );
  this.springAngle1 = new SpringAngleConstraint( this.particleB, this.particleC, this.springStrength, angle1 );

  this.controlPoint = new Vector( props.x, props.y );
  this.pin = new PinConstraint( this.particleA, this.controlPoint );
}

Follicle.prototype.update = function() {
  this.particleA.update( this.friction, this.gravity );
  this.particleB.update( this.friction, this.gravity );
  this.particleC.update( this.friction, this.gravity );
  this.stick0.update();
  this.springAngle0.update();
  // update springAngle1's angle
  var delta = Vector.subtract( this.particleB.position, this.particleA.position );
  this.springAngle1.angle = delta.angle + this.curl;

  this.pin.update();
  this.stick1.update();
  this.springAngle1.update();
};

Follicle.prototype.move = function( movement ) {
  movement = Vector.copy( movement );
  this.controlPoint.add( movement );
  movement.x *= this.movementStrength.x;
  movement.y *= this.movementStrength.y;
  // movement.scale( this.movementStrength );
  this.particleB.position.add( movement );
  this.particleC.position.add( movement );
  this.particleB.previousPosition.add( movement );
  this.particleC.previousPosition.add( movement );
};

Follicle.prototype.render = function( ctx ) {

  ctx.lineWidth = 46;
  // ctx.strokeStyle = 'hsla(0, 100%, 50%, 0.4)';
  ctx.strokeStyle = '#433';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo( this.particleA.position.x, this.particleA.position.y );
  ctx.quadraticCurveTo( this.particleB.position.x, this.particleB.position.y,
    this.particleC.position.x, this.particleC.position.y );
  ctx.stroke();
  ctx.closePath();
  // reset line props
  ctx.lineCap = 'butt';
  ctx.lineWidth = 1;

};

// --------------------------  -------------------------- //

// everything connects to coccyx
// coccyx
// shoulderLength
// leftShoulderOffset
// rightShoulderOffset
// leftHipOffset
// rightHipOffset
// armLength
// legLength
// footLength
// position
// hipRunAmplitude
// shoulderRunAmplitude

var PI = Math.PI;
var TAU = PI * 2;


function Skeleton( props ) {
  extend( this, props );
  this.coccyx = new Vector();
  this.neck = new Vector();
  this.resetRunCycle();
  this.idleCycleTheta = 0;
  this.frame = 0;
  this.state = {
    // runningRight: 1,
    // runningLeft: 1,
    idleRight: 1,
    // neutral: 1
  };
  this.animationFrames = {};
}

Skeleton.prototype.update = function() {
  this.frame++;
  for ( var aniName in this.animationFrames ) {
    this.animationFrames[ aniName ]++;
  }
  // this.runCycleTheta += this.state == 'running' ? 0.07 : 0;
  // this.runCycleSpeed = Math.min( 0.15, this.runCycleSpeed + 0.0003 );
  this.runCycleTheta += this.runCycleSpeed;
  this.idleCycleTheta += 0.05;
  this.coccyx.set( this.position );
  // get and set correct rig

  this.updateTransitionState();
  var completeRig = {};
  var rigs = {};
  for ( var rigName in this.state ) {
    var rig = extend( {}, neutralRig );
    var rigMethod = 'get' + capitalize( rigName ) + 'Rig';
    extend( rig, this[ rigMethod ]() );
    rigs[ rigName ] = rig;
  }

  for ( var prop in neutralRig ) {
    var value = 0;
    for ( rigName in rigs ) {
      value += rigs[ rigName ][ prop ] * this.state[ rigName ];
    }
    completeRig[ prop ] = value;
  }

  this.setRig( completeRig );
};

Skeleton.prototype.getRig = function( rigName ) {
  var rigMethod = 'get' + capitalize( rigName ) + 'Rig';
  var rig = extend( {}, neutralRig );
  return extend( rig, this[ rigMethod ]() );
};

function capitalize( str ) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Skeleton.prototype.resetRunCycle = function() {
  this.runCycleSpeed = 0.15;
  this.runCycleTheta = TAU * 1/16;
};

// --------------------------  -------------------------- //

Skeleton.prototype.startAnimation = function( aniName ) {
  this.animationFrames[ aniName ] = 0;
};

// --------------------------  -------------------------- //




var zeroPoint = new Vector();

var neutralRig = {
  offsetX: 0,
  offsetY: 0,
  offset: zeroPoint,
  headRotateY: 0,
  shouldersRotateY: 0,
  shouldersY: 0,
  hipsRotateY: 0,
  hipsY: 0,
  leftElbowAngle: 0,
  leftWristAngle: 0,
  leftKneeAngle: 0,
  leftAnkleAngle: 0,
  leftToeAngle: 0,
  leftFootRotateY: 0,
  rightElbowAngle: 0,
  rightWristAngle: 0,
  rightKneeAngle: 0,
  rightAnkleAngle: 0,
  rightToeAngle: 0,
  rightFootRotateY: 0
};

Skeleton.prototype.getNeutralRig = function() {
  return neutralRig;
};

// get positions and angles for rig, not vectors
Skeleton.prototype.getRunningRightRig = function() {
  var rig = {};
  var quadFactor = 1.5;

  var sin = Math.sin( this.runCycleTheta );
  var cos = Math.cos( this.runCycleTheta );
  var quadSine = quadWave( sin, quadFactor );
  var leftQuadSine = cos < 0 ? quadSine : sin;
  var rightQuadSine = cos > 0 ? quadSine : sin;

  var lift = Math.abs( Math.cos( this.runCycleTheta - 1 ) ) * -40 + 20;
  rig.offsetY = lift;
  //
  rig.headRotateY = 0.2;

  // shoulder
  rig.shouldersRotateY = ( sin + 1 ) * 0.6;
  // elbow
  rig.leftElbowAngle = -rightQuadSine * 1.2 + 0.4;
  rig.rightElbowAngle = leftQuadSine * 1.2 + 0.4;
  // wrist
  rig.leftWristAngle = -leftQuadSine * 0.4 - TAU/4;
  rig.rightWristAngle = rightQuadSine * 0.4 - TAU/4;
  // hip
  rig.hipsRotateY = ( -sin + 1 ) * 0.6;
  // knee
  rig.leftKneeAngle = leftQuadSine * 1.1 - 0.07;
  rig.rightKneeAngle = -rightQuadSine * 1.1 - 0.07;

  var ankleTheta = this.runCycleTheta - TAU/8;
  var normAnkleTheta = normalizeAngle( ankleTheta );
  var ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.leftAnkleAngle = ankleAngle * 1.7;

  ankleTheta = this.runCycleTheta - TAU/8 + TAU/2;
  normAnkleTheta = normalizeAngle( ankleTheta );
  ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.rightAnkleAngle = ankleAngle * 1.7;

  rig.leftFootRotateY = TAU/4;
  rig.rightFootRotateY = TAU/4;

  return rig;
};


// get positions and angles for rig, not vectors

// /*
Skeleton.prototype.getRunningLeftRig = function() {
  var rig = {};
  var quadFactor = 1.5;

  var sin = Math.sin( this.runCycleTheta + TAU/2 );
  var cos = Math.cos( this.runCycleTheta + TAU/2 );
  var quadSine = quadWave( sin, quadFactor );
  var quadSineA = cos < 0 ? quadSine : sin;
  var quadSineB = cos > 0 ? quadSine : sin;

  var lift = Math.abs( Math.cos( this.runCycleTheta - 1 ) ) * -40 + 20;
  rig.offsetY = lift;
  //
  rig.headRotateY = -0.2;

  // shoulder
  rig.shouldersRotateY = ( sin + 1 ) * -0.6;
  // elbow
  rig.leftElbowAngle = -quadSineA * 1.2 - 0.4;
  rig.rightElbowAngle = quadSineB * 1.2 - 0.4;
  // wrist
  rig.leftWristAngle = -quadSineA * 0.4 + TAU/4;
  rig.rightWristAngle = quadSineB * 0.4 + TAU/4;
  // hip
  rig.hipsRotateY = ( -sin + 1 ) * -0.6;
  // knee
  rig.leftKneeAngle = quadSineB * 1.1 + 0.07;
  rig.rightKneeAngle = -quadSineA * 1.1 + 0.07;

  var ankleTheta = this.runCycleTheta - TAU/8;
  var normAnkleTheta = normalizeAngle( ankleTheta );
  var ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.leftAnkleAngle = ankleAngle * -1.7;

  ankleTheta = this.runCycleTheta - TAU/8 + TAU/2;
  normAnkleTheta = normalizeAngle( ankleTheta );
  ankleAngle = Math.max( 0, Math.sin( normAnkleTheta * 2/3 ) );
  rig.rightAnkleAngle = ankleAngle * -1.7;

  rig.leftFootRotateY = -TAU/4;
  rig.rightFootRotateY = -TAU/4;

  return rig;
};
/**/

// i: sin or cos
// b: square factor
function quadWave( i, b ) {
  return Math.sqrt( ( 1 + b * b ) / ( 1 + b * b * i * i ) ) * i;
}

Skeleton.prototype.getIdleRightRig = function() {
  var sin = quadWave( Math.sin( this.idleCycleTheta ), 1 );
  var rig = {
    headRotateY: 0.2,
    shouldersRotateY: sin * -0.2 + 0.4,
    hipsRotateY: 0.6,
    leftFootRotateY: TAU/4,
    rightFootRotateY: TAU/4
  };

  rig.shouldersY = sin * -5 - 5;
  var elbowAngle = sin * 0.1 + 0.1;
  rig.leftElbowAngle = elbowAngle;
  rig.rightElbowAngle = -elbowAngle;
  var wristAngle = sin * -0.1 - 0.1;
  rig.leftWristAngle = wristAngle;
  rig.rightWristAngle = -wristAngle;
  return rig;
};

Skeleton.prototype.getIdleLeftRig = function() {
  var sin = quadWave( Math.sin( this.idleCycleTheta ), 1 );
  var rig = {
    headRotateY: -0.2,
    shouldersRotateY: sin * 0.2 - 0.4,
    hipsRotateY: -0.6,
    leftFootRotateY: -TAU/4,
    rightFootRotateY: -TAU/4
  };

  rig.shouldersY = sin * -5 - 5;
  var elbowAngle = sin * 0.1 + 0.1;
  rig.leftElbowAngle = elbowAngle;
  rig.rightElbowAngle = -elbowAngle;
  var wristAngle = sin * -0.1 - 0.1;
  rig.leftWristAngle = wristAngle;
  rig.rightWristAngle = -wristAngle;
  return rig;
};


Skeleton.prototype.setRig = function( rig ) {
  // save rig
  this.rig = rig;
  // coccyx
  this.coccyx.add({ x: rig.offsetX, y: rig.offsetY });

  this.setRigSide( rig, 'left', -1 );
  this.setRigSide( rig, 'right', 1 );
};

Skeleton.prototype.setRigSide = function( rig, side, direction ) {
  // shoulder
  this[ side + 'Shoulder' ] = Vector.copy( this.coccyx );
  var shoulderCosine = Math.cos( rig.shouldersRotateY ) * direction;
  this[ side + 'Shoulder' ] = Vector.add( this.coccyx, {
    x: shoulderCosine * this.shoulderLength,
    y: -this.torsoLength + rig.shouldersY
  });
  // neck
  this.neck.set( this.coccyx );
  this.neck.y = this[ side + 'Shoulder' ].y;
  // chest
  this[ side + 'Chest' ] = Vector.add( this.neck, {
    x: this.chestPosition.x * shoulderCosine,
    y: this.chestPosition.y
  });
  this[ side + 'Chest' ].x += Math.sin( rig.shouldersRotateY ) * this.chestPosition.z;
  // elbow
  var elbowAngle = rig[ side + 'ElbowAngle' ] + TAU/4;
  this[ side + 'Elbow' ] = Vector.addDistance( this[ side + 'Shoulder' ], this.armLength,
    elbowAngle );
  // wrist
  var wristAngle = rig[ side + 'WristAngle' ] + elbowAngle;
  this[ side + 'Wrist' ] = Vector.addDistance( this[ side + 'Elbow' ], this.armLength,
    wristAngle );
  // hip
  var hipCosine = Math.cos( rig.hipsRotateY ) * direction;
  var hipX = this.hipLength * hipCosine;
  this[ side + 'Hip' ] = Vector.add( this.coccyx, { x: hipX, y: 0 } );
  // butt
  this[ side + 'Butt' ] = Vector.add( this.coccyx, {
    x: this.buttPosition.x * hipCosine,
    y: this.buttPosition.y
  } );
  this[ side + 'Butt' ].x += Math.sin( rig.hipsRotateY ) * this.buttPosition.z;
  // knee
  var kneeAngle = rig[ side + 'KneeAngle' ] + TAU/4;
  this[ side + 'Knee' ] = Vector.addDistance( this[ side + 'Hip' ], this.legLength,
    kneeAngle );
  // ankle
  var ankleAngle = rig[ side + 'AnkleAngle' ] + kneeAngle;
  this[ side + 'Ankle' ] = Vector.addDistance( this[ side + 'Knee' ], this.legLength,
    ankleAngle );
  // toe
  var toeAngle = rig[ side + 'ToeAngle' ] + ankleAngle - TAU/4;
  var footLength = this.footLength * Math.sin( rig[ side + 'FootRotateY' ] );
  this[ side + 'Toe' ] = Vector.addDistance( this[ side + 'Ankle' ], footLength,
    toeAngle );

};

// --------------------------  -------------------------- //

Skeleton.prototype.transition = function( rigName, frameCount ) {
  this.transitionFrame = this.frame;
  this.transitionFrameCount = frameCount;
  this.previousState = extend( {}, this.state );
  this.transitionEndRig = rigName;
  this.isTransitioning = true;
  // console.log('start transition', rigName );
};

Skeleton.prototype.updateTransitionState = function() {
  if ( !this.isTransitioning ) {
    return;
  }

  this.state = {};
  var i = ( this.frame - this.transitionFrame ) / this.transitionFrameCount;
  if ( i >= 1 ) {
    // end transition
    this.state[ this.transitionEndRig ] = 1;
    this.isTransitioning = false;
    // console.log('end transition', this.transitionEndRig );
    return;
  }
  for ( var rigName in this.previousState ) {
    this.state[ rigName ] = this.previousState[ rigName ] * ( 1 - i );
  }
  this.state[ this.transitionEndRig ] = ( this.state[ this.transitionEndRig ] || 0 ) + i;
  // this.state[ this.transitionEndRig ] = i;
};


// -------------------------- render -------------------------- //

Skeleton.prototype.render = function( ctx ) {
  ctx.fillStyle = 'hsla(200, 100%, 35%, 0.8)';
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.8)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  // line( ctx, this.torso, this.head );

  line( ctx, this.leftShoulder, this.leftElbow );
  line( ctx, this.leftElbow, this.leftWrist );
  line( ctx, this.leftHip, this.leftKnee );
  line( ctx, this.leftKnee, this.leftAnkle );
  line( ctx, this.leftAnkle, this.leftToe );

  line( ctx, this.rightShoulder, this.rightElbow );
  line( ctx, this.rightElbow, this.rightWrist );
  line( ctx, this.rightHip, this.rightKnee );
  line( ctx, this.rightKnee, this.rightAnkle );
  line( ctx, this.rightAnkle, this.rightToe );

  line( ctx, this.leftShoulder, this.rightShoulder );
  line( ctx, this.leftShoulder, this.coccyx );
  line( ctx, this.rightShoulder, this.coccyx );
  line( ctx, this.leftHip, this.rightHip );

  dot( ctx, this.leftShoulder );
  dot( ctx, this.leftChest );
  dot( ctx, this.leftElbow );
  dot( ctx, this.leftWrist );
  dot( ctx, this.leftHip );
  dot( ctx, this.leftButt );
  dot( ctx, this.leftKnee );
  dot( ctx, this.leftAnkle );
  dot( ctx, this.leftToe );

  dot( ctx, this.rightShoulder );
  dot( ctx, this.rightChest );
  dot( ctx, this.rightElbow );
  dot( ctx, this.rightWrist );
  dot( ctx, this.rightHip );
  dot( ctx, this.rightButt );
  dot( ctx, this.rightKnee );
  dot( ctx, this.rightAnkle );
  dot( ctx, this.rightToe );

  // dot( ctx, this.torso );
  dot( ctx, this.coccyx );
  dot( ctx, this.neck );
  // dot( ctx, this.head );
};

// --------------------------  -------------------------- //




var Cole = {};

Cole.init = function( position ) {

  // ----- skeleton ----- //

  this.skeleton = new Skeleton({
    position: new Vector( position.x, position.y ),
    shoulderLength: 50,
    torsoLength: 48,
    hipLength: 35,
    buttPosition: { x: 20, y: -10, z: -10 }, // relative to coccyx, x is reversed for left
    chestPosition: { x: 25, y: 5, z: 8 }, // offset from neck, x is reversed for left
    armLength: 32,
    legLength: 30,
    footLength: 25,
    runningShoulderAmplitude: 15,
    runningHipAmplitude: 10
  });

  // ----- hair ----- //

  this.follicles = [];

  var hairProps = {
    friction: 0.85,
    gravity: new Vector( 0, 0.4 ),
    springStrength: 0.3,
    movementStrength: new Vector( 0.95, 0.01 )
  };

  // position are relative to skeleton.position
  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x -28,
    y: -180,
    segmentLength: 49,
    angle: -1.75,
    curl: 1.17
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 0,
    y: -190,
    segmentLength: 58,
    angle: -1.33,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 25,
    y: -185,
    segmentLength: 49,
    angle: -1.05,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 38,
    y: -177,
    segmentLength: 47,
    angle: -0.63,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 45,
    y: -160,
    segmentLength: 41,
    angle: -0.29,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 40,
    y: -138,
    segmentLength: 35,
    angle: 0.05,
    curl: 1.15
  })));

  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 20,
    y: -124,
    segmentLength: 25,
    angle: 0.45,
    curl: 0.8
  })));
  // middle bottom
  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + 5,
    y: -124,
    segmentLength: 21,
    angle: Math.PI / 2,
    curl: 0
  })));
  // compare to 7
  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + -10,
    y: -124,
    segmentLength: 25,
    angle: 2.7,
    curl: -0.8
  })));
  // compare to 6
  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + -22,
    y: -138,
    segmentLength: 41,
    angle: 3.20,
    curl: -1.15
  })));
  // compare to 5
  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + -35,
    y: -160,
    segmentLength: 41,
    angle: -2.8,
    curl: -1.15
  })));
  // compare to 4
  this.follicles.push( new Follicle( extend( hairProps, {
    x: position.x + -20,
    y: -185,
    segmentLength: 47,
    angle: -2.5,
    curl: -1.15
  })));

  // ----- ribbons ----- //

  this.ribbonA = new Ribbon({
    controlPoint: new Vector( position.x, -110 ),
    sections: 30,
    width: 40,
    sectionLength: 9,
    friction: 0.95,
    gravity: new Vector( 0, 0.2 ),
    chainLinkShiftEase: 0.9
  });

  this.ribbonB = new Ribbon({
    controlPoint: new Vector( position.x, -110 ),
    sections: 30,
    width: 40,
    sectionLength: 9,
    friction: 0.9,
    gravity: new Vector( 0, 0.25 ),
    chainLinkShiftEase: 0.9
  });



};


var headImg = new Image();
var isHeadImgLoaded;
headImg.onload = function() {
  isHeadImgLoaded = true;
};
headImg.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/cole-face-repeat.png';

Cole.update = function() {

  this.previousNeck = Vector.copy( this.skeleton.neck || new Vector() );

  this.skeleton.update();

  var neckMovement = this.previousNeck.y === 0 ? new Vector() :
    Vector.subtract( this.skeleton.neck, this.previousNeck );

  this.ribbonA.controlPoint.add( neckMovement );
  this.ribbonB.controlPoint.add( neckMovement );
  this.ribbonA.update();
  this.ribbonB.update();
  var i, len;

  for ( i=0, len = this.follicles.length; i < len; i++ ) {
    var follicle = this.follicles[i];
    follicle.move( neckMovement );
    follicle.update();
  }

};

// var scale = 1;
var brownSkin = '#963';
var black = '#433';
var magenta = '#B19';

Cole.render = function( ctx ) {
  ctx.save();
  ctx.translate( 0, this.skeleton.position.y );
  this.ribbonA.render( ctx );
  this.ribbonB.render( ctx );

  for ( var i=0, len = this.follicles.length; i < len; i++ ) {
    this.follicles[i].render( ctx );
  }

  ctx.restore();
  Cole.renderBody( ctx );
};

Cole.renderBody = function( ctx ) {

  var skeleton = this.skeleton;

  // arm in back
  if ( Math.sin( this.skeleton.rig.shouldersRotateY ) >= 0 ) {
    Cole.renderRightIlloArm( ctx );
  } else {
    Cole.renderLeftIlloArm( ctx );
  }
  // legs
  ctx.fillStyle = black;
  ctx.fillRect( skeleton.leftButt.x, skeleton.leftButt.y,
    skeleton.rightButt.x - skeleton.leftButt.x, 42 );
  if ( Math.sin( skeleton.rig.hipsRotateY ) >= 0 ) {
    Cole.renderIlloLeg( ctx, 'right' );
    Cole.renderIlloLeg( ctx, 'left' );
  } else {
    Cole.renderIlloLeg( ctx, 'left' );
    Cole.renderIlloLeg( ctx, 'right' );
  }

  ctx.fillStyle = black;
  // chest
  fillCircle( ctx, skeleton.leftChest, 25 );
  fillCircle( ctx, skeleton.rightChest, 25 );
  // head

  ctx.save();
  ctx.translate( skeleton.neck.x - 135/2, skeleton.neck.y - 145 );
  Cole.renderHead( ctx );
  ctx.restore();

  // arm in front
  if ( Math.sin( skeleton.rig.shouldersRotateY ) >= 0 ) {
    Cole.renderLeftIlloArm( ctx );
  } else {
    Cole.renderRightIlloArm( ctx );
  }
  // inspect
  // ctx.save();
  // ctx.translate( 250, 0 );
  // skeleton.render( ctx );
  // ctx.restore();
};

Cole.renderLeftIlloArm = function( ctx ) {
  var skeleton = this.skeleton;
  renderIlloArm( ctx, skeleton.leftShoulder, skeleton.leftElbow, skeleton.leftWrist );
};

Cole.renderRightIlloArm = function( ctx ) {
  var skeleton = this.skeleton;
  renderIlloArm( ctx, skeleton.rightShoulder, skeleton.rightElbow, skeleton.rightWrist, true );
};

function renderIlloArm( ctx, shoulder, elbow, wrist, hasBand ) {
  ctx.strokeStyle = brownSkin;
  ctx.lineWidth = 45;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  line( ctx, shoulder, elbow );
  ctx.strokeStyle = hasBand ? magenta : brownSkin;
  line( ctx, elbow, wrist );
  ctx.fillStyle = brownSkin;
  fillCircle( ctx, wrist, 28 );
}


Cole.renderIlloLeg = function( ctx, side ) {
  var hip = this.skeleton[ side + 'Hip' ];
  var butt = this.skeleton[ side + 'Butt' ];
  var knee = this.skeleton[ side + 'Knee' ];
  var ankle = this.skeleton[ side + 'Ankle' ];
  var toe = this.skeleton[ side + 'Toe' ];
  var footRotateY = this.skeleton.rig[ side + 'FootRotateY' ];

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 55;
  // boot
  ctx.strokeStyle = magenta;
  line( ctx, knee, ankle );
  line( ctx, ankle, toe );
  // thigh
  ctx.strokeStyle = black;
  line( ctx, hip, knee );
  // butt
  ctx.fillStyle = black;
  fillCircle( ctx, butt, 42 );
  // toe circle
  ctx.fillStyle = magenta;
  fillCircle( ctx, toe, Math.max( 0, Math.cos( footRotateY ) ) * 55/2  );
};


var faceCanvas = document.createElement('canvas');
var faceCtx = faceCanvas.getContext('2d');
faceCanvas.width = 400;
faceCanvas.height = 200;
faceCtx.fillStyle = magenta;
faceCtx.fillRect( 0, 0, 400, 200 );
faceCtx.fillStyle = brownSkin;
faceCtx.beginPath();
faceCtx.arc( 200, 260, 160, TAU/2, TAU );
faceCtx.fill();
faceCtx.closePath();

var headCanvas = document.createElement('canvas');
var headCtx = headCanvas.getContext('2d');
headCanvas.width = 135;
headCanvas.height = 135;



Cole.renderHead = function( ctx ) {
  headCtx.clearRect( 0, 0, 135, 135 );
  headCtx.beginPath();
  headCtx.arc( 135/2, 135/2, 135/2, 0, TAU );
  headCtx.fill();
  headCtx.closePath();
  headCtx.globalCompositeOperation = 'source-in';
  var headX = -135 * 4 + ( this.skeleton.rig.headRotateY / TAU ) * 135 * 3;
  headCtx.drawImage( headImg, headX, -40 );
  headCtx.globalCompositeOperation = 'source-over';
  ctx.drawImage( headCanvas, 0, 0 );
};


// --------------------------  -------------------------- //



function KeyboardController() {
  // hashes of keys that are down or up
  this.keysDown = {};
  this.onceKeysDown = {};
  this.keysUp = {};
  // hashes of things to do when key goes down/up/repeat down
  this.onceKeyDownActions = {};
  this.repeatKeyDownActions = {};
  this.keyUpActions = {};
  // bind events
  document.addEventListener( 'keydown', this, false );
  document.addEventListener( 'keyup', this, false );
}

// -------------------------- events -------------------------- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
KeyboardController.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

KeyboardController.prototype.onkeydown = function( event ) {
  var keyCode = event.keyCode;
  // dismiss keyboard auto-repeats
  if ( !this.keysDown[ keyCode ] ) {
    // keep track of keys that are down
    this.keysDown[ keyCode ] = true;
    this.onceKeysDown[ keyCode ] = true;
  }

  if ( this.onceKeyDownActions[ keyCode] || this.repeatKeyDownActions[ keyCode ] ) {
    event.preventDefault();
  }
};

KeyboardController.prototype.onkeyup = function( event ) {
  var keyCode = event.keyCode;
  this.keysUp[ keyCode ] = true;
  delete this.keysDown[ keyCode ];
  delete this.onceKeysDown[ keyCode ];
  if ( this.keyUpActions[ keyCode] ) {
    event.preventDefault();
  }
};

// -------------------------- update -------------------------- //

KeyboardController.prototype.update = function() {
  var keyCode;
  for ( keyCode in this.keysDown ) {
    this.triggerAction( keyCode, this.repeatKeyDownActions );
    if ( this.onceKeysDown[ keyCode ] ) {
      this.triggerAction( keyCode, this.onceKeyDownActions );
      // reset flag, only trigger update once, keydown event might repeat
      delete this.onceKeysDown[ keyCode ];
    }
  }

  for ( keyCode in this.keysUp ) {
    this.triggerAction( keyCode, this.keyUpActions );
  }
  // reset keyup hash
  this.keysUp = {};
};

KeyboardController.prototype.triggerAction = function( keyCode, actions ) {
  var action = actions[ keyCode ];
  if ( action ) {
    action();
  }
};


// --------------------------  -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var h = canvas.height;
var w = canvas.width = window.innerWidth - 30;
var TAU = Math.PI * 2;

var logger1 = document.querySelector('.logger1 code');
// var logger2 = document.querySelector('.logger2 code');

// --------------------------  -------------------------- //

Cole.init({ x: w, y: 300 });

var coleVelocityX = 0;

// --------------------------  -------------------------- //

var keyboard = new KeyboardController();

// left
keyboard.onceKeyDownActions[37] = function() {
  Cole.skeleton.transition( 'runningLeft', 16 );
};
// right
keyboard.onceKeyDownActions[39] = function() {
  Cole.skeleton.transition( 'runningRight', 16 );
};
// left
keyboard.repeatKeyDownActions[37] = function() {
  coleVelocityX -= 4;
};
// right
keyboard.repeatKeyDownActions[39] = function() {
  coleVelocityX += 4;
};

// left
keyboard.keyUpActions[37] = function() {
  Cole.skeleton.transition( 'idleLeft', 16 );
};
// right
keyboard.keyUpActions[39] = function() {
  Cole.skeleton.transition( 'idleRight', 16 );
};

// --------------------------  -------------------------- //

function update() {
  coleVelocityX *= 0.85;
  Cole.skeleton.position.x += coleVelocityX;
  Cole.skeleton.position.x = Math.max( 100, Math.min( w*2 - 100, Cole.skeleton.position.x ) );

  keyboard.update();
  Cole.update();

}



function render() {
  ctx.clearRect( 0, 0, w, h );

  ctx.save();
  ctx.translate( 0, 100 );
  ctx.scale( 0.5, 0.5 );
  Cole.render( ctx );
  ctx.restore();
}

var isAnimating = false;

function animate() {
  ctx.clearRect( 0, 0, w, h );
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
  isAnimating = true;
  animate();
}

// --------------------------  -------------------------- //


start();
