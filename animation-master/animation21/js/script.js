var scene, camera, renderer;
var particleSystem;
var particleCount = 256 * 4;
var sceneMousePosition = new THREE.Vector3(0, 0, 0);

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0x111111 );
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', resize, false);
  document.addEventListener('mousemove', pointerMove);
  document.addEventListener('touchstart', pointerMove);
  document.addEventListener('touchmove', pointerMove);

  renderer.render(scene, camera);

  createParticleSystem();
  scene.add(particleSystem);
  particleSystem.geometry.verticesNeedUpdate = true;
}

function createParticleSystem() {
  var particles = new THREE.Geometry();

  for (var p = 0; p < particleCount; p++) {
    var coords = randomSpherePoint(0, 0, 0, 16 + Math.random() * 12);

    var particle = new THREE.Vector3(coords[0], coords[1], coords[2]);

    var x = Math.random();
    var y = (1 - x) * Math.random();
    var z = 1 - x - y;
    particle.axis = new THREE.Vector3(x, y, z);
    particle.angle = Math.PI / 2 * (0.004 + Math.random() * 0.01);
    particle.spherePosition = new THREE.Vector3(coords[0], coords[1], coords[2]);
    particle.lerpSpeed = 0.02 + Math.random() * 0.18;

    particles.vertices.push(particle);
  }

  THREE.ImageUtils.crossOrigin = '';
  var particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 4,
    map: THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/particle-test.png"),
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    depthWrite: false
  });

  // Create the particle system
  particleSystem = new THREE.Points(particles, particleMaterial);

  particleSystem.geometry.colorsNeedUpdate = true;

  for (var i = 0; i < particleCount; i++) {
    var color = new THREE.Color(0xffffff);
    color.setHSL((i / 256), 0.5, 0.5);
    particleSystem.geometry.colors[i] = color;
  }
}

function animateParticles() {
  var verts = particleSystem.geometry.vertices;
  for (var i = 0; i < verts.length; i++) {
    var axis = new THREE.Vector3(0.5, 0.5, 0);
    verts[i].spherePosition.applyAxisAngle(verts[i].axis, verts[i].angle);
    verts[i].x += (sceneMousePosition.x + verts[i].spherePosition.x - verts[i].x) * verts[i].lerpSpeed;
    verts[i].y += (sceneMousePosition.y + verts[i].spherePosition.y - verts[i].y) * verts[i].lerpSpeed;
    verts[i].z += (sceneMousePosition.z + verts[i].spherePosition.z - verts[i].z) * verts[i].lerpSpeed;
  }
  particleSystem.geometry.verticesNeedUpdate = true;
}

function animate() {
  particleSystem.geometry.colorsNeedUpdate = true;
  animateParticles();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function randomSpherePoint(x0, y0, z0, radius) {
  var u = Math.random();
  var v = Math.random();
  var theta = 2 * Math.PI * u;
  var phi = Math.acos(2 * v - 1);
  var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
  var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
  var z = z0 + (radius * Math.cos(phi));
  return [x, y, z, u, v];
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function pointerMove(event) {
  var pointerX = event.touches ? event.touches[0].pageX : event.pageX;
  var pointerY = event.touches ? event.touches[0].pageY : event.pageY;
  var vector = new THREE.Vector3();
  vector.set(
    (pointerX / window.innerWidth) * 2 - 1, -(pointerY / window.innerHeight) * 2 + 1,
    0.5);

  vector.unproject(camera);

  var dir = vector.sub(camera.position).normalize();

  var distance = -camera.position.z / dir.z;

  sceneMousePosition = camera.position.clone().add(dir.multiplyScalar(distance));
}