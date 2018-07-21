// Step 1
// We need 3 things: scene, camera and renderer
var scene    = new THREE.Scene(),
    camera   = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 0.1, 1000 ),
    renderer = new THREE.WebGLRenderer({
      alpha: true, // remove canvas' bg color
      antialias: true
    });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// Step 2
// Create Cube Geometry & Mesh
function createCube() {
  var geometry = new THREE.BoxGeometry( 1, 4, 1 ),
      material = new THREE.MeshLambertMaterial({ color: '#268BD2' }),
      cube     = new THREE.Mesh( geometry, material );

  return cube;
}

// Because cube is referenced later
var cube = createCube();

// Just Experimenting. Not Required
// scene.fog = new THREE.Fog('#FFFFFF', 0, 20);

scene.add( cube );
camera.position.z = 10;


// Step 3
// Render Scene
function renderScene() {
  requestAnimationFrame( renderScene );

  cube.rotation.x += 0.03;
  cube.rotation.y += 0.03;

  renderer.render(scene, camera);
}

renderScene();


// Step 4
// Create Lighting
function createLight() {
  var pointLight = new THREE.PointLight(0xffffff, 1, 0);

  pointLight.position.set(0, 20, 10);

  scene.add(new THREE.AmbientLight(0x404040));
  scene.add(pointLight);

  return pointLight;
}
 
// Because pointLight is referenced later to set shadows
var pointLight = createLight();


// Step 5
// Create Cube's Shadow
// Dependent on where you position objects & lights
//
// 1. Enable the shadow map on the renderer
// 2. Tell a light to `castShadow`
// 3. Tell an Object3D to castShadow
// 4. Tell an Object3D to receiveShadow

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

pointLight.castShadow = true;
pointLight.shadow.bias = 0.0001;

// Pixel size of shadow map regardless of how 
// large the shadow is rendered in the final scene.
// Has to be a power of 2 ( 128, 256, 512, etc. )
// Larger sizes are more expensive to render, but render smoother.
pointLight.shadow.mapSize.width = 1024; // default
pointLight.shadow.mapSize.height = 1024; // default

cube.castShadow = true;
cube.receiveShadow = true;

function createFloor() {
  var geometry = new THREE.PlaneGeometry( 200, 100, 1 ),
      material = new THREE.ShadowMaterial({
        uniforms: {
	    	  time: {
            value: 5.0
          },
  		    resolution: {
            value: new THREE.Vector3()
          }
    	  }
      }),
      floor    = new THREE.Mesh( geometry, material );

  material.opacity = 0.4;

  scene.add( floor );
  
  // 1 pi = 180deg in radians.
  // Equates to -90deg in radians.
  floor.rotation.x = Math.PI / -2;
  floor.position.set(0, -4, 0);

  return floor;
}

// Because floor is referenced later to set shadows
var floor = createFloor();

floor.receiveShadow = true;
floor.castShadow = false;


// ========================================================
// WebAPI Audio
// ========================================================

function audioSetup(src, gain) {
	let audioContext,
			masterGain,
			source = src;

	audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
	masterGain.gain.value = gain;
  masterGain.connect(audioContext.destination);

	let song        = new Audio(source),
			songSource  = audioContext.createMediaElementSource(song);

	song.crossOrigin = 'anonymous';
	songSource.connect(masterGain);

  song.play();
}

audioSetup('http://ice1.somafm.com/dronezone-128-aac', 0.15);