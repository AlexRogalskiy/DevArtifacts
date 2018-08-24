// From: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#simplex-noise
const shaderPartialSimplexNoise = `
//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}`;

// From: https://github.com/cabbibo/glsl-curl-noise
const shaderPartialCurlNoise = `
${shaderPartialSimplexNoise}

vec3 snoiseVec3( vec3 x ){
  float s  = snoise(vec3( x ));
  float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;
}

vec3 curlNoise( vec3 p ){
  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}`

const shaderSimulationPosition = `
uniform float delta;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 position = texture2D(texturePosition, uv).xyz;
	vec3 velocity = texture2D(textureVelocity, uv).xyz;

	gl_FragColor = vec4(position + velocity * delta, 1.0);
}`;

const shaderSimulationVelocity = `
${shaderPartialCurlNoise}

const float CENTER_MASS = 1.0;
const float PARTICLE_MASS = 1.0;
const float VELOCITY_TERMINAL = 0.01;
const float CURL_RADIUS = 0.5;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 position = texture2D(texturePosition, uv).xyz;
	vec3 velocity = texture2D(textureVelocity, uv).xyz;

	float distance = length(position);

	// Calculate curl noise flow field
	float curlForce = min(distance, CURL_RADIUS) / CURL_RADIUS;
	vec3 curlVelocity = curlNoise(position) - velocity;

	// Calculate gravitational pull
	float pullForce = abs((CENTER_MASS * PARTICLE_MASS) / (distance * distance));
	vec3 pull = min(pullForce, VELOCITY_TERMINAL) * -normalize(position);

	vec3 newVelocity = velocity + curlVelocity * curlForce + pull * 16.0;
	
	gl_FragColor = vec4(newVelocity, 1.0);
}`;

const shaderPointFragment = `
void main() {
	gl_FragColor = vec4(1.0, 0.15, 0.05, 0.5);
}`;

const shaderPointVertex = `
attribute vec2 reference;
uniform sampler2D texturePosition;

void main() {
	vec3 position = texture2D(texturePosition, reference).xyz;

	${THREE.ShaderChunk.begin_vertex}
	${THREE.ShaderChunk.project_vertex}

	gl_PointSize = 4.0 * (1.0 / -mvPosition.z);
}`;

const TEXTURE_SIZE = 512;
const TEXTURE_HEIGHT = TEXTURE_SIZE;
const TEXTURE_WIDTH = TEXTURE_SIZE * 2;

let previousFrame = Date.now() / 1000;

const cameraFar = Math.pow(2, 16);
const camera = new THREE.PerspectiveCamera(45, 1, 0.001, cameraFar);
camera.position.z = 8;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
	antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const particles = ((points) => {
	const vertices = new Float32Array(points * 3).fill(0);
	const references = new Float32Array(points * 2);
	
	for (let i = 0; i < references.length; i += 2) {
		const indexVertex = i / 2;
		
		references[i] = (indexVertex % TEXTURE_WIDTH) / TEXTURE_WIDTH;
		references[i + 1] = Math.floor(indexVertex / TEXTURE_WIDTH) / TEXTURE_HEIGHT;
	}
	
	const geometry = new THREE.BufferGeometry();
	geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
	geometry.addAttribute('reference', new THREE.BufferAttribute(references, 2));
	
	const material = new THREE.ShaderMaterial({
		uniforms: {
			texturePosition: { value: null },
		},
		fragmentShader: shaderPointFragment,
		vertexShader: shaderPointVertex,
		side: THREE.DoubleSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: false,
		depthWrite: false,
	});
	
	return new THREE.Points(geometry, material);
})(TEXTURE_WIDTH * TEXTURE_HEIGHT);

scene.add(particles);

const gpuComputationRenderer = new GPUComputationRenderer(TEXTURE_WIDTH, TEXTURE_HEIGHT, renderer);

const dataPosition = gpuComputationRenderer.createTexture();
const dataVelocity = gpuComputationRenderer.createTexture();
const textureArraySize = TEXTURE_WIDTH * TEXTURE_HEIGHT * 4;

for (let i = 0; i < textureArraySize; i += 4) {
	const radius = (1 - Math.pow(Math.random(), 3)) * 1;
	const azimuth = Math.random() * Math.PI;
	const inclination = Math.random() * Math.PI * 2;
	const velocityAzimuthOffset = Math.PI / 2;

	dataPosition.image.data[i] = radius * Math.sin(azimuth) * Math.cos(inclination);
	dataPosition.image.data[i + 1] = radius * Math.cos(azimuth);
	dataPosition.image.data[i + 2] = radius * Math.sin(azimuth) * Math.sin(inclination);
	
	dataVelocity.image.data[i] = 0;
	dataVelocity.image.data[i + 1] = 0;
	dataVelocity.image.data[i + 2] = 0;
	dataVelocity.image.data[i + 3] = 1;
}

const variableVelocity = gpuComputationRenderer
	.addVariable('textureVelocity', shaderSimulationVelocity, dataVelocity);
const variablePosition = gpuComputationRenderer
	.addVariable('texturePosition', shaderSimulationPosition, dataPosition);

variablePosition.material.uniforms.delta = { value: 0 };

gpuComputationRenderer
	.setVariableDependencies(variableVelocity, [ variableVelocity, variablePosition ]);
gpuComputationRenderer
	.setVariableDependencies(variablePosition, [ variableVelocity, variablePosition ]);

variablePosition.wrapS = THREE.RepeatWrapping;
variablePosition.wrapT = THREE.RepeatWrapping;
variableVelocity.wrapS = THREE.RepeatWrapping;
variableVelocity.wrapT = THREE.RepeatWrapping;

const gpuComputationRendererError = gpuComputationRenderer.init();

if (gpuComputationRendererError) {
	console.error('ERROR', gpuComputationRendererError);
}

const resize = (
	width = window.innerWidth,
	height = window.innerHeight
) => {
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	
	renderer.setSize(width, height);
};

const render = (delta) => {
	gpuComputationRenderer.compute();
	
	variablePosition.material.uniforms.delta.value = Math.min(delta, 0.5);

	particles.material.uniforms.texturePosition.value = gpuComputationRenderer
		.getCurrentRenderTarget(variablePosition).texture;
	
	renderer.render(scene, camera);
};

const animate = () => {
	requestAnimationFrame(animate);
	
	const now = Date.now() / 1000;
	const delta = now - previousFrame;
	previousFrame = now;
	
	render(delta);
};

document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => resize());

resize();
animate();