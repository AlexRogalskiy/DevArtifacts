const PI = Math.PI;
const TAU = 2 * PI;
const cos = Math.cos;
const sin = Math.sin;

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

let worm, mouse;
let tick = 0;
let opts = {
	animation: {
		breathe: true,
		spin: true,
		followMouse: true,
		type: "mobius",
		speed: 4
	},
	motion: {
		rigidity: 0.7,
		responsiveness: 0.3
	},
	color: {
		startHue: 290,
		blur: 0.1
	},
	structure: {
		baseRadius: 40,
		armCount: 26,
		segmentLength: 18,
		segmentMin: 6,
		segmentMax: 28,
		segmentNum: () =>
			Math.round(Math.random() * (opts.structure.segmentMax - opts.structure.segmentMin) + opts.structure.segmentMin)
	},
	noise: {
		enabled: true,
		strength: 0.5,
		type: "rough"
	},
	reset: () => {
		noise.seed(Math.round(2000 * Math.random()));
		worm = new Worm(opts.structure.armCount);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
};

class Mouse {
	constructor() {
		this.hover = false;
		this.position = new Vector2(
			0.5 * window.innerWidth,
			0.5 * window.innerHeight
		);
		this.animationTarget = new Vector2(
			this.position.x, this.position.y
		);
		this.animate = {
			random: () => {
				if (tick % 180 === 0) {
					this.animationTarget.x = Math.random() * canvas.width;
					this.animationTarget.y = Math.random() * canvas.height;
				}
				this.position.lerp(this.animationTarget, 0.35);
			},
			mobius: () => {
				this.animationTarget.lerp({
					x: 0.5 * canvas.width + (0.35 * canvas.width) * cos(tick * 0.0125),
					y: 0.5 * canvas.height + (0.35 * canvas.height) * sin(tick * 0.025)
				}, 0.85);
				this.position.lerp(this.animationTarget, 0.65);
			},
			idle: () => { 
				this.animationTarget.x = 0.5 * canvas.width;
				this.animationTarget.y = 0.5 * canvas.height;
				this.position.lerp(this.animationTarget, 1);
			}
		};
	}
}

class Segment {
	constructor(x, y, len, angle, parent, index) {
		this.index = index;
		switch(opts.noise.type) {
			case "rough" :
				this.tick = Math.round(Math.random() * 10 * opts.structure.armCount);
				break;
			case "even" :
				this.tick = 0;
				break;
			case "gradient" :
				this.tick = index * 200;
				break;
			case "fractal" :
				this.tick = noise.simplex3(x * 0.015, y * 0.015, index * 0.015) * 200;
				break;
			default :
				break;
		}
		this.jointSize = Math.random() * 2.5;
		this.parent = parent;
		this.len = len;
		this.angle = angle;
		this.position = new Vector2(x + this.len * cos(this.angle), y + this.len * sin(this.angle));
		this.velocity = new Vector2();
		this.head = new Vector2(
			this.position.x + this.len * cos(this.angle),
			this.position.y + this.len * sin(this.angle)
		);
	}
	update() {
		this.tick++;
		this.angle = Math.atan2(
			this.parent.position.y - this.position.y,
			this.parent.position.x - this.position.x
		);
		this.head.x = this.parent.position.x;
		this.head.y = this.parent.position.y;
		this.position.lerp(
			{
				x: this.head.x - this.len * cos(this.angle),
				y: this.head.y - this.len * sin(this.angle)
			},
			opts.motion.rigidity
		);
		if (opts.noise.enabled) {	
			let noiseVal = noise.simplex3(this.head.x * 0.0025, this.head.y * 0.0025, this.tick * 0.005) * -TAU;
			this.velocity.x = (cos(noiseVal) * opts.noise.strength);
			this.velocity.y = (sin(noiseVal) * opts.noise.strength);
			this.position.add(this.velocity);
		}
		this.color = `hsla(${-8 * this.index + opts.color.startHue},50%,50%,${1 / (this.index + 0.1)})`;
	}
	draw() {
		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 1;
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(this.head.x, this.head.y);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(this.head.x, this.head.y, this.jointSize, 0, TAU);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
}

class Arm {
	constructor(segmentCount, parent, radius, angle) {
		this.tick = 0;
		this.parent = parent;
		this.segmentCount = segmentCount;
		this.segments = [];
		this.radius = radius;
		this.angle = angle;
		
		let x, y;
		for (let i = 0; i < this.segmentCount; i++) {
			x = this.segments[i - 1]
				? this.segments[i - 1].position.x
				: parent.position.x;
			y = this.segments[i - 1]
				? this.segments[i - 1].position.y
				: parent.position.y;
			this.segments.push(
				new Segment(
					x,
					y,
					opts.structure.segmentLength - i > 2 ? opts.structure.segmentLength - i : 2,
					this.angle,
					this.segments[i - 1] || {
						position: new Vector2(parent.position.x, parent.position.y)
					}, i
				)
			);
		}
	}
	update() {
		this.tick++;
		this.radius = opts.structure.baseRadius;
		if (opts.animation.breathe)
			this.radius += (0.5 * opts.structure.baseRadius * cos(this.tick * 0.05));
		if (opts.noise.enabled) 
			 this.radius += (noise.simplex3(0, 0, this.tick * 0.0075) + 1) * 5;
		for (let i = 0; i < this.segmentCount; i++) {
			this.segments[0].parent.position.x =
				this.parent.position.x +
				(this.radius - i * 50) * cos(this.angle + (opts.animation.spin ? this.tick * 0.0125 : 0));
			this.segments[0].parent.position.y =
				this.parent.position.y +
				(this.radius - i * 50) * sin(this.angle + (opts.animation.spin ? this.tick * 0.0125 : 0));
			this.segments[i].update();
			this.segments[this.segments.length - i - 1].draw();
		}
	}
}

class Worm {
	constructor() {
		this.tick = 0;
		this.arms = [];
		this.armCount = opts.structure.armCount;
		this.velocity = new Vector2(0, 0);
		this.position = new Vector2(
			0.5 * window.innerWidth,
			0.5 * window.innerHeight
		);
		for (var i = 0; i < this.armCount; i++) {
			this.arms.push(
				new Arm(opts.structure.segmentNum(), this, opts.structure.baseRadius, i / this.armCount * TAU)
			);
		}
	}
	animate() {
		this.tick++;
		if (opts.noise.enabled) {
			this.velocity.lerp(
				{
					x:
						cos(
							noise.simplex3(
								this.position.x * 0.0025,
								this.position.y * 0.0025,
								this.tick * 0.0025
							) * PI
						) * opts.noise.strength,
					y:
						sin(
							noise.simplex3(
								this.position.x * 0.0025,
								this.position.y * 0.0025,
								this.tick * 0.0025
							) * PI
						) * opts.noise.strength
				},
				0.0175
			);
		}
		this.position.add(this.velocity);
		this.position.lerp(mouse.position, 0.05 * opts.motion.responsiveness);
		for (let i = 0; i < this.armCount; i++) {
			this.arms[i].update();
		}
	}
}

function initGUI() {
	let gui = new dat.GUI();
	
	let f1 = gui.addFolder("animation");
	f1.open();
	f1.add(opts.animation, "type", ["random", "mobius", "idle"]);
	f1.add(opts.animation, "spin");
	f1.add(opts.animation, "breathe");
	f1.add(opts.animation, "followMouse").onFinishChange(() => mouse.hover = false);
	
	let f2 = gui.addFolder("noise");
	f2.open();
	f2.add(opts.noise, "enabled");
	f2.add(opts.noise, "strength").step(0.1).min(0).max(1);
	f2.add(opts.noise, "type", ["rough", "even", "gradient", "fractal"]).onFinishChange(opts.reset);
	
	let f3 = gui.addFolder("motion");
	f3.open();
	f3.add(opts.motion, "rigidity").step(0.1).min(0.1).max(1);
	f3.add(opts.motion, "responsiveness").step(0.1).min(0.1).max(2);
	
	let f4 = gui.addFolder("color");
	f4.open();
	f4.add(opts.color, "startHue").step(1).min(0).max(360);
	f4.add(opts.color, "blur").step(0.1).min(0).max(0.9);
	
	let f5 = gui.addFolder("structure");
	f5.open();
	f5.add(opts.structure, "baseRadius").step(1).min(5).max(80);
	f5.add(opts.structure, "armCount").step(1).min(4).max(48).onFinishChange(opts.reset);
	f5.add(opts.structure, "segmentLength").step(1).min(5).max(40).onFinishChange(opts.reset);
	f5.add(opts.structure, "segmentMin").step(1).min(2).max(12).onFinishChange(opts.reset);
	f5.add(opts.structure, "segmentMax").step(1).min(12).max(36).onFinishChange(opts.reset);
	
	gui.add(opts, "reset");
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function draw() {
	ctx.fillStyle = `hsla(240,30%,1%,${1 - opts.color.blur})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if (!mouse.hover) mouse.animate[opts.animation.type]();
	worm.animate();
}

function loop() {
	tick++;
	draw();
	window.requestAnimationFrame(loop);
}

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

window.onresize = () => resize();

window.onmousemove = (e) => {
	if (opts.animation.followMouse) {
		mouse.position.x = e.clientX;
		mouse.position.y = e.clientY;
		mouse.hover = true;
	} else {
		mouse.hover = false;
	}
};

window.onmouseout = () => {
	mouse.hover = false;
};

window.onload = () => {
	noise.seed(Math.round(2000 * Math.random()));
	mouse = new Mouse();
	worm = new Worm(opts.armCount);

	initGUI();
	resize();
	loop();
};
