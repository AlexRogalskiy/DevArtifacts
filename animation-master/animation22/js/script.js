

var container, stats;

var camera, scene, renderer;

var mesh, material;

var attributes;

var triangleIndex = 0;
var triangles = 800;
var color = new THREE.Color();
var now;

init();
var start = Date.now();
animate();

function init() {

  container = document.getElementById( 'container' );

  //

  camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
  camera.position.z = 2750;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

  //

  scene.add( new THREE.AmbientLight( 0x444444 ) );

  var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light1.position.set( 1, 1, 1 );
  scene.add( light1 );

  var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
  light2.position.set( 0, -1, 0 );
  scene.add( light2 );

  //
  var geometry = new THREE.BufferGeometry();

  var positions = new Float32Array( triangles * 3 * 3 );
  var normals = new Float32Array( triangles * 3 * 3 );
  var colors = new Float32Array( triangles * 3 * 3 );
  var displacement = new Float32Array( triangles * 3 * 3 );
  var starts = new Float32Array(triangles * 3);
  
  var d = Date.now() - start;
  for (var i = 0; i < starts.length; i++) {
    starts[ i ] = d;
  }

  var n = 800, n2 = n/2;	// triangles spread in the cube
  var d = 60, d2 = d/2;	// individual triangle size

  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();

  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();

  for ( var i = 0; i < positions.length; i += 9 ) {

    // positions

    var x = 0;
    var y = 0;
    var z = 0;

    var ax = x + Math.random() * d - d2;
    var ay = y + Math.random() * d - d2;
    var az = z + Math.random() * d - d2;

    var bx = x + Math.random() * d - d2;
    var by = y + Math.random() * d - d2;
    var bz = z + Math.random() * d - d2;

    var cx = x + Math.random() * d - d2;
    var cy = y + Math.random() * d - d2;
    var cz = z + Math.random() * d - d2;

    positions[ i ]     = ax;
    positions[ i + 1 ] = ay;
    positions[ i + 2 ] = az;

    positions[ i + 3 ] = bx;
    positions[ i + 4 ] = by;
    positions[ i + 5 ] = bz;

    positions[ i + 6 ] = cx;
    positions[ i + 7 ] = cy;
    positions[ i + 8 ] = cz;

    // flat face normals

    pA.set( ax, ay, az );
    pB.set( bx, by, bz );
    pC.set( cx, cy, cz );

    cb.subVectors( pC, pB );
    ab.subVectors( pA, pB );
    cb.cross( ab );

    cb.normalize();

    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;

    normals[ i ]     = nx;
    normals[ i + 1 ] = ny;
    normals[ i + 2 ] = nz;

    normals[ i + 3 ] = nx;
    normals[ i + 4 ] = ny;
    normals[ i + 5 ] = nz;

    normals[ i + 6 ] = nx;
    normals[ i + 7 ] = ny;
    normals[ i + 8 ] = nz;
    
    var dx = Math.random()*20;
    var dy = -5 + Math.random()*10;
    var dz = -10 + Math.random()*20;
    
    displacement[ i ]     = dx;
    displacement[ i + 1 ] = dy;
    displacement[ i + 2 ] = dz;

    displacement[ i + 3 ] = dx;
    displacement[ i + 4 ] = dy;
    displacement[ i + 5 ] = dz;

    displacement[ i + 6 ] = dx;
    displacement[ i + 7 ] = dy;
    displacement[ i + 8 ] = dz;

  }
  
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
  geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
  geometry.addAttribute( 'startTime', new THREE.BufferAttribute( starts, 1 ) );

  attributes = geometry.attributes;
    
  geometry.computeBoundingSphere();
  
  material = new THREE.ShaderMaterial({
    uniforms: {
      time: { // float initialized to 0
            type: "f", 
            value: 0.0 
        }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    transparent: true
  })

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function launchTriangle(i)  {
  for (var v = i; v < i+3; v++ ) {
    attributes.startTime.array[v] = now;
    
    color.setHSL( attributes.startTime.array[v]*.00015, 0.4+Math.random()*0.2, 0.5 + Math.random()*0.3 );
    
    attributes.color.array[ v*3 ]     = color.r;
    attributes.color.array[ v*3 + 1 ] = color.g;
    attributes.color.array[ v*3 + 2 ] = color.b;
    
    attributes.color.array[ v*3 + 3 ] = color.r;
    attributes.color.array[ v*3 + 4 ] = color.g;
    attributes.color.array[ v*3 + 5 ] = color.b;
    
    attributes.color.array[ v*3 + 6 ] = color.r;
    attributes.color.array[ v*3 + 7 ] = color.g;
    attributes.color.array[ v*3 + 8 ] = color.b;
  }
 
}

//

function animate() {
  now = Date.now() - start;
  requestAnimationFrame( animate );
  attributes.startTime.needsUpdate = true;
  attributes.color.needsUpdate = true;
  launchTriangleSet();
  render();
}

function launchTriangleSet() {
  for (var i = 0; i < 4; i++) {
    launchTriangle(triangleIndex);
    triangleIndex += 3;
    if (triangleIndex >= triangles * 3) triangleIndex = 0;
  }
  
}

function render() {

  // material.uniforms.time.value = (Date.now() - start)*0.05;
  material.uniforms.time.value = now;
  // 

  renderer.render( scene, camera );

}

