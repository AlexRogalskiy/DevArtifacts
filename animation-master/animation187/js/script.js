// init
function init() {
  var scene = new THREE.Scene(); // init scene

  var camera = new THREE.PerspectiveCamera(
    45, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near clipping plane (beyond which nothing is visible)
    1000 // far clipping plane (beyond which nothing is visible)
  );

  var renderer = new THREE.WebGLRenderer(); // init renderer to render scene
  renderer.setSize( window.innerWidth, window.innerHeight ); // set size of renderer to window size
  document.getElementById('webgl').appendChild(renderer.domElement); // append to webgl id

  renderer.render( scene, camera ); // render everything
}

init(); 

function scene() {
  var geo = new THREE.SphereGeometry(1);
}