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
	
	clone() {
		return new Vector2(this.x, this.y);
	}
	
	getDirection() {
		return Math.atan2(this.y, this.x);
	}
	
	getLength() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
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
	
	static getAngle(a, b) {
		return b.clone().subtract(a).getDirection();
	}
	
	static getDistance(a, b) {
		return b.clone().subtract(a).getLength();
	}
	
	static fromPolar(phi, radius = 1) {
		return new Vector2(
			Math.cos(phi) * radius,
			Math.sin(phi) * radius
		);
	}
	
	static random() {
		return new Vector2(
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
		);
	}
}

class Vertex {
	constructor(position, velocity, acceleration) {
		this.position = position;
		this.velocity = velocity;
		this.acceleration = acceleration;
	}
}

class Polygon {
	constructor(vertices = []) {
		this.setVertices(vertices);
	}
	
	getVertex(index) {
		return this.vertices[index % this.vertices.length];
	}
	
	setVertices(vertices) {
		this.vertices = vertices;

		this.lengths = this.vertices.map((vertex, vertexIndex) => {
			const vertexNext = this.getVertex(vertexIndex + 1);
			return Vector2.getDistance(vertex.position, vertexNext.position);
		});
	}
	
	update() {
		const delta = 1 / 256;
		
		this.vertices.forEach((vertex, vertexIndex) => {
			const velocity = vertex.velocity.clone().multiplyScalar(delta);
			const acceleration = vertex.acceleration.clone().multiplyScalar(delta * 3);
			
			const vertexNext = this.getVertex(vertexIndex + 1);
			const angle = Vector2.getAngle(vertex.position, vertexNext.position);
			const distance = Vector2.getDistance(vertex.position, vertexNext.position);
			const lengthTarget = this.lengths[vertexIndex];
			
			velocity.add(Vector2.fromPolar(angle, distance - lengthTarget).multiplyScalar(0.25));
			
			vertex.position.add(velocity);
			vertex.velocity.add(acceleration);
		});
	}
}

class Organism {
	constructor(genes = Organism.createGenes()) {
		this.genes = genes;
	}
	
	render(context) {
		const scale = Math.min(context.canvas.width, context.canvas.height) * (1 / 3);
		const properties = Organism.getPhenotypes(this.genes);
		const polygon = Organism.createPolygon(properties);

		context.globalAlpha = 0.1;
		context.lineStyle = '#f00';
		context.lineWidth = 1;
		
		for (let i = 0; i < 256; i++) {
			context.beginPath();
			context.moveTo(
				scale * polygon.vertices[0].position.x,
				scale * polygon.vertices[0].position.y
			);
			
			polygon.vertices.slice(1).forEach((vertex) => {
				context.lineTo(
					scale * vertex.position.x,
					scale * vertex.position.y
				);
			});
			
			context.closePath();
			context.stroke();
			polygon.update();
		}
	}
	
	static createGenes() {
		return new Float32Array(Organism.DNA_LENGTH).fill().map(_ => Math.random());
	}
	
	static createPolygon(properties) {
		const vertexCount = properties.getVertexCount();
		const vertices = new Array(vertexCount).fill().map((_, i) => {
			const seed = i / vertexCount;
			const position = properties.getVertexPosition(seed);
			const velocity = properties.getVertexVelocity(seed);
			const acceleration = properties.getVertexAcceleration(seed);

			return new Vertex(position, velocity, acceleration);
		});
		
		return new Polygon(vertices)
	}
	
	static fromParent(parent, mutationProbability, mutationAmount) {
		return new Organism(parent.genes.map((gene) => {
			if (Math.random() > mutationProbability) return gene;
			return Math.max(0, Math.min(1, gene + mutationAmount * (Math.random() * 2 - 1)));
		}));
	}
	
	static getPhenotypes(genes) {
		return {
			getVertexAcceleration(seed) {
				const angle = this.getVertexAngle(seed);
				return Vector2.fromPolar(angle * genes[0], genes[1]);
			},
			
			getVertexAngle(seed) {
				return (seed + genes[2]) * Math.PI * 2;
			},
			
			getVertexCount() {
				return 3 + Math.floor(genes[3] * 4);
			},
			
			getVertexPosition(seed) {
				const angle = this.getVertexAngle(seed);
				return Vector2.fromPolar(angle, genes[4]);
			},
			
			getVertexVelocity(seed) {
				return Vector2.fromPolar(this.getVertexAngle(seed * genes[5]) + genes[6], 0.5 + genes[7] * 0.5);
			}
		};
	}
	
	static get DNA_LENGTH() {
		return 8;
	}
}

class Population {
	constructor(size, mutationAmount, mutationProbability = 1) {
		this.size = size;
		this.mutationAmount = mutationAmount;
		this.mutationProbability = mutationProbability;
		
		this.organisms = new Array(this.size).fill().map(_ => new Organism());
	}
	
	pick(organism) {
		this.organisms = this.organisms.map((organismOld) => {
			if (organismOld === organism) return organism;
			return Organism.fromParent(organism, this.mutationProbability, this.mutationAmount);
		});
	}
}

const container = document.getElementById('canvas-container');
const contexts = new Array(9).fill().map(() => document.createElement('canvas').getContext('2d'));
const population = new Population(contexts.length, 0.25);

const render = () => {
	contexts.forEach((context, contextIndex) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.save();
		context.translate(context.canvas.width * .5, context.canvas.height * .5);
		
		population.organisms[contextIndex].render(context);
		
		context.restore();
	});
};

contexts.forEach((context, contextIndex) => {
	context.canvas.height = 512;
	context.canvas.width = 512;
	
	context.canvas.addEventListener('click', () => {
		population.pick(population.organisms[contextIndex]);
		render();
	});
	
	container.appendChild(context.canvas);
});

render();