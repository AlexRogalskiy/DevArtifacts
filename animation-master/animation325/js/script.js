let renderer, scene, camera, particles;

let width = window.innerWidth;
let height = window.innerHeight;

let centerVector = new THREE.Vector3(0, 0, 0);

function getImageData(image) {
  
	const canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	
  const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	
  return ctx.getImageData(0, 0, image.width, image.height);

}

function makeMap(imageData) {
  
	const geometry = new THREE.Geometry();
	const material = new THREE.PointsMaterial({
		size: 3,
		color: 0x014593,
		sizeAttenuation: false
	});
  
	for (var y = 0, y2 = imageData.height; y < y2; y += 2) {
		for (var x = 0, x2 = imageData.width; x < x2; x += 2) {
			if (imageData.data[(x * 4 + y * 4 * imageData.width) + 3] > 128) {
				const vertex = new THREE.Vector3();
				vertex.x = Math.random() * 1000 - 500;
        vertex.z = 0;
				vertex.destination = {
					x: x - imageData.width * 0.5,
					y: -y + imageData.height * 0.5,
					z: -100
				};
				vertex.speed = Math.random() / 200 + 0.015;
				geometry.vertices.push(vertex);
			}
		}
	}
	particles = new THREE.Points(geometry, material);

	scene.add(particles);

	requestAnimationFrame(render);
};

function init() {
	
  THREE.ImageUtils.crossOrigin = '';
	
  renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("map"),
		antialias: true
	});
  
	renderer.setSize(width, height);
	renderer.setClearColor(0x112033);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
	camera.position.set(0, 0, 300);
	camera.lookAt(centerVector);
	
  scene.add(camera);
  
  const textureLoader = new THREE.TextureLoader()
	const texture = textureLoader.load("https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Europe_map_clear.png/768px-Europe_map_clear.png", function() {
		makeMap(getImageData(texture.image));
	}, null, function() {
    console.log('error loading file')
  } );
  window.addEventListener('resize', onResize, false);
};

function onResize() {
  
	width = window.innerWidth;
	height = window.innerHeight;
	renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
};

function render(a) {

	requestAnimationFrame(render);

	for (var i = 0, j = particles.geometry.vertices.length; i < j; i++) {
		var particle = particles.geometry.vertices[i];
		particle.x += (particle.destination.x - particle.x) * particle.speed;
		particle.y += (particle.destination.y - particle.y) * particle.speed;
		particle.z += (particle.destination.z - particle.z) * particle.speed;
	}

	particles.geometry.verticesNeedUpdate = true;
  
  if(a < 8000) { 
    camera.position.y = -1500 + Math.sin(a/5000) * 1500;
	  camera.lookAt(centerVector);
  }
  
	renderer.render(scene, camera);
  
};

init();