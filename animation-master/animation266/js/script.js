const CANVAS_SIZE = 1024;
const CELL_SIZE = 16;
const CELLS_PER_ROW = CANVAS_SIZE / CELL_SIZE;

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;

document.body.appendChild(canvas);

const startAnimationLoop = (canvas, context, render, iterations = 1) => {
	let frame = 0;
	
	const update = () => {
		requestAnimationFrame(update);
		
		for (let i = 0; i < iterations; i++) {
			render(canvas, context, frame++);
		}
	};
	
	update();
};

const lerp = (a, b, t = 0) => (b - a) * t + a;;

const frameMax = CELLS_PER_ROW * CELLS_PER_ROW;

startAnimationLoop(canvas, context, (canvas, context, frame) => {
	const i = frame % frameMax;
	const t = i / frameMax;
	
	const x = (i % CELLS_PER_ROW) * CELL_SIZE;
	const y = Math.floor(i / CELLS_PER_ROW) % CELLS_PER_ROW * CELL_SIZE;
	let hueShift = 0;

	context.clearRect(x, y, CELL_SIZE, CELL_SIZE);
	context.beginPath();
	
	if (Math.random() < t) {
		context.moveTo(x, y);
		context.lineTo(x + CELL_SIZE, y + CELL_SIZE);
		
		hueShift = -5;
	} else {
		context.moveTo(x + CELL_SIZE, y);
		context.lineTo(x, y + CELL_SIZE);
		
		hueShift = 5;
	}
	
	context.strokeStyle = `hsl(${lerp(120, 180, t) + hueShift}, 100%, 45%)`;

	context.lineWidth = 4;
	context.stroke();
}, CELLS_PER_ROW * .5);