var axisHelper = {},
    directionalLight = {},
		camera = {},
		$container = {},
    controls = {},
    containerWidth = 0,
    containerHeight = 0,
    globalRenderID = {},
    globalIntervalID = {},
    plane = {},
    planeGeometry = {},
    planeMaterial = {},
    r = 0,
    renderer = {},
    scene = {},
    sun = {};

function render () {
  globalRenderID = requestAnimationFrame( render );
  controls.update();
  
  /* Sun animation */
  sun.position.x = Math.sin( r * 0.0125 ) * 1200;
  sun.position.y = Math.cos( r * 0.0125 ) * 250;
  r += Math.PI / 180 * 2;
/*  console.log( sun.position.x, sun.position.y );*/
  
	renderer.render( scene, camera );
}

function onWindowResize () {
  containerWidth = $container.innerWidth();
	containerHeight = $container.innerHeight();
  camera.aspect = containerWidth / containerHeight;
	camera.updateProjectionMatrix();
  renderer.clear();
	renderer.setSize( containerWidth, containerHeight );
}

function getRandomInteger( min, max ) {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

function getRandomGauss( median, variance, cove ) {
  return variance * Math.pow( ( Math.random() - 0.5 ), cove ) + median;
}

function Tree ( x, z ) {
  var cone = {}, 
      coneGeometry = {}, 
      coneMaterial = {},
      crownWidth = 0,
      crownHeight = 0,
      cylinder = {}, 
      cylinderGeometry = {}, 
      cylinderMaterial = {},
      stemWidth = 0,
      stemHeight = 0;
  
  crownHeight = getRandomGauss( 60, 800, 5 );
  crownWidth = crownHeight * ( Math.random() * 0.21 + 0.3 );
  stemHeight = crownHeight * 0.25;
  stemWidth = stemHeight * 0.3;
  
  coneGeometry = new THREE.CylinderGeometry( 0, crownWidth, crownHeight, 8 );
  coneMaterial = new THREE.MeshLambertMaterial( {
    color: 0x4db6ac,
    shading: THREE.FlatShading
  } );
  cone = new THREE.Mesh( coneGeometry, coneMaterial );
  cone.position.set( x, ( crownHeight * 0.5 )  + stemHeight, z );

  cylinderGeometry = new THREE.CylinderGeometry( stemWidth, stemWidth, stemHeight, 5 );
  cylinderMaterial = new THREE.MeshLambertMaterial( {
    color: 0x5D4037
  } );
  cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  cylinder.position.set( 0, -stemHeight * 2.5, 0 );

  cone.add( cylinder );
  cone.castShadow = true;
  cone.receiveShadow = true;
  
  return cone;
}

function Sun ( radius ) {
  var pointLight = {},
      pointLightHelper = {},
    	spotlight = {},
  		sun = {},
      sunGeometry = {},
      sunMaterial = {};
  
  sunGeometry = new THREE.SphereGeometry( radius, 10, 10 );
  sunMaterial = new THREE.MeshBasicMaterial( {
    color: 0xfdd835
  } );
  sun = new THREE.Mesh( sunGeometry, sunMaterial );
  sun.position.set( 0, 250, 0 );
  
  pointLight = new THREE.PointLight( 0xE65100, 10, 200 );
  pointLight.position.set( 0, -radius, 0 );
  sun.add( pointLight );
  
  spotlight = new THREE.SpotLight( 0xffffff );
  spotlight.position.set( 0, 0, 0 );
  spotlight.castShadow = true;
  spotlight.shadowDarkness = 0.5;
  spotlight.angle = Math.PI / 2;
  spotlight.shadowCameraFov = 100;
  spotlight.shadowMapHeight = 1024;
  sun.add( spotlight );
  
  pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
	/*scene.add( pointLightHelper );*/
  
  return sun;
}

THREE.ImageUtils.crossOrigin = '';

$container = $( '#container' );
containerWidth = $container.innerWidth();
containerHeight = $container.innerHeight();

renderer = new THREE.WebGLRenderer();
renderer.setSize( containerWidth, containerHeight );
renderer.antialias = true;
renderer.setClearColor( 0xB0BEC5, 1 );
renderer.shadowMapEnabled = true;
$container.get( 0 ).appendChild( renderer.domElement );

scene = new THREE.Scene();

axisHelper = new THREE.AxisHelper( 1000 );


/* CAMERA */
camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 5000 );
camera.position.set( 0, 200, 750 );


/* CONTROLS */
controls = new THREE.OrbitControls( camera, $container.get( 0 ) );
controls.autoRotate = true;
controls.autoRotateSpeed = 0.025;
controls.noPan = true;
controls.noZoom = true;
controls.minPolarAngle = 1.3;
controls.maxPolarAngle = 1.3;
controls.rotateLeft( 45 );


/* LANDSCAPE */
planeGeometry = new THREE.CylinderGeometry( 1000, 1000, 1, 100 );
planeMaterial = new THREE.MeshLambertMaterial( {
  color: 0xa6bcc5
} );
plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;


/* TREE */
for ( var i = 0; i < 150; i += 1 ) {
  var x = getRandomInteger ( -700, 700 ),
      z = getRandomInteger ( -700, 700 );
  scene.add( new Tree( x, z ) );
}

/* LIGHTS */
sun = new Sun( 20 );
directionalLight = new THREE.DirectionalLight( 0x263238, 0.5 );
directionalLight.position.set( 0, 1, 0 );


/* SCENE */
scene.add( camera, sun, directionalLight, plane );


/* RENDERINGS */
window.addEventListener( 'resize', onWindowResize );

render();
onWindowResize();