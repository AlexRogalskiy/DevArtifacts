var container;
var camera, scene, renderer, group, particle;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.z = 400;

  scene = new THREE.Scene();

  var PI2 = Math.PI * 2;
  var program = function ( ctx ) {
  	ctx.beginPath();
  	ctx.arc( 0, 0, 0.5, 0, PI2, true );
  	ctx.fill();
  };

  group = new THREE.Group();
  scene.add( group );

  for ( var i = 0; i < 80; i++ ) {
  	var material = new THREE.SpriteCanvasMaterial ({
      color: Math.random() * 0xffffff + 0xef92ae,
      opacity: 0.6,
      program: program
  } );

  	particle = new THREE.Sprite( material );
  	particle.position.x = Math.random() * 2000 - 1000;
  	particle.position.y = Math.random() * 2000 - 1000;
  	particle.position.z = Math.random() * 2000 - 1000;
  	particle.scale.x = particle.scale.y = Math.random() * 120 + 100;
  	group.add( particle );
  }

  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function onDocumentTouchMove( event ) {
  if ( event.touches.length === 1 ) {
  	event.preventDefault();
  	mouseX = event.touches[ 0 ].pageX - windowHalfX;
  	mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  camera.position.y += ( mouseY - camera.position.y ) * 0.05;
  camera.lookAt( scene.position );

  var currentSeconds = Date.now();
  group.rotation.x = Math.sin( currentSeconds * 0.0005 ) * 0.8;
  group.rotation.y = Math.sin( currentSeconds * 0.0003 ) * 0.8;
  group.rotation.z = Math.sin( currentSeconds * 0.0002 ) * 0.8;

  renderer.render( scene, camera );
}