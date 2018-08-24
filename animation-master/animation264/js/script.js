const MathUtils = {
	lerp(a, b, t) {
		return a + t * (b - a);
	},
	
	roundTo(n, step) {
		return Math.round(n / step) * step;
	},
};

const ArrayUtils = {
	getRandom(array) {
		const index = Math.floor(array.length * Math.random());

		return array[index];
	},
};

const drawCircle = (context, x, y, r) => {
	const { height, width } = context.canvas;

	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2);
};

const drawHexagon = (context, x, y, r, a) => {
	const { height, width } = context.canvas;
	const aDelta = 2 * Math.PI / 6;

	context.beginPath();
	context.moveTo(x + r * Math.cos(a + 1 * aDelta), y + r * Math.sin(a + 1 * aDelta));
	context.lineTo(x + r * Math.cos(a + 2 * aDelta), y + r * Math.sin(a + 2 * aDelta));
	context.lineTo(x + r * Math.cos(a + 3 * aDelta), y + r * Math.sin(a + 3 * aDelta));
	context.lineTo(x + r * Math.cos(a + 4 * aDelta), y + r * Math.sin(a + 4 * aDelta));
	context.lineTo(x + r * Math.cos(a + 5 * aDelta), y + r * Math.sin(a + 5 * aDelta));
	context.lineTo(x + r * Math.cos(a + 6 * aDelta), y + r * Math.sin(a + 6 * aDelta));
	context.closePath();
};

const drawLine = (context, x, y, r, a) => {
	const { height, width } = context.canvas;
	
	context.beginPath();
	context.lineTo(x + r * -Math.cos(a), y + r * -Math.sin(a));
	context.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
	context.closePath();
};

const drawTriangle = (context, x, y, r, a) => {
	const { height, width } = context.canvas;
	const aDelta = 2 * Math.PI / 3;

	context.beginPath();
	context.moveTo(x + r * Math.cos(a + 1 * aDelta), y + r * Math.sin(a + 1 * aDelta));
	context.lineTo(x + r * Math.cos(a + 2 * aDelta), y + r * Math.sin(a + 2 * aDelta));
	context.lineTo(x + r * Math.cos(a + 3 * aDelta), y + r * Math.sin(a + 3 * aDelta));
	context.closePath();
};

const drawShape = (context, tileOptions, shapeOptions) => {
	const { height, width } = context.canvas;

	const draw = ArrayUtils.getRandom([ drawCircle, drawLine, drawHexagon, drawTriangle ]);
	const gridSizeHalf = tileOptions.gridSize * 0.5;

	const lineWidth = MathUtils.lerp(shapeOptions.lineWidthMin, shapeOptions.lineWidthMax, Math.random());
	const r = MathUtils.lerp(shapeOptions.shapeSizeMin, shapeOptions.shapeSizeMax, Math.random());
	
	const xMin = r + lineWidth + gridSizeHalf;
	const xMax = width - (r + lineWidth + gridSizeHalf);
	const yMin = r + lineWidth + gridSizeHalf;
	const yMax = height - (r + lineWidth + gridSizeHalf);
	const x = MathUtils.roundTo(MathUtils.lerp(xMin, xMax, Math.random()), tileOptions.gridSize);
	const y = MathUtils.roundTo(MathUtils.lerp(yMin, yMax, Math.random()), tileOptions.gridSize);
	const a = MathUtils.roundTo(Math.random() * 2 * Math.PI, Math.PI * 2 / 4);
	
	context.save();
	context.lineWidth = lineWidth;
	context.fillStyle = ArrayUtils.getRandom(shapeOptions.colors);
	context.strokeStyle = ArrayUtils.getRandom(shapeOptions.colors);
	
	draw(context, x, y, r, a);

	if (Math.random() < shapeOptions.fillProbability) {
		context.fill();
	} else {
		context.stroke();
	}
	
	context.restore();
};

const shift = (context, contextCopy, tileOptions) => {
	const { height, width } = context.canvas;

	const offsetX = MathUtils.roundTo(MathUtils.lerp(0, 0.5 * width, Math.random()), tileOptions.gridSize);
	const offsetY = MathUtils.roundTo(MathUtils.lerp(0, 0.5 * height, Math.random()), tileOptions.gridSize);

	contextCopy.save();
	contextCopy.clearRect(0, 0, width, height);
	contextCopy.imageSmoothingEnabled = false;
	contextCopy.drawImage(context.canvas, 0, 0);
	contextCopy.restore();

	context.save();
	context.clearRect(0, 0, width, height);
	context.imageSmoothingEnabled = false;
	context.drawImage(contextCopy.canvas, offsetX - width, offsetY - height);
	context.drawImage(contextCopy.canvas, offsetX, offsetY - height);
	context.drawImage(contextCopy.canvas, offsetX, offsetY);
	context.drawImage(contextCopy.canvas, offsetX - width, offsetY);
	context.restore();
};

const updateSize = (tileContext, tileContextCopy, tilePreviewContext, tileSize) => {
	tileContext.canvas.height = tileSize;
	tileContext.canvas.width = tileSize;
	tileContextCopy.canvas.height = tileSize;
	tileContextCopy.canvas.width = tileSize;
	tilePreviewContext.canvas.height = 2 * tileSize;
	tilePreviewContext.canvas.width = 2 * tileSize;
};

const render = (context, contextCopy, tileOptions, shapeOptions) => {
	const background = ArrayUtils.getRandom(shapeOptions.colors);
	const foreground = shapeOptions.colors.filter(c => c !== background);
	const shapeOptionsShape = Object.assign({}, shapeOptions, { colors: foreground });
	const shapeCount = Math.pow(tileOptions.size / tileOptions.gridSize, 2) * shapeOptions.density;

	context.fillStyle = background;
	context.fillRect(0, 0, tileOptions.size, tileOptions.size);
	
	for (let i = 0; i < shapeCount; i++) {
		drawShape(context, tileOptions, shapeOptionsShape);
		shift(context, contextCopy, tileOptions);
	}
};

const renderPreview = (tile, preview) => {
	const { height, width } = tile.canvas;

	preview.drawImage(tile.canvas, 0, 0);
	preview.drawImage(tile.canvas, width, 0);
	preview.drawImage(tile.canvas, 0, height);
	preview.drawImage(tile.canvas, width, height);
};

const shapeOptions = {
	density: 1,
	colors: ['#ecd078', '#d95b43', '#c02942', '#53777a', '#542437'],
	fillProbability: 0.2,
	
	lineWidthMin: 1,
	lineWidthMax: 8,
	
	shapeSizeMin: 4,
	shapeSizeMax: 8,
};

const tileOptions = {
	gridSize: 64,
	size: 1024,
};

const tileContext = document.createElement('canvas').getContext('2d');
const tileContextCopy = document.createElement('canvas').getContext('2d');
const tilePreviewContext = document.createElement('canvas').getContext('2d');

updateSize(tileContext, tileContextCopy, tilePreviewContext, tileOptions.size);
render(tileContext, tileContextCopy, tileOptions, shapeOptions);
renderPreview(tileContext, tilePreviewContext);

document.getElementById('tile-container').appendChild(tileContext.canvas);
document.getElementById('tile-preview-container').appendChild(tilePreviewContext.canvas);

const actions = {
	render() {
		updateSize(tileContext, tileContextCopy, tilePreviewContext, tileOptions.size);
		render(tileContext, tileContextCopy, tileOptions, shapeOptions);
		renderPreview(tileContext, tilePreviewContext);
	},
};

const gui = new dat.GUI();

const guiGeneral = gui.addFolder('General');
guiGeneral.add(tileOptions, 'size', [128, 256, 512, 1024, 2048]).name('Tile size');
guiGeneral.add(tileOptions, 'gridSize', [8, 16, 32, 64, 128]).name('Grid size');

const guiShapes = gui.addFolder('Shapes');
guiShapes.add(shapeOptions, 'density', 0, 2, 0.05).name('Density');
guiShapes.add(shapeOptions, 'fillProbability', 0, 1, 0.1).name('Fill probability');
guiShapes.add(shapeOptions, 'lineWidthMin', 1, 32, 2).name('Min line width');
guiShapes.add(shapeOptions, 'lineWidthMax', 1, 32, 2).name('Max line width');
guiShapes.add(shapeOptions, 'shapeSizeMin', 2, 32, 2).name('Min size');
guiShapes.add(shapeOptions, 'shapeSizeMax', 2, 32, 2).name('Max size');
guiShapes.open();

gui.add(actions, 'render').name('Render');