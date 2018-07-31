// Hi! This 3D model was built using the <canvas> 2D drawing API.
// It uses lineWidth to give the illusion of form.
// I'm working on a library to make these sort of 3D illustrations,
// But it's not ready for prime-time. Stay tuned! *~ dd ~*

// -------------------------- utils -------------------------- //

var TAU = Math.PI * 2;

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function lerp( a, b, t ) {
  return ( b - a ) * t + a;
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}

// -------------------------- Vector3 -------------------------- //

function Vector3( position ) {
  this.set( position );
}

Vector3.prototype.set = function( pos ) {
  pos = Vector3.sanitize( pos );
  this.x = pos.x;
  this.y = pos.y;
  this.z = pos.z;
  return this;
};

Vector3.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
  this.rotateZ( rotation.z );
  this.rotateY( rotation.y );
  this.rotateX( rotation.x );
  return this;
};

Vector3.prototype.rotateZ = function( angle ) {
  rotateProperty( this, angle, 'x', 'y' );
};

Vector3.prototype.rotateX = function( angle ) {
  rotateProperty( this, angle, 'y', 'z' );
};

Vector3.prototype.rotateY = function( angle ) {
  rotateProperty( this, angle, 'x', 'z' );
};

function rotateProperty( vec, angle, propA, propB ) {
  if ( angle % TAU === 0 ) {
    return;
  }
  var cos = Math.cos( angle );
  var sin = Math.sin( angle );
  var a = vec[ propA ];
  var b = vec[ propB ];
  vec[ propA ] = a*cos - b*sin;
  vec[ propB ] = b*cos + a*sin;
}

Vector3.prototype.add = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x += vec.x;
  this.y += vec.y;
  this.z += vec.z;
  return this;
};

Vector3.prototype.multiply = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x *= vec.x;
  this.y *= vec.y;
  this.z *= vec.z;
  return this;
};

Vector3.prototype.transform = function( translation, rotation, scale ) {
  this.multiply( scale );
  this.rotate( rotation );
  this.add( translation );
};

Vector3.prototype.lerp = function( vec, t ) {
  this.x = lerp( this.x, vec.x, t );
  this.y = lerp( this.y, vec.y, t );
  this.z = lerp( this.z, vec.z, t );
  return this;
};

// ----- utils ----- //

// add missing properties
Vector3.sanitize = function( vec ) {
  vec = vec || {};
  vec.x = vec.x || 0;
  vec.y = vec.y || 0;
  vec.z = vec.z || 0;
  return vec;
};

// -------------------------- Anchor -------------------------- //

function Anchor( options ) {
  this.create( options );
}

Anchor.prototype.create = function( options ) {
  // set defaults & options
  extend( this, this.constructor.defaults );
  options = options || {};
  this.setOptions( this, options );

  // transform
  this.translate = new Vector3( options.translate );
  this.rotate = new Vector3( options.rotate );
  var scale = extend( { x: 1, y: 1, z: 1 }, options.scale );
  this.scale = new Vector3( scale );
  // origin
  this.origin = new Vector3();
  this.renderOrigin = new Vector3();
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

Anchor.defaults = {};

Anchor.optionKeys = Object.keys( Anchor.defaults ).concat([
  'rotate',
  'translate',
  'scale',
  'addTo',
]);

Anchor.prototype.setOptions = function( item, options ) {
  var optionKeys = this.constructor.optionKeys;

  for ( var key in options ) {
    if ( optionKeys.includes( key ) ) {
      item[ key ] = options[ key ];
    }
  }
};

Anchor.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Anchor.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate, this.scale );
};

Anchor.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
};

Anchor.prototype.transform = function( translation, rotation, scale ) {
  this.renderOrigin.transform( translation, rotation, scale );
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Anchor.prototype.updateGraph = function() {
  this.update();
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
  });
  // z-sort
  this.flatGraph.sort( sortBySortValue );
};

function sortBySortValue( a, b ) {
  return b.sortValue - a.sortValue;
}

Anchor.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Anchor.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getFlatGraph();
};

// return Array of self & all child graph items
Anchor.prototype.getFlatGraph = function() {
  var flatGraph = [ this ];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
};

Anchor.prototype.updateSortValue = function() {
  this.sortValue = this.renderOrigin.z;
};

// ----- render ----- //

Anchor.prototype.render = function() {};

Anchor.prototype.renderGraph = function( ctx ) {
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// ----- misc ----- //

Anchor.prototype.copy = function( options ) {
  // copy options
  var itemOptions = {};
  var optionKeys = this.constructor.optionKeys;
  optionKeys.forEach( function( key ) {
    itemOptions[ key ] = this[ key ];
  }, this );
  // add set options
  this.setOptions( itemOptions, options );
  var ItemClass = this.constructor;
  return new ItemClass( itemOptions );
};

Anchor.prototype.normalizeRotate = function() {
  this.rotate.x = modulo( this.rotate.x, TAU );
  this.rotate.y = modulo( this.rotate.y, TAU );
  this.rotate.z = modulo( this.rotate.z, TAU );
};

// ----- subclass ----- //

function getSubclass( Super ) {
  return function( defaults ) {
    // create constructor
    function Item( options ) {
      this.create( options );
    }

    Item.prototype = Object.create( Super.prototype );
    Item.prototype.constructor = Item;

    Item.defaults = extend( {}, Super.defaults );
    Item.defaults = extend( Item.defaults, defaults );
    Item.optionKeys = Super.optionKeys.slice(0)
      .concat( Object.keys( Item.defaults ) );
    Item.subclass = getSubclass( Item );

    return Item;
  };
}

Anchor.subclass = getSubclass( Anchor );

// -------------------------- PathAction -------------------------- //

function PathAction( method, points, previousPoint ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapVectorPoint );
  this.previousPoint = previousPoint;
  this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector3(), new Vector3() ];
  }
}

function mapVectorPoint( point ) {
  return new Vector3( point );
}

PathAction.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  });
};

PathAction.prototype.transform = function( translation, rotation, scale ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.transform( translation, rotation, scale );
  });
};

PathAction.prototype.render = function( ctx ) {
  this[ this.method ]( ctx );
};

PathAction.prototype.move = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.moveTo( point.x, point.y );
};

PathAction.prototype.line = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.lineTo( point.x, point.y );
};

PathAction.prototype.bezier = function( ctx ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

PathAction.prototype.arc = function( ctx ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, 9/16 );
  cp1.set( end ).lerp( corner, 9/16 );
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

// -------------------------- Shape -------------------------- //

var Shape = Anchor.subclass({
  stroke: true,
  fill: false,
  color: 'black',
  lineWidth: 1,
  closed: true,
  rendering: true,
  path: [ {} ],
  front: { z: -1 },
});

var protoCreate = Anchor.prototype.create;

Shape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );

  this.updatePathActions();

  // front
  this.front = new Vector3( options.front || this.front );
  this.renderFront = new Vector3( this.front );
};

var defaultShapeKeys = Object.keys( Shape.defaults );
Shape.optionKeys = Shape.optionKeys.concat( defaultShapeKeys ).concat([
  'width',
  'height',
  'front',
  'backfaceHidden',
]);

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

// parse path into PathActions
Shape.prototype.updatePathActions = function() {
  var previousPoint;
  this.pathActions = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    var isInstruction = keys.length === 1 && actionNames.includes( method ) &&
      Array.isArray( points );

    if ( !isInstruction ) {
      method = 'line';
      points = [ pathPart ];
    }

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var pathAction = new PathAction( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = pathAction.endRenderPoint;
    return pathAction;
  });
};

// ----- update ----- //

Shape.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // TODO, only transform these if backfaceHidden for perf?
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  // transform points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.transform( translation, rotation, scale );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.pathActions.forEach( function( pathAction ) {
    sortValueTotal += pathAction.endRenderPoint.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.pathActions.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  var length = this.pathActions.length;
  if ( !this.rendering || !length ) {
    return;
  }
  // hide backface
  var isFacingBack = this.renderFront.z > this.renderOrigin.z;
  if ( this.backfaceHidden && isFacingBack ) {
    return;
  }
  // render dot or path
  var isDot = length == 1;
  if ( isDot ) {
    this.renderDot( ctx );
  } else {
    this.renderPath( ctx );
  }
};

// Safari does not render lines with no size, have to render circle instead
Shape.prototype.renderDot = function( ctx ) {
  ctx.fillStyle = this.color;
  var point = this.pathActions[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.renderPath = function( ctx ) {
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth;

  // render points
  ctx.beginPath();
  this.pathActions.forEach( function( pathAction ) {
    pathAction.render( ctx );
  });
  var isTwoPoints = this.pathActions.length == 2 &&
    this.pathActions[1].method == 'line';
  if ( !isTwoPoints && this.closed ) {
    ctx.closePath();
  }
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
};

// -------------------------- Ellipse -------------------------- //

var Ellipse = Shape.subclass({
  width: 1,
  height: 1,
  closed: false,
});

Ellipse.optionKeys = Ellipse.optionKeys.concat([
  'width',
  'height',
]);

var protoCreate = Ellipse.prototype.create;

Ellipse.prototype.create = function( options ) {
  options.path = getEllipsePath( options );
  protoCreate.call( this, options );
};

function getEllipsePath( options ) {
  var x = options.width / 2;
  var y = options.height / 2;
  var path = [
    { x: 0, y: -y },
    { arc: [ // top right
      { x: x, y: -y },
      { x: x, y: 0 },
    ]},
    { arc: [ // bottom right
      { x: x, y: y },
      { x: 0, y: y },
    ]},
    { arc: [ // bottom left
      { x: -x, y: y },
      { x: -x, y: 0 },
    ]},
    { arc: [ // bottom left
      { x: -x, y: -y },
      { x: 0, y: -y },
    ]},
  ];
  return path;
}

// -------------------------- Rect -------------------------- //

var Rect = Shape.subclass();

Rect.optionKeys = Rect.optionKeys.concat([
  'width',
  'height',
]);

var protoCreate = Rect.prototype.create;

Rect.prototype.create = function( options ) {
  options.path = getRectPath( options );
  protoCreate.call( this, options );
};

function getRectPath( options ) {
  var w = ( options.width || 1 ) / 2;
  var h = ( options.height || 1 ) / 2;
  var path = [
    { x: -w, y: -h },
    { x:  w, y: -h },
    { x:  w, y:  h },
    { x: -w, y:  h },
  ];
  return path;
}

// -------------------------- Group -------------------------- //

var Group = Anchor.subclass({
  updateSort: false,
});

// ----- update ----- //

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
    sortValueTotal += item.sortValue;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.flatGraph.length;

  if ( this.updateSort ) {
    this.flatGraph.sort( function( a, b ) {
      return b.sortValue - a.sortValue;
    });
  }
};

// ----- render ----- //

Group.prototype.render = function( ctx ) {
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getFlatGraph = function() {
  return [ this ];
};


Group.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Group.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getChildFlatGraph();
};

// get flat graph only used for group
// do not include in parent flatGraphs
Group.prototype.getChildFlatGraph = function() {
  // do not include self
  var flatGraph = [];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
};

// -------------------------- Dragger -------------------------- //

// quick & dirty drag event stuff
// messes up if multiple pointers/touches

// event support, default to mouse events
var downEvent = 'mousedown';
var moveEvent = 'mousemove';
var upEvent = 'mouseup';
if ( window.PointerEvent ) {
  // PointerEvent, Chrome
  downEvent = 'pointerdown';
  moveEvent = 'pointermove';
  upEvent = 'pointerup';
} else if ( 'ontouchstart' in window ) {
  // Touch Events, iOS Safari
  downEvent = 'touchstart';
  moveEvent = 'touchmove';
  upEvent = 'touchend';
}

function noop() {}

function Dragger( options ) {
  this.startElement = options.startElement;
  this.onPointerDown = options.onPointerDown || noop;
  this.onPointerMove = options.onPointerMove || noop;
  this.onPointerUp = options.onPointerUp || noop;
  
  this.startElement.addEventListener( downEvent, this );
}

Dragger.prototype.handleEvent = function( event ) {
  var method = this[ 'on' + event.type ];
  if ( method ) {
    method.call( this, event );
  }
};

Dragger.prototype.onmousedown =
Dragger.prototype.onpointerdown = function( event ) {
  this.pointerDown( event, event );
};

Dragger.prototype.ontouchstart = function( event ) {
  this.pointerDown( event, event.changedTouches[0] );
};

Dragger.prototype.pointerDown = function( event, pointer ) {
  event.preventDefault();
  this.dragStartX = pointer.pageX;
  this.dragStartY = pointer.pageY;
  window.addEventListener( moveEvent, this );
  window.addEventListener( upEvent, this );
  this.onPointerDown( pointer );
};

Dragger.prototype.ontouchmove = function( event ) {
  // HACK, moved touch may not be first
  this.pointerMove( event, event.changedTouches[0] );
};

Dragger.prototype.onmousemove =
Dragger.prototype.onpointermove = function( event ) {
  this.pointerMove( event, event );
};

Dragger.prototype.pointerMove = function( event, pointer ) {
  event.preventDefault();
  var moveX = pointer.pageX - this.dragStartX;
  var moveY = pointer.pageY - this.dragStartY;
  this.onPointerMove( pointer, moveX, moveY );
};

Dragger.prototype.onmouseup = 
Dragger.prototype.onpointerup =
Dragger.prototype.ontouchend =
Dragger.prototype.pointerUp = function( event ) {
  window.removeEventListener( moveEvent, this );
  window.removeEventListener( upEvent, this );
  this.onPointerUp( event );
};

//-------- colors --------//


var red = '#F44';
var navy = '#247';
var blue = '#5AE';
var gold = '#FB3';
var white = 'white';

/* globals red, blue, navy, gold, white */

// -------------------------- makeBuilding -------------------------- //

function makeBuilding( options ) {

  var wallX = options.width/2;
  var wallY = options.height;
  var wallZ = options.depth/2;

  // collect walls
  var building = {};

  // south/noth walls
  [ true, false ].forEach( function( isSouth ) {
    var wallTZ = isSouth ? -wallZ : wallZ;
    var wallGroup = new Group({
      addTo: options.addTo,
      translate: { z: wallTZ },
    });

    var wallPath = [
      { x: -wallX, y: -wallY }
    ];

    if ( options.gable == 'ns' ) {
      wallPath.push({ x: 0, y: -wallY - wallX });
    }

    wallPath = wallPath.concat([
      { x: wallX, y: -wallY },
      { x: wallX, y: 0 },
      { x: -wallX, y: 0 },
    ]);

    // wall
    new Shape({
      path: wallPath,
      addTo: wallGroup,
      color: isSouth ? red : gold,
    });

    var windowColor = isSouth ? navy : red;
    var windowProperty = isSouth ? 'southWindows' : 'northWindows';
    handleWindows( options, windowProperty, wallGroup, windowColor );

    var wallProperty = isSouth ? 'southWall' : 'northWall';
    building[ wallProperty ] = wallGroup;

  });

  // east/west wall
  [ true, false ].forEach( function( isWest ) {
    var wallGroup = new Group({
      addTo: options.addTo,
      translate: { x: isWest ? -wallX : wallX },
      rotate: { y: TAU/4 },
    });

    var wallPath = [
      { x: -wallZ, y: -wallY }
    ];

    if ( options.gable == 'ew' ) {
      wallPath.push({ x: 0, y: -wallY - wallZ });
    }

    wallPath = wallPath.concat([
      { x: wallZ, y: -wallY },
      { x: wallZ, y: 0 },
      { x: -wallZ, y: 0 },
    ]);

    // wall
    new Shape({
      path: wallPath,
      addTo: wallGroup,
      color: isWest ? blue : white,
    });

    var windowColor = isWest ? navy : blue;
    var windowProperty = isWest ? 'westWindows' : 'eastWindows';
    handleWindows( options, windowProperty, wallGroup, windowColor );

    var wallProperty = isWest ? 'westWall' : 'eastWall';
    building[ wallProperty ] = wallGroup;
  });


  var roofMakers = {
    ns: function() {
      var y0 = -wallY - wallX;
      var roofPanel = new Shape({
        path: [
          { x: 0, y: y0, z: -wallZ },
          { x: 0, y: y0, z: wallZ },
          { x: wallX, y: -wallY, z: wallZ },
          { x: wallX, y: -wallY, z: -wallZ },
        ],
        addTo: options.addTo,
        color: gold,
      });
      roofPanel.copy({
        scale: { x: -1 },
        color: navy,
      });
    },

    ew: function() {
      var y0 = -wallY - wallZ;
      var xA = options.isChurch ? -wallX + 8 : -wallX;
      var roofPanel = new Shape({
        path: [
          { z: 0, y: y0, x: xA },
          { z: 0, y: y0, x: wallX },
          { z: wallZ, y: -wallY, x: wallX },
          { z: wallZ, y: -wallY, x: xA },
        ],
        addTo: options.addTo,
        color: red,
      });
      roofPanel.copy({
        path: [
          { z: 0, y: y0, x: -wallX },
          { z: 0, y: y0, x: wallX },
          { z: wallZ, y: -wallY, x: wallX },
          { z: wallZ, y: -wallY, x: -wallX },
        ],
        scale: { z: -1 },
        color: navy,
      });
    },
  };

  var roofMaker = roofMakers[ options.gable ];
  if ( roofMaker ) {
    roofMaker();
  }

  return building;
}

function handleWindows( options, windowProperty, wallGroup, color ) {
  var windowOption = options[ windowProperty ];
  if ( !windowOption ) {
    return;
  }

  var columns = windowOption[0];
  var rows = windowOption[1];
  // var windowPaths = [];
  for ( var row=0; row < rows; row++ ) {
    for ( var col=0; col < columns; col++ ) {
      var x = ( col - (columns-1)/2 ) * 6;
      var y = -options.height + (row + 0.75) * 8;
      var windowPath = [
        { x: x + -1, y: y + -2 },
        { x: x +  1, y: y + -2 },
        { x: x +  1, y: y +  2 },
        { x: x + -1, y: y +  2 },
      ];
      new Shape({
        path: windowPath,
        addTo: wallGroup,
        color: color,
      });
    }
  }
}

// -------------------------- lilPyramid -------------------------- //

function lilPyramid( options ) {
  var anchor = new Anchor({
    addTo: options.addTo,
    translate: options.translate,
  });

  var panel = new Shape({
    path: [
      { x: 0, y: -3, z: 0 },
      { x: 3, y:  0, z: 0 },
      { x: 0, y:  0, z: 3 },
    ],
    addTo: anchor,
    color: red,
  });

  panel.copy({
    rotate: { y: TAU/4 },
    color: red,
  });
  panel.copy({
    rotate: { y: TAU/2 },
    color: navy,
  });
  panel.copy({
    rotate: { y: TAU * 3/4 },
    color: navy,
  });

}

function hedge( options ) {
  var anchor = new Anchor({
    addTo: options.addTo,
    translate: options.translate,
  });

  var ball = new Shape({
    path: [ { y: 0 }, { y: -1 } ],
    lineWidth: 5,
    addTo: anchor,
    translate: { y: -2.5 },
    stroke: true,
    color: options.color || navy,
  });

  ball.copy({
    lineWidth: 4,
    translate: { y: -5 },
  });

  ball.copy({
    lineWidth: 2.5,
    translate: { y: -7.5 },
  });
}

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 160;
var h = 160;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;

// default to flat, filled shapes
[ Shape, Rect, Ellipse ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  ItemClass.defaults.stroke = false;
});

var camera = new Anchor({
  rotate: { y: -TAU/8 },
});

// -- illustration shapes --- //

var quarterView = 1/Math.sin(TAU/8);

// anchor
var town = new Group({
  addTo: camera,
  translate: { y: 36 },
  scale: { x: quarterView, z: quarterView },
  updateSort: true,
});

// ----- front building ----- //

var frontAnchor = new Anchor({
  addTo: town,
  translate: { x: 16, y: -4, z: -20 },
});

var frontBuilding = makeBuilding({
  width: 22,
  depth: 16,
  height: 20,
  addTo: frontAnchor,
  gable: 'ew',
  southWindows: [ 3, 1 ],
  eastWindows: [ 2, 2 ],
  westWindows: [ 2, 2 ],
  northWindows: [ 3, 2 ],
});

// east gable dot
var gableDot = new Ellipse({
  width: 2,
  height: 2,
  addTo: frontBuilding.eastWall,
  color: blue,
  translate: { y: -20 },
});
// west gable dot
gableDot.copy({
  addTo: frontBuilding.westWall,
  color: navy,
});

// south doors
var door = new Shape({
  path: [
    { x: -2.5, y: 0 },
    { x: -2.5, y: -5.5 },
    { arc: [
      { x: -2.5, y: -8 },
      { x:    0, y: -8 },
    ]},
    { arc: [
      { x:  2.5, y: -8 },
      { x:  2.5, y: -5.5 },
    ]},
    { x: 2.5, y: 0 },
  ],
  addTo: frontBuilding.southWall,
  translate: { x: -4.5 },
  color: navy,
});
door.copy({
  translate: { x: 4.5 },
});

[ -1, 1 ].forEach( function( zSide ) {
  var frontGableGroup = new Group({
    addTo: frontAnchor,
    translate: { y: -20, z: 8*zSide },
  });

  // front building gable
  new Shape({
    path: [
      { x:  0, y: -6 },
      { x: -6, y: 0 },
      { x:  6, y: 0 },
    ],
    addTo: frontGableGroup,
    translate: { y: 1 },
    color: zSide == -1 ? red : gold,
  });

  gableDot.copy({
    addTo: frontGableGroup,
    translate: { y: -2 },
    color: zSide == -1 ? navy : red,
  });

  var frontGableSide = new Shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: 5, y: 5, z: 0 },
      { x: 0, y: 0, z: -5*zSide },
    ],
    addTo: frontAnchor,
    translate: { y: -25, z: 8*zSide },
    color: gold,
  });
  frontGableSide.copy({
    scale: { x: -1 },
    color: navy,
  });

});


// ----- left building ----- //

var leftAnchor = new Anchor({
  addTo: town,
  translate: { x: -13, y: -10, z: -23 },
});

var leftBuilding = makeBuilding({
  width: 16,
  depth: 22,
  height: 20,
  addTo: leftAnchor,
  gable: 'ns',
  southWindows: [ 2, 2 ],
  eastWindows: [ 3, 2 ],
  westWindows: [ 3, 1 ],
  northWindows: [ 2, 2 ],
});

door.copy({
  addTo: leftBuilding.westWall,
  translate: { x: -4.5 },
});
door.copy({
  addTo: leftBuilding.westWall,
  translate: { x: 4.5 },
});

// ----- cupola ----- //


var cupolaNSPanel = new Shape({
  path: [
    { x: -1, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 9 },
    { x: -1, y: 5 },
      // HACK add point to sort in front of roof
      { move: [ { x: 8, z: -4 } ] },
  ],
  addTo: leftAnchor,
  translate: { y: -34, z: -3 },
  color: red,
});
cupolaNSPanel.copy({
  scale: { x: -1 },
});
cupolaNSPanel.copy({
  scale: { z: -1 },
  translate: { y: -34, z: 3 },
  color: gold,
});
cupolaNSPanel.copy({
  translate: { y: -34, z: 3 },
  scale: { x: -1, z: -1 },
  color: gold,
});

[ -1, 1 ].forEach( function( xSide ) {
  var group = new Group({
    addTo: leftAnchor,
    translate: { y: -34, x: 3*xSide },
  });
  // ew panel
  new Shape({
    path: [
      { z: -3, y:  0 },
      { z:  0, y: -3 },
      { z:  3, y:  0 },
      { z:  3, y:  9 },
      { z: -3, y:  9 },
      // HACK add point to sort in front of roof
      { move: [ { x: 16*xSide } ] },
    ],
    addTo: group,
    color: xSide == -1 ? blue : white,
  });
  gableDot.copy({
    addTo: group,
    translate: { y: 3 },
    rotate: { y: TAU/4 },
    color: xSide == -1 ? navy : blue,
  });
});

// cupola roof panel
var cupolaRoofPanel = new Shape({
  path: [
    { x: -3, y: -3, z:  0 },
    { x:  3, y: -3, z:  0 },
    { x:  3, y:  0, z: -3 },
    { x: -3, y:  0, z: -3 },
  ],
  addTo: leftAnchor,
  translate: { y: -34 },
  color: navy,
});
cupolaRoofPanel.copy({
  scale: { z: -1 },
  color: red,
});


// ----- left building slopes ----- //

// east slope
var leftEWSlope = new Shape({
  path: [
    { x: 0, y: 0, z: -11 },
    { x: 0, y: 0, z:  11 },
    { x: 6, y: 6, z:  11 },
    { x: 6, y: 6, z: -11 },
  ],
  addTo: leftAnchor,
  translate: { x: 8 },
  color: gold,
});
// west slope
leftEWSlope.copy({
  scale: { x: -1 },
  translate: { x: -8 },
  color: gold,
});

// south slope
new Shape({
  path: [
    { z:  0, y: 0, x: -8 },
    { z:  0, y: 0, x:  8 },
    { z: -6, y: 6, x:  8 },
    { z: -6, y: 6, x: -8 },
  ],
  addTo: leftAnchor,
  translate: { z: -11 },
  color: navy,
});

// south east corner
var leftCorner = new Shape({
  path: [
    { x: 0, y: 0, z:  0 },
    { x: 6, y: 6, z:  0 },
    { x: 0, y: 6, z: -6 },
  ],
  addTo: leftAnchor,
  translate: { x: 8, z: -11 },
  color: red,
});
// south west corner
leftCorner.copy({
  scale: { x: -1 },
  translate: { x: -8, z: -11 },
  color: blue,
});



// ----- back tower ----- //

var towerAnchor = new Anchor({
  addTo: town,
  translate: { x: -13, y: -24, z: 4 },
});

var tower = makeBuilding({
  width: 16,
  depth: 16,
  height: 28,
  addTo: towerAnchor,
  gable: 'ns',
  southWindows: [ 2, 3 ],
  eastWindows: [ 2, 2 ],
  westWindows: [ 2, 3 ],
  northWindows: [ 2, 3 ],
});

door.copy({
  addTo: tower.eastWall,
  translate: { x: 0 },
  color: blue,
});

gableDot.copy({
  addTo: tower.southWall,
  translate: { y: -29 },
  color: navy,
});

gableDot.copy({
  addTo: tower.northWall,
  translate: { y: -29 },
  color: red,
});

var towerChimney = new Shape({
  addTo: towerAnchor,
  path: [ { y: 0 }, { y: 4 } ],
  translate: { x: -2, y: -37, z: -1 },
  lineWidth: 2,
  stroke: true,
  color: navy,
});
towerChimney.copy({
  translate: { x: -2, y: -37, z: 3 },
});

// plume
new Shape({
  path: [
    { x: -3, y: 1 },
    { arc: [
      { x: -3, y: -1 },
      { x: -1, y: -1 },
    ]},
    { x:  3, y: -1 },
    { arc: [
      { x:  3, y:  1 },
      { x:  1, y:  1 },
    ]},
  ],
  addTo: towerAnchor,
  translate: { x: -2, y: -42, z: 6 },
  rotate: { y: TAU/4 },
  stroke: true,
  lineWidth: 2,
  color: blue
});

// ----- tower slopes ----- //

// big east slope
var towerEWSlope = new Shape({
  path: [
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z:  1 },
    { x: 1, y: 1, z:  1 },
    { x: 1, y: 1, z: -1 },
  ],
  addTo: towerAnchor,
  translate: { x: 8 },
  // size by scaling
  scale: { x: 20, y: 20, z: 8 },
  color: gold,
});

// south slope down to left building
var towerNSSLope = new Shape({
  path: [
    { z: 0, y: 0, x: -1 },
    { z: 0, y: 0, x:  1 },
    { z: 1, y: 1, x:  1 },
    { z: 1, y: 1, x: -1 },
  ],
  addTo: towerAnchor,
  translate: { z: -8 },
  scale: { x: 8, y: 14, z: -8 },
  color: navy,
});

// south east corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 20, z: 0 },
    { x: 6, y: 20, z: -8 },
    { x: 0, y: 14, z: -8 },
  ],
  addTo: towerAnchor,
  translate: { x: 8, z: -8 },
  color: red,
});

// north slope
towerNSSLope.copy({
  translate: { z: 8 },
  scale: { x: 8, y: 20, z: 7 },
  color: gold,
});

// north east corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 20, z: 0 },
    { x: 0, y: 20, z: 7 },
  ],
  addTo: towerAnchor,
  translate: { x: 8, z: 8 },
  color: gold,
});

// west slope
towerEWSlope.copy({
  scale: { x: -12, y: 20, z: 8 },
  translate: { x: -8 },
  color: gold,
});

// north west corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: -12, y: 20, z: 0 },
    { x: 0, y: 20, z: 7 },
  ],
  addTo: towerAnchor,
  translate: { x: -8, z: 8 },
  color: red,
});

// south west corner back to left building
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: -12, y: 20, z: 0 },
    { x: -6, y: 20, z: -8 },
    { x: 0, y: 14, z: -8 },
  ],
  addTo: towerAnchor,
  translate: { x: -8, z: -8 },
  color: blue,
});

// ----- church ----- //

var churchAnchor = new Anchor({
  addTo: town,
  translate: { x: -5, y: -4, z: 27 },
});

var church = makeBuilding({
  isChurch: true, // special flag for roof
  width: 22,
  depth: 16,
  height: 28,
  addTo: churchAnchor,
  gable: 'ew',
  southWindows: [ 3, 2 ],
  eastWindows: [ 2, 2 ],
  northWindows: [ 3, 2 ],
});

door.copy({
  addTo: church.westWall,
  translate: { x: -3.5 },
});
door.copy({
  addTo: church.westWall,
  translate: { x: 3.5 },
});

// big circle window
new Ellipse({
  width: 8,
  height: 8,
  addTo: church.westWall,
  translate: { y: -22 },
  color: navy,
});

// ----- bell tower ----- //

( function() {

  var bellTowerAnchor = new Anchor({
    addTo: churchAnchor,
    translate: { x: -7, y: -36, z: 4 },
  });

  // tower ledge
  new Rect({
    width: 8,
    height: 8,
    addTo: bellTowerAnchor,
    translate: { y: -12 },
    rotate: { x: TAU/4 },
    color: navy,
  });

  var wallColors = [ red, white, gold, blue ];
  var accentColors = [ navy, blue, red, navy ];
  var roofColors = [ navy, gold, red, navy ];

  for ( var i=0; i < 4; i++ ) {
    var wallAnchor = new Anchor({
      addTo: bellTowerAnchor,
      rotate: { y: TAU/4 * i },
    });
    var bottomWallGroup = new Group({
      addTo: wallAnchor,
      translate: { z: -4 }
    });

    var wallColor = wallColors[i];
    var accentColor = accentColors[i];
    var roofColor = roofColors[i];

    // bottom wall
    new Rect({
      width: 8,
      height: 12,
      addTo: bottomWallGroup,
      translate: { y: -6 },
      color: wallColor,
    });
    // circle cut-out
    new Ellipse({
      width: 4,
      height: 4,
      addTo: bottomWallGroup,
      translate: { y: -4 },
      color: accentColor,
    });
    // top stripe
    new Rect({
      width: 8,
      height: 2,
      addTo: bottomWallGroup,
      translate: { y: -9 },
      color: accentColor,
    });

    var topWallGroup = new Group({
      addTo: wallAnchor,
      translate: { y: -12, z: -3 },
    });
    // top wall
    new Rect({
      width: 6,
      height: 7,
      addTo: topWallGroup,
      translate: { y: -3.5 },
      color: wallColor,
    });
    // top window
    new Rect({
      width: 2,
      height: 5,
      addTo: topWallGroup,
      translate: { y: -2.5 },
      color: accentColor,
    });

    // roof
    new Shape({
      path: [
        { x:  0, y: 0, z:  0 },
        { x: -3, y: 6, z: -3 },
        { x:  3, y: 6, z: -3 },
      ],
      addTo: wallAnchor,
      translate: { y: -25 },
      color: roofColor,
    });
  }

  // roof connectors
  // south, white side
  new Shape({
    path: [
      { z: -4, y:  0 },
      { z:  4, y: -1 },
      { z:  4, y:  8 },
    ],
    addTo: bellTowerAnchor,
    translate: { x: 4 },
    color: white,
  });
  // east gold side
  var connector = new Rect({
    width: 8,
    height: 10,
    addTo: bellTowerAnchor,
    translate: { z: 4, y: 4 },
    color: gold,
  });
  // north blue side
  connector.copy({
    translate: { x: -4, y: 4 },
    rotate: { y: TAU/4 },
    color: blue,
  });

})();

// ----- hill ----- //

new Shape({
  path: [
    { x:  0, y: 2 },
    { x:  10, y: 2 },
    { bezier: [
      { x: 14, y: 2 },
      { x: 20, y: 10 },
      { x: 24, y: 10 },
    ]},
    { x: 30, y: 10 },
    { arc: [
      { x: 34, y: 10 },
      { x: 34, y: 14 },
    ]},
    // bring it back into hill
    { x: 14, y: 14, z: 0 },
  ],
  addTo: town,
  translate: { x: -6, y: -20, z: 12 },
  lineWidth: 4,
  stroke: true,
  color: gold,
});

// ----- lil pyramids ----- //

// front in front of left building
lilPyramid({
  addTo: town,
  translate: { x: 6, z: -35, y: -4 },
});

// behind left building

lilPyramid({
  addTo: town,
  translate: { x: -34, z: -20, y: -4 },
});


// front right
lilPyramid({
  addTo: town,
  translate: { x: 35, z: -8, y: -4 },
});

lilPyramid({
  addTo: town,
  translate: { x: 31, z: 2, y: -4 },
});
// in front of church
lilPyramid({
  addTo: town,
  translate: { x: 22, z: 28, y: -4 },
});

// ----- hedges ----- //

// to right of front building
hedge({
  addTo: town,
  translate: { x: 24, y: -4, z: -4 },
});

// right of church
hedge({
  addTo: town,
  translate: { x: -4, y: -4, z: 42 },
});
// in between tower & church
hedge({
  addTo: town,
  translate: { x: -30, y: -4, z: 18 },
  // color: gold,
});

hedge({
  addTo: town,
  translate: { x: 9, y: -4, z: 17 },
  // color: gold,
});


// ----- sun ----- //

new Shape({
  addTo: town,
  translate: { x: -6, y: -52, z: 42 },
  lineWidth: 6,
  stroke: true,
  color: gold,
});

// ----- sky particles ----- //

// dot above left building
var skyDot = new Shape({
  translate: { x: -3, y: -48, z: -42 },
  addTo: town,
  lineWidth: 2,
  stroke: true,
  color: white,
});

// in front of church
skyDot.copy({
  translate: { x: 30, y: -28, z: 28 },
});

var skyDiamond = new Shape({
  path: [
    { x:  0, y: -1 },
    { x:  1, y:  0 },
    { x:  0, y:  1 },
    { x: -1, y:  0 },
  ],
  addTo: town,
  translate: { x: -27, y: -45, z: -29 },
  scale: { x: 0.75, y: 0.75 },
  stroke: true,
  lineWidth: 0.5,
  color: white,
});
skyDiamond.copy({
  rotate: { y: TAU/4 },
});

var skyDiamond2 = skyDiamond.copy({
  translate: { x: 8, y: -34, z: 42 },
});
skyDiamond2.copy({
  rotate: { y: TAU/4, },
});

var skyStar = new Shape({
  path: [
    { x: 0, y: -1 },
    { arc: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: -1 },
    ]},
  ],
  addTo: town,
  translate: { x: -39, y: -51, z: -12 },
  scale: { x: 1.5, y: 1.5 },
  stroke: true,
  lineWidth: 1,
  color: white,
});
skyStar.copy({
  rotate: { y: TAU/4 },
});

// up front
var skyStar2 = skyStar.copy({
  translate: { x: 29, y: -42, z: -30 },
  color: white,
});
skyStar2.copy({
  rotate: { y: TAU/4 },
});

// ----- clouds ----- //

var cloud = new Shape({
  path: [
    { x: -1, y: 0 },
    { arc: [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
    ]},
    { arc: [
      { x: 1, y: -1 },
      { x: 1, y: 0 },
    ]},
  ],
  addTo: town,
  translate: { x: -30, y: -56, z: -10 },
  scale: { x: 1.5, y: 1.5 },
  rotate: { y: TAU/4 },
  stroke: true,
  lineWidth: 2,
  color: white,
});
cloud.copy({
  translate: { x: -30, y: -57, z: -6 },
});
cloud.copy({
  translate: { x: -30, y: -56, z: -2 },
});

// line underneath
cloud.copy({
  path: [ { x: -1 }, { x: 1 } ],
  translate: { x: -30, y: -56, z: -6 },
  scale: { x: 2 },
});

// ----- flat earth ----- //

var flatEarth = new Ellipse({
  width: 128,
  height: 128,
  addTo: camera,
  translate: town.translate,
  rotate: { x: TAU/4 },
  lineWidth: 8,
  stroke: true,
  color: navy,
});

// ----- sky ----- //

var sky = new Group({
  addTo: camera,
  translate: town.translate,
  // translate: { y: 2 },
});

( function() {
  var topYs = [
    -64, -64, -52, -52,
    -44, -44, -36, -36,
    -44, -44, -52, -52,
    -60, -60, -52, -52,
  ];
  var bottomYs = [
    -24, -24, -16, -16,
    -8, -8, -0, -0,
    -8, -8, -16, -16,
    -24, -24, -32, -32,
  ];
  var radius = 64;
  var skyPanelCount = topYs.length;
  var angle = TAU / skyPanelCount;
  var panelWidth = Math.tan( angle/2 ) * radius * 2;
  for ( var i=0; i < skyPanelCount; i++ ) {
    var nextI = (i + 1) % skyPanelCount;
    var topYA = topYs[ i ];
    var topYB = topYs[ nextI ];
    var bottomYA = bottomYs[ i ];
    var bottomYB = bottomYs[ nextI ];
    var panelAnchor = new Anchor({
      addTo: sky,
      rotate: { y: angle * -i  + TAU/4 },
      translate: { y: 1 },
    });
    new Shape({
      path: [
        { x: -panelWidth/2, y: topYA },
        { bezier: [
          { x: 0, y: topYA },
          { x: 0, y: topYB },
          { x:  panelWidth/2, y: topYB },
        ]},
        { x:  panelWidth/2, y: bottomYB },
        { bezier: [
          { x: 0, y: bottomYB },
          { x: 0, y: bottomYA },
          { x: -panelWidth/2, y: bottomYA },
        ]},
      ],
      addTo: panelAnchor,
      translate: { z: radius },
      color: blue,
      stroke: true,
      lineWidth: 1,
      backfaceHidden: true,
    });
  }
})();

// -- animate --- //

var t = 0;
var tSpeed = 1/120;
var then = new Date() - 1/60;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

// i, 0->1
function easeInOut( i ) {
  i = i % 1;
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}

function update() {
  var now = new Date();
  var delta = now - then;

  if ( isRotating ) {
    t += tSpeed * delta/60;
    var theta = easeInOut( t ) * TAU;
    var rev = 1;
    var spin = -theta * rev - TAU/8;
    var extraRotation = TAU * rev * Math.floor( ( t % 4 ) );
    camera.rotate.y = spin - extraRotation;
    camera.rotate.x = t % 2 < 1 ? 0 : ( Math.cos( theta ) * -0.5 + 0.5 ) * TAU * 3/16;
  }
  camera.normalizeRotate();

  // rotate
  camera.updateGraph();

  then = now;
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  var isCameraXUp = camera.rotate.x > 0 && camera.rotate.x < TAU/2;

  sky.renderGraph( ctx );

  // HACK sort flat earth & town shapes manually
  if ( isCameraXUp ) {
    flatEarth.render( ctx );
  }
  town.renderGraph( ctx );
  if ( !isCameraXUp ) {
    flatEarth.render( ctx );
  }

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});

document.querySelector('.reset-button').onclick = function() {
  isRotating = false;
  camera.rotate.set({ x: 0, y: -TAU/8 });
};
