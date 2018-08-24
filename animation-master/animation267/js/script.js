const MathUtils = {
	lerp(a, b, t) {
		return a + t * (b - a);		
	},
	
	minMax(n, min = 0, max = 1) {
		return Math.max(min, Math.min(max, n));
	}
};

const Animation = {
	animate(callback) {
		const update = (time) => {
			if (!callback(time)) return;
			requestAnimationFrame(update);
		};

		update(performance.now());
	},
	
	createTween(duration, callback) {
		const start = performance.now();
		const end = start + duration;

		this.animate((now) => {
			callback(Math.min(1, (now - start) / duration));

			return now < end;
		});
	},
	
	Easing: {
		inOut(t) {
			const a = MathUtils.lerp(Math.PI * -0.5, Math.PI * 0.5, t);
			return (Math.sin(a) + 1) * 0.5;
		},
	},
};

const createTile = (size) => {
	const context = document.createElement('canvas').getContext('2d');
	context.canvas.height = size;
	context.canvas.width = size;
	
	context.lineWidth = size * 0.125;
			context.strokeStyle = '#1d3246';
	
	context.beginPath();
	context.arc(0, 0, size * .5, 0, Math.PI * 2);
	context.stroke();
	
	context.beginPath();
	context.arc(size, size, size * .5, 0, Math.PI * 2);
	context.stroke();
	
	return context.canvas;
};

const createGrid = (gridSize, tile) => {
	const gridSizeX = gridSize + 2;
	const gridSizeY = gridSize;
	
	const context = document.createElement('canvas').getContext('2d');
	context.canvas.height = gridSize * tile.height;
	context.canvas.width = gridSize * tile.width;
	
	return {
		canvas: context.canvas,
		context: context,
		size: gridSize,
		sizeX: gridSizeX,
		
		tiles: new Array(gridSizeX * gridSizeY).fill().map((_, index) => {
			const x = index % gridSizeX - 1;
			const y = Math.floor(index / gridSizeX);
			const turn = x + y;
			
			return { turn, x, y };
		}),
		
		getX(gridX) {
			return gridX * tile.width;
		},

		getY(gridY) {
			return gridY * tile.height;
		},
		
		render() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			
			this.tiles.forEach((tileData) => {
				const angle = tileData.turn * Math.PI * 0.5;
				const x = this.getX(tileData.x);
				const y = this.getY(tileData.y);
				const tileWidthHalf = 0.5 * tile.width;
				const tileHeightHalf = 0.5 * tile.height;

				context.save();
				context.translate(x + tileWidthHalf, y + tileHeightHalf);
				context.rotate(angle);
				context.drawImage(tile, -tileWidthHalf, -tileHeightHalf);
				context.restore();
			});
		},
	};
};

const GridAnimations = {
	shift(grid) {
		const tweenData = grid.tiles.map((tileData) => {
			// Flooring the turn fixes when rAF doesn't trigger when page is in the background
			const xStart = Math.floor(tileData.x);
			const xEnd = xStart + (tileData.y % 2 === 0 ? - 1 : 1);

			return {
				xStart,
				xEnd,
			};
		});

		Animation.createTween(1000, (tLinear) => {
			grid.tiles.forEach((tileData, index) => {
				const offset = tileData.y / (grid.size - 1);
				const tLinearLocal = tLinear * 2 - offset;

				const tween = tweenData[index];
				const t = Animation.Easing.inOut(MathUtils.minMax(tLinearLocal));

				tileData.x = MathUtils.lerp(tween.xStart, tween.xEnd, t);
				tileData.x = ((tileData.x + 1 + grid.sizeX) % grid.sizeX) - 1;
			});

			grid.render();
		});
	},
	
	turn(grid, cycle, frame) {
		const tweenData = grid.tiles.map((tileData) => {
			// Flooring the turn fixes when rAF doesn't trigger when page is in the background
			const turnStart = Math.floor(tileData.turn);
			const turnEnd = turnStart + (tileData.x * tileData.y + Math.floor(frame / cycle)) % 3 - 1;

			return {
				turnStart,
				turnEnd,
			};
		});

		Animation.createTween(1000, (tLinear) => {
			grid.tiles.forEach((tileData, index) => {
				const offset = tileData.y / (grid.size - 1);
				const tLinearLocal = tLinear * 2 - offset;

				const tween = tweenData[index];
				const t = Animation.Easing.inOut(MathUtils.minMax(tLinearLocal));

				tileData.turn = MathUtils.lerp(tween.turnStart, tween.turnEnd, t);
			});

			grid.render();
		});
	},
};

const tile = createTile(32);
const grid = createGrid(32, tile);
grid.render();

let frame = 0;

setInterval(() => {
	if (frame % 2 === 1) {
		GridAnimations.turn(grid, 4, frame);
	} else {
		GridAnimations.shift(grid);
	}
	
	frame++;
}, 2000);

document.getElementById('container-canvas').appendChild(grid.canvas);