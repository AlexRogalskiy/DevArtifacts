var axisHelper = {},
		camera = {},
		$container = {},
    controls = {},
    containerWidth = 0,
    containerHeight = 0,
    globalRenderID = {},
    h = {},
    particleSystem = {},
    particleMaterials = [],
    particleMesh = {},
    particleParameters = [],
    particleColor = {},
    particleSize = 0,
    renderer = {},
    scene = {};

function render () {
  
  var time = Date.now() * 0.00005;
  
  globalRenderID = requestAnimationFrame( render );

  for ( i = 0; i < particleMaterials.length; i ++ ) {

    particleColor = particleParameters[ i ][ 0 ];

    h = ( 360 * ( particleColor[ 0 ] + time ) % 360 ) / 360;
    particleMaterials[ i ].color.setHSL( h, particleColor[ 1 ], particleColor[ 2 ] );

  }
  
  controls.update();
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

THREE.ImageUtils.crossOrigin = '';

$container = $( '#container' );
containerWidth = $container.innerWidth();
containerHeight = $container.innerHeight();

renderer = new THREE.WebGLRenderer();
renderer.setSize( containerWidth, containerHeight );
renderer.antialias = true;
renderer.setClearColor( 0xffffff, 1 );
$container.get( 0 ).appendChild( renderer.domElement );

scene = new THREE.Scene();

axisHelper = new THREE.AxisHelper( 1000 );

camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 2000 );
camera.position.set( 0, 0, 1000 );

particleMesh = new THREE.Geometry();
for ( var i = 0, iMax = 50; i < iMax; i += 1 ) {

  var vertex = new THREE.Vector3();
  vertex.x = Math.random() * 750 - 375;
  vertex.y = Math.random() * 750 - 375;
  vertex.z = Math.random() * 750 - 375;

  particleMesh.vertices.push( vertex );

}

particleParameters = [
  [ [ 1, 1, 0.5 ], 50 ],
  [ [ 0.95, 1, 0.5 ], 40 ],
  [ [ 0.90, 1, 0.5 ], 30 ],
  [ [ 0.85, 1, 0.5 ], 20 ],
  [ [ 0.80, 1, 0.5 ], 10 ]
];

for ( i = 0; i < particleParameters.length; i ++ ) {

  particleColor = particleParameters[i][0];
  particleSize  = particleParameters[i][1];

  particleMaterials[i] = new THREE.PointCloudMaterial( { 
    map: THREE.ImageUtils.loadTexture( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/26757/star.png' ),
    depthTest: false, 
    transparent : true,
    size: particleSize 
  } );

  particleSystem = new THREE.PointCloud( particleMesh, particleMaterials[i] );

  particleSystem.rotation.x = Math.random() * 6;
  particleSystem.rotation.y = Math.random() * 6;
  particleSystem.rotation.z = Math.random() * 6;
  
  controls = new THREE.OrbitControls( camera, $container.get( 0 ) );
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.125;
  controls.noPan = true;
  controls.maxDistance = 800;
  controls.minDistance = 500;
  controls.zoomSpeed = 0.125;
  controls.rotateSpeed = 0.125;

  scene.add( particleSystem );

}

scene.add( camera, particleSystem );

window.addEventListener( 'resize', onWindowResize );

render();
onWindowResize();
console.log( particleSystem );