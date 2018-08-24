const fragmentShader = `
uniform vec3 balls[{ballCount}];
uniform vec3 diffuse;
uniform float radius;
uniform float threshold;

varying vec2 vPosition;

void main() {
float r = 0.0;

gl_FragColor = vec4(diffuse, 1.0);

for (int i = 0; i < {ballCount}; i++) {
vec2 ball = balls[i].xy;
vec2 distance = vPosition - ball;

r += (radius * radius) / (distance.x * distance.x + distance.y * distance.y);
}

if (r < threshold) {
discard;
}
}`;

const vertexShader = `
varying vec2 vPosition;

void main() {
vPosition = position.xy;

gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const MathUtil = {
	TAU: Math.PI * 2,
};

class RandomNumberGenerator {
	static get a() {
		return 2147483647;
	}

	static get b() {
		return 16807;
	}

	constructor(seed = Math.floor(RandomNumberGenerator.a * Math.random())) {
		this.setSeed(seed);
	}

	setSeed(seed) {
		this.seed = (seed + RandomNumberGenerator.a) % RandomNumberGenerator.a;
	}

	next() {
		this.seed = (this.seed * RandomNumberGenerator.b) % RandomNumberGenerator.a;

		return this.seed;
	}

	nextFloat() {
		return this.next() / RandomNumberGenerator.a;
	}
}

class BallController {
	static get BALL_MOVEMENT_CYCLE_DURATION() {
		return 32;
	}

	static get BALL_MOVEMENT_RADIUS() {
		return 16;
	}

	constructor(ball) {
		const generator = new RandomNumberGenerator();

		this.ball = ball;
		this.frequency = BallController.getRandomVector(generator);
		this.phase = BallController.getRandomVector(generator).multiplyScalar(MathUtil.TAU);
	}

	update(time) {
		const angle = time * MathUtil.TAU / BallController.BALL_MOVEMENT_CYCLE_DURATION;

		this.ball.set(
			Math.sin(angle * this.frequency.x + this.phase.x) * BallController.BALL_MOVEMENT_RADIUS,
			Math.sin(angle * this.frequency.y + this.phase.y) * BallController.BALL_MOVEMENT_RADIUS,
			0
			// Math.sin(angle * this.frequency.z + this.phase.z) * BallController.BALL_MOVEMENT_RADIUS
		);
	}

	static getRandomVector(generator) {
		return new THREE.Vector3(
			generator.nextFloat(),
			generator.nextFloat(),
			generator.nextFloat()
		);
	}
};

const createMetaballShader = (ballCount) => {
	const uniformBalls = [];
	const uniforms = {
		balls: {
			type: 'v3v',
			value: new Array(ballCount),
		},
		diffuse: { value: null },
		radius: { value: 0 },
		threshold: { value: 1 },
	};

	return {
		uniforms,
		fragmentShader: fragmentShader.replace(/{ballCount}/g, ballCount),
		vertexShader,
	};
};

class Simulation {
	static get ballRadius() {
		return 1;
	}

	constructor(ballCount, color) {
		this.color = color;

		this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1024);
		this.camera.position.z = 64;

		this.renderer = Simulation.createRenderer();
		this.scene = new THREE.Scene();

		this.composer = new THREE.EffectComposer(this.renderer);
		this.ballControllers = new Array(ballCount).fill();
		this.metaballPass = null;

		if (this.renderer.capabilities.maxFragmentUniforms > this.ballControllers) {
			throw new Error(`Amount of balls can't be more than ${this.renderer.capabilities.maxFragmentUniforms}.`);
		}
	}

	async initialize() {
		this.initializeComposer();
		this.initializeScene();
	}

	initializeComposer() {
		const metaballShader = createMetaballShader(this.ballControllers.length);
		const renderPass = new THREE.RenderPass(this.scene, this.camera);

		this.metaballPass = new THREE.ShaderPass(metaballShader);
		this.metaballPass.material.transparent = true;
		this.metaballPass.uniforms.diffuse.value = this.color;
		this.metaballPass.uniforms.threshold.value = 0.75;
		this.metaballPass.renderToScreen = true;

		this.composer.addPass(renderPass);
		this.composer.addPass(this.metaballPass);
	}

	initializeScene() {
		this.ballControllers = this.ballControllers.map((_, i) => {
			const ballController = new BallController(new THREE.Vector3());

			this.ballControllers.push(ballController);

			return ballController;
		});
	}

	setSize(size) {
		this.camera.aspect = 1;
		this.camera.updateProjectionMatrix();

		this.composer.setSize(size, size);
		this.renderer.setSize(size, size);
	}

	render(time) {
		const ballUvs = this.metaballPass.uniforms.balls.value;

		this.metaballPass.uniforms.radius.value = new THREE.Vector3(Simulation.ballRadius, 0, 0).project(this.camera).x;

		this.ballControllers.forEach((controller, index) => {
			controller.update(time);

			ballUvs[index] = controller.ball.clone().project(this.camera);
		});

		this.composer.render();
	}

	static createRenderer() {
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});

		renderer.setPixelRatio(window.devicePixelRatio);

		return renderer;
	}
}

const animate = (fn) => {
	const update = (time) => {
		requestAnimationFrame(update);
		fn(time / 1000);
	};

	update(performance.now());
};

const color = new THREE.Color(0xd6ff5f);
const simulation = new Simulation(32, color);

simulation.setSize(Math.min(window.innerWidth, window.innerHeight));
simulation.initialize();

window.addEventListener('resize', () => {
	simulation.setSize(Math.min(window.innerWidth, window.innerHeight));
});

document.body.appendChild(simulation.renderer.domElement);

animate(time => simulation.render(time));