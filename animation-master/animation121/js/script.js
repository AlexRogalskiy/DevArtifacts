var vertexHeight = 8000;
var planeDefinition = 200;
var planeSize = 2000000;

var camera, scene, renderer,
			particle1, particle2,
			light1, light2, light3, light4,
			object, loader;

var container = document.createElement('div');
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 150, window.innerWidth / window.innerHeight, 1, 100000 );
camera.position.set( 0, 1000, 0);

var scene = new THREE.Scene();

scene.fog = new THREE.Fog( 0x000000, 1, 90000 );

var	plane = new THREE.Mesh(
	new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ),
	new THREE.MeshBasicMaterial( { color: 0xff0040, wireframe: false }))
plane.rotation.x -=Math.PI*.5;

scene.add(plane);



var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

updatePlane();

 function updatePlane() { 
   for (var i = 0; i < plane.geometry.vertices.length; i++) 
   { plane.geometry.vertices[i].z += Math.random()*vertexHeight -vertexHeight; } 
 };


render();

function render() {
	requestAnimationFrame( render );
	camera.position.z -= 125;
	renderer.render( scene, camera );
}


