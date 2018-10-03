let ww = window.innerWidth
let wh = window.innerHeight

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas")
})

renderer.setClearColor(0x0000)
renderer.setSize(ww, wh)

let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(50, ww / wh, 1, 5000)
camera.position.set(0, 0, 200)

const controls = new THREE.OrbitControls(camera)

let sphere = new THREE.SphereBufferGeometry(50,50,50)
let spherePositions = sphere.attributes.position.array.slice(0)
let temp = sphere.attributes.position.array

let material = new THREE.ShaderMaterial({
  uniforms: {},
  vertexShader: document.getElementById("wrapVertexShader").textContent,
  fragmentShader: document.getElementById("wrapFragmentShader").textContent
});

let colors = new Float32Array(temp.length);

for(let i=0;i<temp.length;i+=3){
    const perlin = Math.abs(noise.simplex3(sphere.attributes.position.array[i]*0.01,        sphere.attributes.position.array[i+1]*0.01, sphere.attributes.position.array[i+2]*0.01));
  let color = new THREE.Vector3(perlin*0.1, perlin*0.1, perlin*0.3);
  color.toArray(colors, i);
}

sphere.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
let mesh = new THREE.Mesh(sphere, material);
scene.add(mesh);

window.addEventListener("resize", function() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, wh);
});

function render(a) {
  requestAnimationFrame(render);
  for (let i = 0; i < temp.length; i+=3) {
    const perlin = noise.simplex3(temp[i]*0.008+a*0.0005,temp[i+1]*0.01+a*0.0005, temp[i+2]*0.008);
    temp[i] = spherePositions[i] + (perlin * 0.5);
    temp[i+1] = spherePositions[i+1] + (perlin * 10);
    temp[i+2] = spherePositions[i+2] + (perlin * 10);
  }
  
  sphere.addAttribute('position', new THREE.BufferAttribute(temp, 3));
  sphere.applyMatrix(new THREE.Matrix4().makeRotationY(a*0.001));

  renderer.render(scene, camera);
}

requestAnimationFrame(render);