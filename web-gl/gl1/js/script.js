var PLANE_WIDTH = 50,
    PLANE_LENGTH = 1000,
    PADDING = PLANE_WIDTH / 5 * 2,
    POWERUP_COUNT = 10;

var axishelper = {},
    camera = {},
		$container = {},
    controls = {},
    containerWidth = 0,
    containerHeight = 0,
    directionalLight = {},
    globalRenderID = {},
    hero = {},
    hemisphereLight = {},
    mountain = {},
    mountains = [],
    plane = {},
    planeGeometry = {},
    planeMaterial = {},
    powerup = {},	
		powerups = [],
    powerupSpawnIntervalID = {},
    powerupCounterIntervalID = {},
    queue = {},
    renderer = {},
    scene = {},
    sky = {},
    skyGeometry = {},
    skyMaterial = {},
    skyTexture = {};

function render () {
  globalRenderID = requestAnimationFrame( render );
  controls.update(); 
  
  powerups.forEach( function ( element, index ) {
    powerups[ index ].animate();
  });
  
  mountains.forEach( function ( element, index ) {
    mountains[ index ].animate();
  });
  
  if ( detectCollisions( powerups ) === true ) {
    gameOver();
  }
  
	renderer.render( scene, camera );
}

function gameOver () {
  cancelAnimationFrame( globalRenderID );
  window.clearInterval( powerupSpawnIntervalID );
  window.clearInterval( powerupCounterIntervalID );
  
  $( '#overlay-gameover' ).fadeIn( 100 );
  
  $( '#btn-restart' ).one( 'click', function () {
    $( '#overlay-gameover' ).fadeOut( 50 );
    POWERUP_COUNT = 10;
    powerups.forEach( function ( element, index ) {
      scene.remove( powerups[ index ] );
    }); 
    powerups = [];
    hero.position.x = 0;
    render();
    startPowerupLogic();
  } );
}

function onWindowResize () {
  containerWidth = $container.innerWidth();
	containerHeight = $container.innerHeight();
  camera.aspect = containerWidth / containerHeight;
	camera.updateProjectionMatrix();
  renderer.clear();
	renderer.setSize( containerWidth, containerHeight );
}

function detectCollisions( objects ) {
  var origin = hero.position.clone();

  for ( var v = 0, vMax = hero.geometry.vertices.length; v < vMax; v += 1 ) {       
    var localVertex = hero.geometry.vertices[ v ].clone();
    var globalVertex = localVertex.applyMatrix4( hero.matrix );
    var directionVector = globalVertex.sub( hero.position );

    var ray = new THREE.Raycaster( origin, directionVector.clone().normalize() );
    var intersections = ray.intersectObjects( objects );
    if ( intersections.length > 0 && 
        intersections[ 0 ].distance < directionVector.length() ) {
      return true;
    }
  }
  return false;
}  

function getRandomInteger( min, max ) {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

function Hero () {
  var hero = {},
      heroGeometry = {},
      heroMaterial = {};
  
  heroGeometry = new THREE.CylinderGeometry( 0, 2, 5, 10 );
  heroMaterial = new THREE.MeshLambertMaterial( {
    color: 0xE91E63,
    shading: THREE.FlatShading
  } );
  hero = new THREE.Mesh( heroGeometry, heroMaterial );
  hero.castShadow = true;
  hero.position.set( 0, 5, ( PLANE_LENGTH / 2 ) );
  hero.rotation.x = 0.785;
  
  window.addEventListener( 'keydown', function () {
    if ( event.keyCode === 37 && hero.position.x !== -( PLANE_WIDTH - PADDING ) / 2 ) {
      hero.position.x -= ( PLANE_WIDTH - PADDING ) / 2;
    } else if ( event.keyCode === 39 && hero.position.x !== ( PLANE_WIDTH - PADDING ) / 2 ) {
      hero.position.x += ( PLANE_WIDTH - PADDING ) / 2;
    }
  } );
  
  return hero;
}

function createLandscapeFloors () {
  var planeLeft = {},
      planeLeftGeometry = {},
      planeLeftMaterial = {},
      planeRight = {};
  
  planeLeftGeometry = new THREE.BoxGeometry( PLANE_WIDTH, PLANE_LENGTH + PLANE_LENGTH / 10, 1 );
  planeLeftMaterial = new THREE.MeshLambertMaterial( {
    color: 0x8BC34A
  } );
  planeLeft = new THREE.Mesh( planeLeftGeometry, planeLeftMaterial );
  planeLeft.receiveShadow = true;
	planeLeft.rotation.x = 1.570;
  planeLeft.position.x = -PLANE_WIDTH;
  planeLeft.position.y = 1;
  
  planeRight = planeLeft.clone();
  planeRight.position.x = PLANE_WIDTH;
  
  scene.add( planeLeft, planeRight );
}

function createMountain ( i, isEast ) {
  var loader = {},
      prototype = {},
      object = {},
      objectDimensionX = {},
      objectDimensionY = {},
      objectDimensionZ = {};
  
  loader = new THREE.ColladaLoader();
  
  function createObject () {
    object = prototype.clone();
    objectDimensionX = Math.random() * 0.25 + 0.05;
    objectDimensionY = Math.random() * 0.25;
    objectDimensionZ = objectDimensionX;
    object.scale.set( objectDimensionX, objectDimensionY, objectDimensionZ );
    
    if ( isEast === true ) {
      object.position.x = PLANE_WIDTH * 2
      object.position.z = ( i * PLANE_LENGTH / 27 ) - ( 1.5 * PLANE_LENGTH );
    } else {
      object.position.x = -PLANE_WIDTH * 2
      object.position.z = ( i * PLANE_LENGTH / 27 ) - ( PLANE_LENGTH / 2 );
    }
    
    object.visible = true;
    
    object.animate = function () {
      
      if ( object.position.z < PLANE_LENGTH / 2 - PLANE_LENGTH / 10 ) {
        object.position.z += 5;
      } else {
        object.position.z = -PLANE_LENGTH / 2;
      }
    }
    
    mountains.push( object );
    scene.add( object );
  }
  
  loader.load(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/26757/mountain.dae',
    function ( collada ) {
      prototype = collada.scene;
      prototype.visible = false;
      createObject();
    } );
  
}

function createSpotlights () {
  var spotLight = {},
      target = {},
      targetGeometry = {},
      targetMaterial = {};
  for ( var i = 0; i < 5; i += 1 ) {
    targetGeometry = new THREE.BoxGeometry(1, 1, 1);
    targetMaterial = new THREE.MeshNormalMaterial();
    target = new THREE.Mesh( targetGeometry, targetMaterial );
    target.position.set( 0, 2, ( i * PLANE_LENGTH / 5 ) - ( PLANE_LENGTH / 2.5 ) );
    target.visible = false;
    scene.add( target );
    
    spotLight = new THREE.SpotLight( 0xFFFFFF, 2 );
    spotLight.position.set( 150, ( i * PLANE_LENGTH / 5 ) - ( PLANE_LENGTH / 2.5 ), -200 );
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 10;
    spotLight.shadowCameraVisible = false;
    spotLight.target = target;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    spotLight.fov = 40;
    
    plane.add( spotLight );
  }
}

function PowerUp () {
  var object = {},
      objectDimension = 0,
      objectGeometry = {},
      objectMaterial = {},
      xPosition = 0,
      xPositionValues = [],
      yPosition = 0,
      yPositionValues = [],
      zPosition = 0,
      zPositionValues = [];
  
  objectDimension = 2;
  
  xPositionValues = [ -( PLANE_WIDTH - PADDING ) / 2, 0, ( PLANE_WIDTH - PADDING ) / 2 ];
  yPositionValues = [ objectDimension + 1 ];
  zPositionValues = [ -( PLANE_LENGTH - PADDING ) / 2 ];
  
  xPosition = xPositionValues[ getRandomInteger( 0, xPositionValues.length - 1 ) ];
  yPosition = yPositionValues[ getRandomInteger( 0, yPositionValues.length - 1 ) ];
  zPosition = zPositionValues[ getRandomInteger( 0, zPositionValues.length - 1 ) ];
  
  objectGeometry = new THREE.BoxGeometry( objectDimension, objectDimension, objectDimension, objectDimension );
  objectMaterial = new THREE.MeshLambertMaterial( {
    color: 0x29B6F6,
  	shading: THREE.FlatShading
  } );
  object = new THREE.Mesh( objectGeometry, objectMaterial );
  object.position.set( xPosition, yPosition, zPosition );
  object.castShadow = true;
  object.receiveShadow = true;
  
  object.animate = function () {
    
    if ( object.position.z < PLANE_LENGTH / 2 + PLANE_LENGTH / 10 ) {
      object.position.z += 10;
    } else {
      object.position.x = xPositionValues[ getRandomInteger( 0, xPositionValues.length - 1 ) ];
      object.position.z = -PLANE_LENGTH / 2;
    }
    
  }
  
  return object;
}

function startPowerupLogic () {
  powerupSpawnIntervalID = window.setInterval( function () {
  
    if ( powerups.length < POWERUP_COUNT ) {
      powerup = new PowerUp();
      powerups.push( powerup );
      scene.add( powerup );
    }

  }, 4000 );

  powerupCounterIntervalID = window.setInterval( function () {
    POWERUP_COUNT += 1;
  }, 30000 );
}

function initGame () {
  THREE.ImageUtils.crossOrigin = '';

  $container = $( '#container' );
  containerWidth = $container.innerWidth();
  containerHeight = $container.innerHeight();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( containerWidth, containerHeight );
  renderer.antialias = true;
  renderer.setClearColor( 0xFFFFFF, 1 );
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  $container.get( 0 ).appendChild( renderer.domElement );

  scene = new THREE.Scene();

  axishelper = new THREE.AxisHelper( PLANE_LENGTH / 2 );


  /* CAMERA */
  camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 3000 );
  camera.position.set( 0, PLANE_LENGTH / 125, PLANE_LENGTH / 2 + PLANE_LENGTH / 25 );


  /* CONTROLS */
  controls = new THREE.OrbitControls( camera, $container.get( 0 ) );
  controls.noKeys = true;
  controls.noPan = true;
  controls.noZoom = true; 
  controls.minPolarAngle = 1.55;
  controls.maxPolarAngle = 1.55;
  controls.minAzimuthAngle = 0;
  controls.maxAzimuthAngle = 0;


  /* FLOOR */
  planeGeometry = new THREE.BoxGeometry( PLANE_WIDTH, PLANE_LENGTH + PLANE_LENGTH / 10, 1 );
  planeMaterial = new THREE.MeshLambertMaterial( {
    color: 0x78909C
  } );
  plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.rotation.x = 1.570;
  plane.receiveShadow = true;



  /* LANDSCAPE */
  createLandscapeFloors();
  for ( var i = 0; i < 60; i += 1 ) {
    var isEast = false;
    if ( i > 29 ) {
      isEast = true;
    }
    createMountain( i, isEast );
  }

  skyGeometry = new THREE.BoxGeometry( 1200, 800, 1, 1 );
  skyMaterial = new THREE.MeshBasicMaterial( {
    map: THREE.ImageUtils.loadTexture( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/26757/background.jpg' ),
    depthWrite: false,
    side: THREE.BackSide
  } );
  sky = new THREE.Mesh( skyGeometry, skyMaterial );
  sky.position.y = 300;
  sky.position.z = -PLANE_LENGTH / 2 + PADDING;


  /* LIGHTS */
  createSpotlights();
  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( 0, 1, 0 );
  hemisphereLight = new THREE.HemisphereLight( 0xFFB74D, 0x37474F, 1 );
  hemisphereLight.position.y = 500;


  /* POWERUPS */
  startPowerupLogic();


  /* HERO */
  hero = new Hero();


  /* SCENE */
  scene.add( camera, directionalLight, hemisphereLight, plane, sky, hero );
}

function runGame () {
  window.addEventListener( 'resize', onWindowResize );
  render();
  onWindowResize();
}

initGame();
runGame();
