var w = 500, h = 500;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( w, h );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,(w/h),0.1, 1000);
camera.position.set(40, 40, 40);
camera.lookAt(scene.position);
var tiles = [];

function plane(x,y,z,color){
  if(color == undefined){
    color = 0x555555;
  }
  this.x = x;
  this.y = y;
  this.z = z;
  this.color = color;
  var geometry = new THREE.CubeGeometry( 4, 1, 4 );
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading:  THREE.NoShading, emissive: this.color } );
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.x, this.y, this.z ) );
  var tile = new THREE.Mesh( geometry, material );
  
  scene.add( tile );
  tiles.push(tile);
}

new plane(-4,0,0,0x444444), new plane(-8,0,4,0x444444), new plane(-4,0,4), new plane(-8,0,0);

var dummy = new THREE.Object3D();
dummy.position.x = -6;
dummy.position.y = 0.25;
dummy.position.z = 2;
scene.add( dummy );

var geometry = new THREE.CubeGeometry( 4, 4, 4 );
var material = new THREE.MeshLambertMaterial( { color: 0x00FB9F, shading:  THREE.NoShading, emissive: 0x444444 } );
var cube = new THREE.Mesh( geometry, material );
geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -2, 2, 2 ) );
dummy.add( cube );
dummy.rotation.x = Math.PI + (Math.PI/2);

var light = new THREE.PointLight( 0xffffff );
light.position.set( 10, 10, 10 );
scene.add( light );
var rotWorldMatrix;

function rotateAroundWorldAxis( object, axis, radians ) {
  
  var rotationMatrix = new THREE.Matrix4();
  
  rotationMatrix.makeRotationAxis( axis.normalize(), radians );
  rotationMatrix.multiply( object.matrix );                       // pre-multiply
  object.matrix = rotationMatrix;
  object.rotation.setEulerFromRotationMatrix( object.matrix );
}

var bk = false;
function render() {
  requestAnimationFrame(render);
  if(dummy.rotation.x >= Math.PI*2 || bk == true){
    if(dummy.rotation.z <= -(Math.PI/2)){
      bk = true;
      if(dummy.rotation.x <= (Math.PI + (Math.PI/2))){
        if(dummy.rotation.y <= -(Math.PI/2)){
          bk = false;
          dummy.rotation.x = Math.PI + (Math.PI/2);
          dummy.rotation.y = 0;
          dummy.rotation.z = 0;
        }
        else{
          dummy.rotation.y -= 0.1
        }
      }
      else{
        dummy.rotation.x -= 0.1;
      }
    }
    else{
      dummy.rotation.z -= 0.1
    }
  }
  else{
    if(bk == true){
      
    }
    else{
      dummy.rotation.x += 0.1;
    }
  }
  renderer.render(scene, camera);
}
render();