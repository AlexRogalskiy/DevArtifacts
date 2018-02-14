console.clear();

var el = {
  body: document.querySelector('body'),
  marioGroup: undefined,
  goombaGroup: undefined,
  dnaTextarea: $('.dna textarea'),
  camX: document.getElementById('camera_x'),
  camY: document.getElementById('camera_y'),
  camZ: document.getElementById('camera_z'),
  camRotX: document.getElementById('camera-rotation_x'),
  camRotY: document.getElementById('camera-rotation_y'),
  camRotZ: document.getElementById('camera-rotation_z'),
};



// 2D pixel maps
// String used as an array container for pixels (take off your glasses and you'll see them in ascii art)
// '_' Creates no cube, and 'r, g, y' create a red, green or yellow cube
// Uppercase characters make more deep 3d pixels
var dna = {
    
  mario: '\
____rrrrr_______\
___rrrrrrrrr____\
___gggyygy______\
__gygyyygyyy____\
__gyggyyygyyy___\
__ggyyyygggg____\
____yyyyyyy_____\
___ggrggg_______\
__gggrggrggg____\
_ggggrrrrgggg___\
_yygryrryrgyy___\
_yyyrrrrrryyy___\
_yyrrrrrrrryy___\
___rrr__rrr_____\
__ggg____ggg____\
_gggg____gggg___',
  
  goomba: '\
______rrrr______\
_____rrrrrr_____\
____rrrrrrrr____\
___rrrrrrrrrr___\
__rbbrrrrrrbbr__\
_rrrybrrrrbyrrr_\
_rrrybbbbbbyrrr_\
rrrrybyrrybyrrrr\
rrrryyyrryyyrrrr\
rrrrrrrrrrrrrrrr\
_rrrryyyyyyrrrr_\
____yyyyyyyy____\
____yyyyyyyybb__\
___bbyyyyybbbbb_\
___bbbyyybbbbbb_\
____bbb__bbbbb__',
  
  
  mushroom: '\
______yyyy______\
_____yyyyrr_____\
____yyyyrrrr____\
___yyyyyrrrrr___\
__yyyyyyyrrryy__\
_yyrrryyyyyyyyy_\
_yrrrrryyyyyyyy_\
yyrrrrryyyyyrryy\
yyrrrrryyyyyrrry\
yyyrrryyyyyyyrry\
yyyyyyyyyyyyyyyy\
_yrrrwwwwwwrrry_\
____wwwwwwww____\
____wwwwwwyw____\
____wwwwwwyw____\
_____wwwwyw_____',
  
  coin: '\
________________\
________________\
________________\
________________\
________________\
______ryyy______\
_____ryyyyy_____\
____ryyyyyy_____\
____ryyrywyy____\
____ryyrywyy____\
____ryyrywyy____\
____ryyrywyy____\
____ryyrywyy____\
_____ryyryy_____\
_____ryyyyy_____\
______ryyy______\
'
  
};

var m = {
  x: 0,
  y: 0
};

var scene = new THREE.Scene(),
    camera,
    texture,
    controls,
    renderer = new THREE.WebGLRenderer();


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );






/* ---------------------------------------------------------
Stuff making functions
----------------------------------------------------------*/
function makeGrid () {
  var grid = new THREE.GridHelper( 50, 1 );
  grid.position.y = -16;
  scene.add( grid );
}

console.log()

// TODO
// load a texture, set wrap mode to repeat
function makeTexture () {
  var texture = new THREE.TextureLoader().load( "http://lorempixel.com/output/sports-q-c-640-480-9.jpg" );
  texture.crossOrigin = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
}


function makeSky () {
  var geometry = new THREE.SphereGeometry( 900, 2, 32 );
  var material = new THREE.MeshBasicMaterial( {
    // map: texture,
    color: 0x5c94fc,
    side: THREE.DoubleSide
  } );
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );
}

function makeDirectionalLight () {
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( 20, 10, 0 );
  directionalLight.rotation.y = 90;
  directionalLight.castShadow = true;
  
  //var shadowCamera = new THREE.CameraHelper( directionalLight.shadow.camera );
  
  scene.add( directionalLight );
  //scene.add( shadowCamera );
}

function makeLight () {
  var light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
  // light.castShadow = true;
  scene.add( light );
}

function makePointLight () {
  var light = new THREE.PointLight( 0xff0000, 1, 100 );
  light.position.set( 50, 50, 50 );
  scene.add( light );
}

function makeCamera () {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );  
  camera.position.z = 40;
  
  // Camera contrls
  controls = new THREE.OrbitControls( camera, renderer.domElement );  
  controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;
}


function makeCube ($x, $y, $depth, $color) {
  
  var depth = $depth || 2, // 4, // Math.random() * 1.1, // ,
      z = (function() {
        if($depth === 2) {
          return 1;
        } else {
          return 0;
        }
      } ());
  
  //console.log(depth, z);
  
  var geometry = new THREE.BoxGeometry( 1, 1, depth );
  var material = new THREE.MeshLambertMaterial({ 
    color: $color || 0x00ff00 
    //map: texture
  });
  var cube = new THREE.Mesh( geometry, material );
  
  // cube.geometry.computeVertexNormals();
  
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set($x, $y, z);
  
  return cube;
  
  // scene.add( cube );
}

function makePlane () {
  
  var geometry = new THREE.PlaneGeometry( 50, 60, 32 );
  var material = new THREE.MeshLambertMaterial({
    //map: texture,
    color: 0xc84c0c, 
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh( geometry, material );
  
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.rotation.x = 90;
  plane.position.set(10, -20, -10);
  
  scene.add( plane );  
}




/* ---------------------------------------------------------
3D printer
----------------------------------------------------------*/
function makeCharacter ($dna) {
  
  //create an empty container for the group
  el.marioGroup = new THREE.Object3D();
  
  // Loop Mario string DNA
  for (var i=0; i<$dna.length; i++) {

    if ($dna[i] !== '_') {

      var row = Math.floor(i/16),
          x = (function(){
            if ( i < 16 ) {
              return i - 8; // -8 to center it
            } else {
              return i - (16*row) - 8; // -8 to center it
            }
          }()),
          y = Math.floor(i/16) * -1,
          
          // Set Color
          c = (function(){
            var c;
            switch ($dna[i]) {
                case 'r': c = 0xd70000;
                  break;
                case 'g': c = 0x706700;
                  break;
                case 'y': c = 0xf8ab00;
                  break;
                case 'b': c = 0x212121;
                  break;
                case 'w': c = 0xffffff;
                  break;
            }
            return c;
          }());
      
          // Set Depth by reading character uppercase/lowercase
          d = (function(){
            var val;
            switch ($dna[i]) {
                case 'R': val = 4;
                  break;
                case 'G': val =  4;
                  break;
                case 'Y': val = 4;
                  break;
            }
            return val;
          }());

            
      //add a mesh with geometry to it
      el.marioGroup.add( makeCube(x, y, d, c) );
    }
    
     
    


  }
  
  el.marioGroup.name = 'currentObject';
  scene.add( el.marioGroup );
  
}

function removeObject ($objName) {
  var selectedObject = scene.getObjectByName($objName);
  scene.remove( selectedObject );
}



/* ---------------------------------------------------------
Render Function
----------------------------------------------------------*/
function render() {
	requestAnimationFrame( render );
  
  /*
  camera.position.x = el.camX.value;
  camera.position.y = el.camY.value;
  camera.position.z = el.camZ.value;
  
  camera.rotation.x = el.camRotX.value;
  camera.rotation.y = el.camRotY.value;
  camera.rotation.z = el.camRotZ.value;
  */
  
  //el.marioGroup.rotation.x += .1;
  el.marioGroup.rotation.y += .01;
  
  //camera.position.z = m.x;
  //camera.position.x = m.y;
  
  // console.log(camera.position);
  
  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;
  
  controls.update();
  
	renderer.render( scene, camera );
  
  //console.log(el.marioGroup)
  
}



/* ---------------------------------------------------------
Form
----------------------------------------------------------*/
function dnaForm () {
  // console.log();
  $('textarea', el.dna).val(dna.mario);
  
  $('a', el.dna).on('click', function (ev) {
    ev.preventDefault();    
    
    removeObject('currentObject');
    var t = $(this),
        character = dna[t.data('character')] || $('textarea', el.dna).val();
    $('textarea', el.dna).val(character);    
    makeCharacter( $('textarea', el.dna).val() );
  });
}




/* ---------------------------------------------------------
Init stuff
----------------------------------------------------------*/
makeSky();
makeGrid();
// makeCube();
// makePlane();
makeCamera();
makeDirectionalLight();
makeLight();
//makePointLight();

dnaForm();
makeCharacter(dna.mario);
//makeCharacter(dna.goomba);

render();






/* ---------------------------------------------------------
Mouse events
----------------------------------------------------------*/

el.body.addEventListener('mousemove', function (ev) {
  m.x = ((window.innerWidth / 360) * ev.clientY) / 1000;
  m.y = ((window.innerHeight / 360) * ev.clientX) / 1000;
  //console.log(m.x, m.y);
});


