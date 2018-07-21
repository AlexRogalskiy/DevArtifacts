const noise = noise;
const PI = Math.PI;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const pow = Math.pow;
const sqrt = Math.sqrt;
const round = Math.round;
const rand = n => n * Math.random();
const randRange = n => n - rand(2 * n);
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => abs((t + 0.5 * m) % m - 0.5 * m) / (0.5 * m);

let tick, CONFIG;

class Config {
	constructor(opts) {
		this.apply(opts);
	}
	apply(opts) {
		Object.assign(this, opts);
	}
	merge(opts) {
		for (key of opts) this.set(key, opts[key]);
	}
	set(key, value) {
		if (!key || !value || !this.hasOwnProperty(key)) return;
		else this[key] = value;
	}
	get(key) {
		return this[key];
	}
	insert(key, value) {
		if (!key || !value) return;
		else this[key] = value;
	}
	delete(key) {
		if (!key) return;
		else delete this[key];
	}
}

class Mouse {
	constructor(element = window) {
		this.element = element;
		this.hover = false;
		this.dblClick = false;
		this.mouseDown = false;
		this.position = new Vector2(
			0.5 * window.innerWidth,
			0.5 * window.innerHeight
		);
		this.lastPosition = this.position.clone();
		this.targetPosition = new Vector2(
			0.5 * window.innerWidth,
			0.5 * window.innerHeight
		);
		this.speed = 0;
		this.initEvents();
	}
	initEvents() {
		let events = [
				"mouseenter",
				"mousemove",
				"mouseover",
				"mouseleave",
				"mouseout",
				"click",
				"dblclick",
				"contextmenu",
				"mousedown",
				"mouseup"
			];
		for (let e of events)
			this.element.addEventListener(e, this.handler.bind(this));
	}
	handler(e) {
		this.lastPosition.x = this.position.x;
		this.lastPosition.y = this.position.y;
		this.position.x = e.clientX;
		this.position.y = e.clientY;
		this.speed = sqrt(
			pow(this.position.x - this.lastPosition.x, 2) +
				pow(this.position.y - this.lastPosition.y, 2)
		);
		switch (e.type) {
			case "mouseenter":
				this.hover = true;
				break;
			case "mousemove":
				this.hover = true;
				break;
			case "mouseout":
				this.hover = false;
				break;
			case "mouseleave":
				this.hover = false;
				break;
			case "mousedown":
				this.mouseDown = true;
				break;
			case "mouseup":
				this.mouseDown = false;
				break;
			case "dblClick":
				this.dblClick = true;
				break;
			default:
				break;
		}
	}
	repel(other, threshold) {
		let distance = this.position.distanceTo(other.position);
		if (distance < threshold) {
			let distNorm = (threshold - distance) / threshold;
			let theta =
				this.position.angleTo(other.position) + 0.35 * PI - distNorm * 0.35 * PI;
			let speedFactor = CONFIG.targetSpeed + CONFIG.mouse.repel * distNorm;
			let x = cos(theta) * speedFactor;
			let y = sin(theta) * speedFactor;
			let target = {
				x: x,
				y: y
			};
			other.velocity.lerp(target, CONFIG.mouse.lerpAmtActual);
		}
	}
	attract(other, threshold) {
		let distance = other.position.distanceTo(this.position);
		if (distance < 2) {
			other.reset = true;
			return;
		} else if (distance < threshold) {
			let distNorm = (threshold - distance) / threshold;
			let theta =
				other.position.angleTo(this.position) - 0.35 * PI + distNorm * 0.35 * PI;
			let speedFactor = CONFIG.targetSpeed + CONFIG.mouse.attract * distNorm;
			let x = cos(theta) * speedFactor;
			let y = sin(theta) * speedFactor;
			let target = {
				x: x,
				y: y
			};
			other.velocity.lerp(target, CONFIG.mouse.lerpAmtActual);
		}
	}
}

class VectorArrayObject {
	constructor(count, max) {
		this.count = count;
		this.max = max;
		this.x = new Float32Array(max);
		this.y = new Float32Array(max);
	}
	get(i) {
		return new Vector2(this.x[i], this.y[i]);
	}
	getX(i) {
		return this.x[i];
	}
	getY(i) {
		return this.y[i];
	}
	set(i, x, y) {
		this.x[i] = x;
		this.y[i] = y;
		return this;
	}
	setX(i, x) {
		this.x[i] = x;
		return this;
	}
	setY(i, y) {
		this.y[i] = y;
		return this;
	}
}

class VectorArrayObjectController {
	constructor(count, max) {
		this.count = count;
		this.max = max;
		this.life = new VectorArrayObject(this.count, this.max);
		this.vertices = new VectorArrayObject(this.count, this.max);
		this.velocities = new VectorArrayObject(this.count, this.max);
	}
	getLife(i) {
		return this.life.getX(i);
	}
	getTTL(i) {
		return this.life.getY(i);
	}
	setLife(i, life) {
		this.life.setX(i, life);
		return this;
	}
	setTTL(i, ttl) {
		this.life.setY(i, ttl);
		return this;
	}
	getVertex(i) {
		return this.vertices.get(i);
	}
	setVertex(i, x, y) {
		this.vertices.set(i, x, y);
		return this;
	}
	getVelocity(i) {
		return this.velocities.get(i);
	}
	setVelocity(i, x, y) {
		this.velocities.set(i, x, y);
		return this;
	}
}

class RenderObject {
	constructor(x, y) {
		this.position = new Vector2(x, y);
		this.lastPosition = this.position.clone();
		this.velocity = new Vector2();
	}
	getPosition() {
		return this.position.clone();
	}
	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
		return this;
	}
	setLastPosition() {
		this.lastPosition.x = this.position.x;
		this.lastPosition.y = this.position.y;
		return this;
	}
	getVelocity() {
		return this.velocity.clone();
	}
	setVelocity(x, y) {
		this.velocity.x = x;
		this.velocity.y = y;
		return this;
	}
	getLife() {
		return this.life;
	}
	setLife(n) {
		this.life = n;
		return this;
	}
	addNoise() {
		let theta =
				noise.simplex3(
					this.position.x * CONFIG.noise.xOffActual,
					this.position.y * CONFIG.noise.yOffActual,
					tick * CONFIG.noise.zOffActual
				) * TAU,
			x = cos(theta) * CONFIG.targetSpeed,
			y = sin(theta) * CONFIG.targetSpeed;
		this.velocity.lerp(
			{
				x: x,
				y: y
			},
			CONFIG.noise.lerpAmtActual
		);
		return this;
	}
}

class Particle extends RenderObject {
	constructor(x, y) {
		super(x, y);
		this.ttl = CONFIG.particles.maxTTL;
		this.reset = false;
		this.setHueFunction();
		this.setAlphaFunction();
	}
	update(vX, vY) {
		this.setVelocity(vX, vY)
			.setLastPosition()
			.checkLife()
			.setColor();

		if (CONFIG.noise.enabled) this.addNoise();

		this.position.add(this.velocity);
		return this;
	}
	checkLife() {
		if (this.life >= this.ttl) this.reset = true;
		return this;
	}
	setNormalizedSpeed() {
		this.normalizedSpeed =
			(CONFIG.targetSpeed - abs(this.velocity.getMagnitude())) /
			CONFIG.targetSpeed;
		return this;
	}
	setColor() {
		this.color = `hsla(${this.getHue()}, 100%, ${this.normalizedSpeed * 30 +
			40}%, ${this.getAlpha()})`;
		return this;
	}
	setHueFunction() {
		switch (CONFIG.particles.colorStyle) {
			case "static":
				this.getHue = () => CONFIG.particles.baseHue;
				break;
			case "speed":
				this.getHue = () =>
					CONFIG.particles.baseHue +
					this.normalizedSpeed * CONFIG.particles.hueRange;
				break;
			case "noise":
				this.getHue = () =>
					CONFIG.particles.baseHue +
					(1 +
						noise.simplex3(
							this.position.x * CONFIG.noise.xOffActual,
							this.position.y * CONFIG.noise.yOffActual,
							tick * CONFIG.noise.zOffActual
						)) *
						0.5 *
						CONFIG.particles.hueRange;
				break;
			default:
				this.getHue = () => CONFIG.particles.baseHue;
				break;
		}
	}
	setAlphaFunction() {
		switch (CONFIG.particles.fade) {
			case "none":
				this.getAlpha = () => 1;
				break;
			case "in":
				this.getAlpha = () => fadeIn(this.life, this.ttl);
				break;
			case "out":
				this.getAlpha = () => fadeOut(this.life, this.ttl);
				break;
			case "inOut":
				this.getAlpha = () => fadeInOut(this.life, this.ttl);
				break;
			default:
				this.getAlpha = () => 1;
				break;
		}
	}
	draw(canvas) {
		canvas.buffer.save();
		canvas.buffer.globalCompositeOperation = "lighter";
		canvas.line(
			this.lastPosition.x,
			this.lastPosition.y,
			this.position.x,
			this.position.y,
			CONFIG.particles.width,
			this.color
		);
		canvas.buffer.restore();
		return this;
	}
}

class ParticleField extends VectorArrayObjectController {
	constructor(
		count = CONFIG.particles.count,
		max = CONFIG.particles.max,
		bounds,
		canvas,
		mouse
	) {
		super(count, max);
		this.bounds = bounds;
		this.canvas = canvas;
		this.mouse = mouse;
		this.noise = new Float32Array(CONFIG.particles.max);
		this.create();
	}
	create() {
		this.renderTarget = new Particle(0, 0, this.bounds);
		for (let i = 0; i < this.count; i++) {
			this.initRenderTarget(i).setLife(i, round(rand(CONFIG.particles.maxTTL)));
		}
	}
	initRenderTarget(i) {
		let theta,
			vX,
			vY,
			x = rand(this.bounds.x),
			y = rand(this.bounds.y);

		if (CONFIG.noise.enabled) {
			theta =
				noise.simplex3(
					x * CONFIG.noise.xOffActual,
					y * CONFIG.noise.yOffActual,
					tick * CONFIG.noise.zOffActual
				) * TAU;
			vX = cos(theta) * (0.5 * (CONFIG.targetSpeed + CONFIG.particles.speed));
			vY = sin(theta) * (0.5 * (CONFIG.targetSpeed + CONFIG.particles.speed));
		} else {
			vX = randRange(CONFIG.particles.speed);
			vY = randRange(CONFIG.particles.speed);
		}
		this.renderTarget.setVelocity(vX, vY);
		this.setVertex(i, x, y)
			.setLife(i, 0)
			.setTTL(i, CONFIG.particles.maxTTL)
			.setVelocity(i, vX, vY);
		this.renderTarget.reset = false;
		return this;
	}
	update() {
		for (let i = this.count - 1; i >= 0; i--) {
			this.life.x[i]++;

			this.renderTarget
				.setLife(this.getLife(i))
				.setPosition(this.vertices.x[i], this.vertices.y[i])
				.update(this.velocities.x[i], this.velocities.y[i])
				.setNormalizedSpeed()
				.draw(this.canvas);

			this.checkMouse()
				.checkBounds()
				.setVertex(i, this.renderTarget.position.x, this.renderTarget.position.y)
				.setVelocity(i, this.renderTarget.velocity.x, this.renderTarget.velocity.y);
			
			if (this.renderTarget.reset) this.initRenderTarget(i);
		}
	}
	addParticles(n) {
		let i, x, y;
		for (i = this.count; i <= this.count + n; i++) {
			this.initRenderTarget(i);
		}
		this.count += n;
	}
	removeParticles(n) {
		for (let i = this.count - n; i < this.count - 1; i++) {
			this.setVertex(i, 0, 0);
			this.setVelocity(i, 0, 0);
		}
		this.count -= n;
	}
	checkMouse() {
		if (this.mouse.hover && !this.mouse.mouseDown)
			this.mouse.repel(this.renderTarget, CONFIG.mouse.threshold);
		if (this.mouse.mouseDown)
			this.mouse.attract(this.renderTarget, CONFIG.mouse.threshold);
		return this;
	}
	checkBounds() {
		if (
			this.renderTarget.position.x > this.bounds.x ||
			this.renderTarget.position.x < 0 ||
			this.renderTarget.position.y > this.bounds.y ||
			this.renderTarget.position.y < 0
		) {
			this.renderTarget.reset = true;
		}
		return this;
	}
}

class Canvas {
	constructor(selector) {
		this.element =
			document.querySelector(selector) ||
			(() => {
				let element = document.createElement("canvas");
				element.style = `position: absolute; width: 100vw; height: 100vh;`;
				document.body.appendChild(element);
				return element;
			})();
		this.ctx = this.element.getContext("2d");
		this.frame = document.createElement("canvas");
		this.buffer = this.frame.getContext("2d");
		this.dimensions = new Vector2();
		window.addEventListener("resize", this.resize.bind(this));
		this.resize();
	}
	resize() {
		this.dimensions.x = this.frame.width = this.element.width = window.innerWidth;
		this.dimensions.y = this.frame.height = this.element.height = window.innerHeight;
	}
	clear() {
		this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
		this.buffer.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
	}
	line(x1, y1, x2, y2, w, c) {
		this.buffer.beginPath();
		this.buffer.strokeStyle = c;
		this.buffer.lineWidth = w;
		this.buffer.moveTo(x1, y1);
		this.buffer.lineTo(x2, y2);
		this.buffer.stroke();
		this.buffer.closePath();
	}
	rect(x, y, w, h, c) {
		this.buffer.fillStyle = c;
		this.buffer.fillRect(x, y, w, h);
	}
	arc(x, y, r, s, e, c) {
		this.buffer.beginPath();
		this.buffer.fillStyle = c;
		this.buffer.arc(x, y, r, s, e);
		this.buffer.fill();
		this.buffer.closePath();
	}
	render() {
		this.ctx.drawImage(this.frame, 0, 0);
	}
	drawImage(image, x = 0, y = 0) {
		this.buffer.drawImage(image, x, y);
	}
}

class AppController {
	constructor(config) {
		this.running = false;
		this.canvas = new Canvas(CONFIG.selector.main);
		this.background = new Canvas(CONFIG.selector.background);
		this.mouse = new Mouse(this.canvas.element);
		this.initParticleField();
		this.setup();
		this.initStats();
		this.initGUI();
		this.loop();
	}
	setup() {
		window.requestAnimationFrame = (() => {
			return (
				window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				}
			);
		})();
		window.addEventListener(
			"keypress",
			e => (e.key === "e" ? this.export() : null)
		);
	}
	initParticleField() {
		this.particleField = new ParticleField(
			CONFIG.particles.count,
			CONFIG.particles.max,
			this.canvas.dimensions,
			this.canvas,
			this.mouse
		);
	}
	drawBackground() {
		this.background.rect(
			0,
			0,
			this.canvas.dimensions.x,
			this.canvas.dimensions.y,
			`hsla(0,0%,0%,${CONFIG.background.alpha})`
		);
		if (CONFIG.background.glow) {
			this.background.buffer.filter = `
				saturate(${200 + CONFIG.background.glowAmt * 500}%) 
				brightness(${200 + CONFIG.background.glowAmt * 500}%)
				blur(${CONFIG.background.glowAmt}px)
			`;
			this.background.drawImage(this.canvas.frame);
			this.background.buffer.save();
			this.background.buffer.globalCompositeOperation = "lighter";
			this.background.drawImage(this.canvas.frame);
			this.background.buffer.restore();
		}
		this.background.render();
	}
	loop() {
		this.stats.begin();

		tick++;
		this.canvas.clear();
		this.particleField.update();
		this.canvas.render();
		this.drawBackground();
		window.requestAnimationFrame(this.loop.bind(this));
		
		this.stats.end();
	}
	initStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.domElement);
	}
	initGUI() {
		this.gui = {
			parent: new dat.GUI(),
			folders: []
		};

		let f0 = this.gui.parent.addFolder("Background");
		this.gui.folders.push(f0);
		f0
			.add(CONFIG.background, "alpha")
			.step(0.05)
			.min(0.1)
			.max(1);

		f0.add(CONFIG.background, "glow");
		f0
			.add(CONFIG.background, "glowAmt")
			.step(1)
			.min(1)
			.max(5);

		let f1 = this.gui.parent.addFolder("Noise");
		this.gui.folders.push(f1);
		f1
			.add(CONFIG.noise, "enabled")
			.onFinishChange(
				en =>
					CONFIG.targetSpeed = en
						? CONFIG.noise.strength + CONFIG.particles.speed
						: CONFIG.particles.speed
			);
		f1
			.add(CONFIG.noise, "strength")
			.step(0.1)
			.min(0.1)
			.max(1)
			.onChange(
				n =>
					CONFIG.targetSpeed = CONFIG.noise.enabled
						? CONFIG.noise.strength + CONFIG.particles.speed
						: CONFIG.particles.speed
			);
		f1
			.add(CONFIG.noise, "lerpAmt")
			.step(0.1)
			.min(0.1)
			.max(5)
			.onChange(n => (CONFIG.noise.lerpAmtActual = n / 100));
		f1
			.add(CONFIG.noise, "xOff")
			.step(0.125)
			.min(0.125)
			.max(20)
			.onChange(n => (CONFIG.noise.xOffActual = 1 / (n * 500)));
		f1
			.add(CONFIG.noise, "yOff")
			.step(0.125)
			.min(0.125)
			.max(20)
			.onChange(n => (CONFIG.noise.yOffActual = 1 / (n * 500)));
		f1
			.add(CONFIG.noise, "zOff")
			.step(0.125)
			.min(0.125)
			.max(20)
			.onChange(n => (CONFIG.noise.zOffActual = 1 / (n * 500)));

		let f2 = this.gui.parent.addFolder("Mouse");
		this.gui.folders.push(f2);
		f2
			.add(CONFIG.mouse, "threshold")
			.step(10)
			.min(100)
			.max(800);
		f2
			.add(CONFIG.mouse, "lerpAmt")
			.step(0.5)
			.min(0.5)
			.max(10)
			.onFinishChange(n => (CONFIG.mouse.lerpAmtActual = n / 100));
		f2
			.add(CONFIG.mouse, "attract")
			.step(1)
			.min(1)
			.max(10);
		f2
			.add(CONFIG.mouse, "repel")
			.step(1)
			.min(1)
			.max(10);

		let f3 = this.gui.parent.addFolder("Particles");
		this.gui.folders.push(f3);
		f3
			.add(CONFIG.particles, "count")
			.step(10)
			.min(10)
			.max(CONFIG.particles.max)
			.onChange(
				n =>
					n < this.particleField.count
						? this.particleField.removeParticles(this.particleField.count - n)
						: this.particleField.addParticles(n - this.particleField.count)
			);
		f3
			.add(CONFIG.particles, "speed")
			.step(0.5)
			.min(1)
			.max(5)
			.onChange(
				n =>
					CONFIG.targetSpeed = CONFIG.noise.enabled 
					 ? CONFIG.noise.strength + n 
					 : n
			);
		f3
			.add(CONFIG.particles, "maxTTL")
			.step(50)
			.min(50)
			.max(1000)
			.onFinishChange(this.initParticleField.bind(this));
		f3
			.add(CONFIG.particles, "width")
			.step(0.5)
			.min(0.5)
			.max(5);
		f3
			.add(CONFIG.particles, "colorStyle", ["static", "speed", "noise"])
			.onChange(() => this.particleField.renderTarget.setHueFunction());
		f3
			.add(CONFIG.particles, "fade", ["none", "in", "out", "inOut"])
			.onChange(() => this.particleField.renderTarget.setAlphaFunction());
		f3
			.add(CONFIG.particles, "baseHue")
			.step(1)
			.min(0)
			.max(360);
		f3
			.add(CONFIG.particles, "hueRange")
			.step(1)
			.min(0)
			.max(360);

		this.gui.parent.add(this, "export");
		this.gui.parent.add(this, "randomize");
		
		this.gui.folders.forEach(folder => folder.open());
	}
	resetGUI() {
		this.gui.parent.destroy();
		this.gui.folders = [];
		this.initGUI();
	}
	export() {
		let $canvas = document.createElement("canvas"),
			$ctx = $canvas.getContext("2d");
		
		$canvas.width = this.canvas.frame.width;
		$canvas.height = this.canvas.frame.height;
		$ctx.drawImage(this.background.frame, 0, 0);
		$ctx.drawImage(this.canvas.frame, 0, 0);
		$canvas.toBlob(blob => saveAs(blob, "screenshot.png"));
	}
	randomize() {
		noise.seed(round(rand(2000)));
		initDefaults();
		this.resetGUI();
		this.initParticleField();
	}
}

function initDefaults() {
	let DEFAULTS = {
		selector: {
			main: ".main",
			background: ".background"
		},
		background: {
			alpha: 0.1 * round(rand(5)) + 0.3,
			glow: true,
			glowAmt: 2 + round(rand(3))
		},
		particles: {
			count: 10 * round(rand(100)) + 700,
			max: 3000,
			maxTTL: 100 * (1 + round(rand(9))),
			speed: 1 + round(rand(4)),
			width: 1 + round(rand(3)),
			colorStyle: ["speed", "noise"][round(rand(1))],
			fade: ["none", "in", "out", "inOut"][round(rand(3))],
			baseHue: round(rand(360)),
			hueRange: 90 + round(rand(180))
		},
		noise: {
			enabled: true,
			strength: 0.1 * round(rand(9)) + 0.1,
			lerpAmt: 1 + round(rand(4)),
			xOff: 1 + round(rand(19)),
			yOff: 1 + round(rand(19)),
			zOff: 1 + round(rand(19))
		},
		mouse: {
			attract: 1 + round(rand(9)),
			repel: 1 + round(rand(9)),
			threshold: 100 + round(rand(700)),
			lerpAmt: 1 + round(rand(9))
		},
		gravity: {
			enabled: true,
			amount: 0
		},
		friction: {
			enabled: false,
			amount: 0.999
		}
	};

	DEFAULTS.noise.xOffActual = 1 / (DEFAULTS.noise.xOff * 100);
	DEFAULTS.noise.yOffActual = 1 / (DEFAULTS.noise.yOff * 100);
	DEFAULTS.noise.zOffActual = 1 / (DEFAULTS.noise.zOff * 100);
	DEFAULTS.noise.lerpAmtActual = DEFAULTS.noise.lerpAmt / 100;
	DEFAULTS.mouse.lerpAmtActual = DEFAULTS.mouse.lerpAmt / 100;
	DEFAULTS.targetSpeed = DEFAULTS.noise.enabled
		? DEFAULTS.particles.speed + DEFAULTS.noise.strength
		: DEFAULTS.particles.speed;

	CONFIG = new Config(DEFAULTS);
}

document.addEventListener("DOMContentLoaded", () => {
	noise.seed(round(rand(2000)));

	tick = 0;

	initDefaults();

	let app = new AppController(CONFIG);
});
