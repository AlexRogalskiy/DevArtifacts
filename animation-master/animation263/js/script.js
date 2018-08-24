class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  addScalar(s) {
    this.x += s;
    this.y += s;
    return this;
  }

  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  divideScalar(s) {
    this.x /= s;
    this.y /= s;
    return this;
  }

  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  subtractScalar(s) {
    this.x -= s;
    this.y -= s;
    return this;
  }

  negate() {
    return this.multiplyScalar(-1);
  }

  normalize() {
    return this.divideScalar(this.getMagnitude());
  }

  set(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  setDirection(direction) {
    const magnitude = this.getMagnitude();

    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;

    return this;
  }

  getDot(v) {
    return (this.x * v.x) + (this.y * v.y);
  }

  getMagnitude() {
    return Math.sqrt(this.getMagnitudeSquared());
  }

  getMagnitudeSquared() {
    return (this.x * this.x) + (this.y * this.y);
  }

  static fromPolar(direction, magnitude) {
    const x = Math.cos(direction) * magnitude;
    const y = Math.sin(direction) * magnitude;

    return new Vector2(x, y);
  }

  static fromScalar(s) {
    return new Vector2(s, s);
  }

  static random(min = -1, max = 1) {
		const getRandomNumber = () => {
			return Math.random() * (max - min) + min;
		};
		
    return new Vector2(getRandomNumber(), getRandomNumber());
  }

  static lerp(a, b, t) {
    return b.clone().subtract(a).multiplyScalar(t).add(a);
  }

  static isVector2(v) {
    return v instanceof Vector2;
  }
}

class PhysicsObject {
	constructor(position = Vector2.fromScalar(0), velocity = Vector2.fromScalar(0), mass = 1) {
		this.position = position;
		this.velocity = velocity;
		this.mass = mass;
	}
	
	getPullForce(physicsObject) {
		const diff = physicsObject.position.clone().subtract(this.position.clone());
		const force = this.mass * physicsObject.mass / diff.getMagnitudeSquared();
		
		return Vector2.fromPolar(diff.getDirection(), -force);
	}
	
	accelerate(force) {
		this.velocity.add(force.clone().divideScalar(this.mass));
	}
	
	update(delta) {
		this.position.add(this.velocity.clone().multiplyScalar(delta));
	}
	
	render(context, scale) {
		context.arc(
			this.position.x * scale,
			this.position.y * scale,
			2, 0, Math.PI * 2
		);
	}
}

class BlackHole extends PhysicsObject {
	constructor(position, mass = 1) {
		super(position, Vector2.fromScalar(0), mass);
	}
}

class Simulation {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		
		this.loop = this.animate.bind(this);
		
		this.blackHole = new BlackHole(Vector2.fromScalar(0), 4);
		this.reset();
	}
	
	reset() {
		const { width, height } = this.canvas;
		this.context.clearRect(0, 0, width, height);
		
		const velocityBase = this.blackHole.mass * 1000;
		
		const getAngle = n => Math.PI * 2 / 3 * n;
		const getPosition = n => Vector2.fromPolar(getAngle(n), .5 + n * .01);
		const getVelocity = n => Vector2.fromPolar(getAngle(n) + Math.PI / 2 + n * .5, velocityBase);
		
		this.objects = [
			new PhysicsObject(getPosition(0), getVelocity(0)),
			new PhysicsObject(getPosition(1), getVelocity(1)),
			new PhysicsObject(getPosition(2), getVelocity(2)),
		];
	}
	
	setSize(width, height) {
		const pixelRatio = window.devicePixelRatio || 1;
		
		this.canvas.height = height * pixelRatio;
		this.canvas.width = width * pixelRatio;
	}
	
	animate() {
		requestAnimationFrame(this.loop);
		
		for (let i = 0; i < 5; i++) {
			this.update();
			this.render();
		}
	}
	
	update() {
		const delta = 1000 / 60 / 1e8;
		const forceMax = 90;
		
		this.objects.forEach((object) => {
			const force = this.blackHole.getPullForce(object);
			
			this.objects.forEach((otherObject) => {
				if (object === otherObject) return;
				force.add(otherObject.getPullForce(object));
			});
			
			if (force.getMagnitude() > forceMax) {
				force.normalize().multiplyScalar(forceMax);
			}
			
			object.accelerate(force);
		});
		
		this.objects.forEach(object => object.update(delta));
	}
	
	render() {
		const { width, height } = this.canvas;
		const xScale = width * .5;
		const yScale = height * .5;
		const scale = Math.min(xScale, yScale);
		
		const colors = ['#f00', '#ff0', '#f0f'];
		
		this.context.save();
		this.context.translate(xScale, yScale);
		this.context.globalAlpha = .01;
		this.context.globalCompositeOperation = 'multiply';
		
		const getColorAt = i => colors[i % colors.length];
		const getObjectAt = i => this.objects[i % this.objects.length];
		
		this.objects.forEach((object, i) => {
			const currentColor = getColorAt(i);
			const start = object.position.clone().multiplyScalar(scale);
			const end = getObjectAt(i + 1).position.clone().multiplyScalar(scale);
			
			const gradient = this.context.createLinearGradient(
				start.x, start.y,
				end.x, end.y
			);
			
			gradient.addColorStop(0, currentColor);
			gradient.addColorStop(1, getColorAt(i + 1));
			
			this.context.beginPath();
			this.context.moveTo(start.x, start.y);
			this.context.lineTo(end.x, end.y);
			
			this.context.strokeStyle = gradient;
			this.context.stroke();
			
// 			this.context.beginPath();
// 			object.render(this.context, scale);
			
// 			this.context.fillStyle = currentColor;
// 			this.context.fill();
		});
		
		this.context.restore();
	}
}

const sim = new Simulation;
sim.setSize(window.innerWidth, window.innerHeight);
sim.animate();

window.addEventListener('resize', () => {
	sim.setSize(window.innerWidth, window.innerHeight);
});

sim.canvas.addEventListener('click', () => sim.reset());

document.body.appendChild(sim.canvas);