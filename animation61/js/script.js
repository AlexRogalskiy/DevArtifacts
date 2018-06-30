var RES_X = 20;
var RES_Y = 20;
var SIZE = 22;

// super laggy on mobile devices so ease up the res
if( /iphone|ipad|android/ig.test( navigator.userAgent ) ) {
  RES_X = 10;
  RES_Y = 10;
  SIZE = 25;
}

var entities = [];

var wrapper = document.createElement( 'div' );
wrapper.style.width = ( RES_X * SIZE ) + 'px';
wrapper.style.height = ( RES_Y * SIZE ) + 'px';
document.body.appendChild( wrapper );

for( var x = 0; x < RES_X; x++ ) {
  for( var y = 0; y < RES_Y; y++ ) {
    var el = document.createElement( 'input' );
    el.setAttribute( 'type', 'checkbox' );
    wrapper.appendChild( el );
    
    var entity = {
      element: el,
      x: x * SIZE,
      y: y * SIZE
    }
    
    el.style.left = entity.x + 'px';
    el.style.top = entity.y + 'px';
    el.addEventListener( 'change', this.toggle.bind( this, entity ) );
    
    entities.push( entity );
  }
}

function toggle( targetEntity ) {
  
  var checked = targetEntity.element.checked;
  
  entities.forEach( function( entity ) {

    var dx = targetEntity.x - entity.x;
    var dy = targetEntity.y - entity.y;
    var distance = Math.sqrt( dx * dx + dy * dy );
    
    setTimeout( function() {
      entity.element.checked = checked;
      
      // re-run the animation, reading offsetWidth forces reflow
      entity.element.className = '';
      entity.element.offsetWidth;
      entity.element.className = 'grow';
    }, Math.round( distance * 1.8 ) );
    
  } );
  
}

setTimeout( function() {
  entities[ 0 ].element.checked = true;
  toggle( entities[ 0 ] );
}, 500 );