function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloatInclusive(min, max) {
	return (Math.random() * (max - min) + min);
}



var canvas,
		lines = [];

var initButton = document.getElementById('init');

const lineOptions = {
	stroke: '#444',
	strokeWidth: 1
};

const size = 400;
const canvasCenter = { x: size / 2, y: size / 2 };
const background = '#F6F3ED';

const types = {
	STEM: 'stem',
	LEAF: 'leaf'
}


var plants = [
	{
		center: { x: canvasCenter.x - 100, y: canvasCenter.y - 20 },
		containerType: 'block',
		instructions: {
			0: { count: 1, angleDelta: [5, 10], length: 30, type: types.STEM },
			1: { count: [2, 4], angleDelta: [30, 50], length: 30, type: types.STEM },
			2: { count: 3, angleDelta: [70, 88], length: 6, type: types.LEAF }
		}
	},
	{
		center: { x: canvasCenter.x, y: canvasCenter.y - 20 },
		containerType: 'grid',
		instructions: {
			0: { count: 1, angleDelta: [5, 10], length: 80, type: types.STEM },
			1: { count: [4, 6], angleDelta: [30, 50], length: 30, type: types.STEM },
			2: { count: 3, angleDelta: [70, 88], length: 7, type: types.LEAF }
		}
	},
	{
		center: { x: canvasCenter.x + 100, y: canvasCenter.y - 20 },
		containerType: 'dots',
		instructions: {
			0: { count: 1, angleDelta: [5, 10], length: 40, type: types.STEM },
			1: { count: [2, 4], angleDelta: [30, 50], length: 50, type: types.STEM },
			2: { count: 6, angleDelta: [70, 88], length: 5, type: types.LEAF }
		}
	},
	{
		center: { x: canvasCenter.x - 100, y: canvasCenter.y + 140 },
		containerType: 'dashes',
		instructions: {
			0: { count: 1, angleDelta: [5, 10], length: 40, type: types.STEM },
			1: { count: [2, 6], angleDelta: [30, 50], length: 30, type: types.STEM },
			2: { count: 4, angleDelta: [70, 88], length: 4, type: types.LEAF }
		}
	},
	{
		center: { x: canvasCenter.x, y: canvasCenter.y + 140 },
		containerType: 'block',
		instructions: {
			0: { count: 1, angleDelta: [5, 10], length: 30, type: types.STEM },
			1: { count: [1, 2], angleDelta: [30, 50], length: 60, type: types.STEM },
			2: { count: 3, angleDelta: [70, 88], length: 12, type: types.LEAF }
		}
	},
	{
		center: { x: canvasCenter.x + 100, y: canvasCenter.y + 140 },
		containerType: 'grid',
		instructions: {
			0: { count: 1, angleDelta: [5, 10], length: 50, type: types.STEM },
			1: { count: [2, 4], angleDelta: [30, 50], length: 20, type: types.STEM },
			2: { count: 2, angleDelta: [70, 88], length: 5, type: types.LEAF }
		}
	},
];


class Plant {
	constructor(center, instructions, containerType) {
		
		this.instructions = instructions;

		this.container = this.drawContainer(center, containerType);
		
		this.stems = [];
		this.leaves = [];

		var start = new fabric.Line([center.x, center.y, center.x, center.y], lineOptions);
		this.drawStep(start, 0);
		
		var plantComponents = _.concat(this.stems, this.leaves, this.container);

		var plant = new fabric.Group(plantComponents);
		plant.set({
			originX: 'center',
			originY: 'bottom'
		});
		plant.set({
			top: Math.ceil(center.y),
			left: Math.ceil(center.x)
		});
		canvas.add(plant);
		
		return plant;

	}
	
	drawStep(prevLine, depth) {
		if (depth < Object.keys(this.instructions).length) {
			var plantStep = this.instructions[depth];
			var side = Math.random() < 0.5 ? -1 : 1;
			var count = plantStep.count;
			if (Array.isArray(count)) {
				count = getRandomIntInclusive(count[0], count[1]);
			}
			for (var n = 0; n < count; n++) {
				side = side * -1;
				var angle = getRandomIntInclusive(plantStep.angleDelta[0], plantStep.angleDelta[1]) * side;
				var lineDistance = 0.25 + (0.75 * (n / count)) + (side * getRandomFloatInclusive(0.05, 0.1));
				var point = findPointOnLine(prevLine, lineDistance);
				if (plantStep.type === types.STEM) {
					var line = this.drawStem(point.x, point.y, plantStep.length, angle);
					this.stems.push(line);
					this.drawStep(line, depth + 1);	
				}
				if (plantStep.type === types.LEAF) {
					var line = this.drawStem(point.x, point.y, plantStep.length, angle);
					var prevPlantStep = this.instructions[depth - 1];
					angle = angle - getRandomIntInclusive(prevPlantStep.angleDelta[0], prevPlantStep.angleDelta[1]);
					this.leaves.push(this.drawLeaf(line, angle));	
				}			
			}
		}
	}
	
	drawStem(x, y, length, degrees) {
		var points = [x, y, x, y - length]; // always 'up' for right now
		var rotationOrigin = new fabric.Point(x, y);
		var angle = fabric.util.degreesToRadians(degrees);
		var end = fabric.util.rotatePoint(new fabric.Point(points[2], points[3]), rotationOrigin, angle);
		var rotatedPoints = [x, y, end.x, end.y];
		var line = new fabric.Line(rotatedPoints, lineOptions);
		line.setCoords();
		return line;
	}
	
	drawLineWithOptions(x, y, length, degrees, options) {
		var points = [x, y, x, y - length]; // always 'up' for right now
		var rotationOrigin = new fabric.Point(x, y);
		var angle = fabric.util.degreesToRadians(degrees);
		var end = fabric.util.rotatePoint(new fabric.Point(points[2], points[3]), rotationOrigin, angle);
		var rotatedPoints = [x, y, end.x, end.y];
		var line = new fabric.Line(rotatedPoints, options);
		line.setCoords();
		return line;
	}
	
	drawLeaf(line, degrees) {
		var circumfrence = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
		var point = findPointOnLine(line, 0.5);
		var circleOptions = _.extend({}, lineOptions, {
			fill: background, // leafColor
			radius: circumfrence / 2,
			originX: 'center',
			originY: 'center',
			top: point.y,
			left: point.x
		});
		var circle = new fabric.Circle(circleOptions);
		var group = new fabric.Group([circle]);
		if (circumfrence > 2) {
			var halfLine = this.drawStem(circle.left, circle.top, circumfrence / 2, -degrees);
			group.add(halfLine);		
		}
				
		circle.sendToBack();
		return group;
	}
	
	drawContainer(center, containerType) {
		var gridsize = 8;
		
		var width = 40;
		var height = getRandomIntInclusive(40, 50);
		if (containerType === 'grid') {
			height = Math.ceil(height / gridsize) * gridsize;
		}
		var containerOptions = _.extend({}, lineOptions, {
			width: width,
			height: height,
			fill: background,
			originX: 'left',
			originY: 'top',
			top: Math.ceil(center.y),
			left: Math.ceil(center.x - (width / 2))
		});
		var container = new fabric.Rect(containerOptions);

		var group = new fabric.Group([container]);

		switch (containerType) {
			case 'block':
				var decorationOptions = _.extend({}, lineOptions, {
					width: 40,
					height: getRandomIntInclusive(6, 18),
					fill: lineOptions.stroke,
					top: container.top,
					left: container.left
				});
				group.add(new fabric.Rect(decorationOptions));
				break;
			case 'grid':
				var gridOptions = _.extend({}, lineOptions);
				for (var x = 1; x < (container.width / gridsize); x++) {
					var points = [container.left + (x * gridsize), container.top, container.left + (x * gridsize), container.top + container.height];
					group.add(new fabric.Line(points, gridOptions));
				}
				for (var y = 1; y < (container.height / gridsize); y++) {
					var points = [container.left, container.top + (y * gridsize), container.left + container.width, container.top + (y * gridsize)];
					group.add(new fabric.Line(points, gridOptions));
				}
				break;
			case 'dashes':
				var dashsize = 10;
				var dashOptions = _.extend({}, lineOptions, {
					strokeWidth: 2,
					strokeLineCap: 'round'
				});
				var flip = 1;
				for (var i = -1; i < (container.height / dashsize) + 1; i++) {
					for (var n = -1; n < (container.width / dashsize) + 1; n++) {
						var flip = flip * -1;
						var x = container.left + (dashsize * n) - (flip * 2);
						var y = container.top + (dashsize * i) - (flip * 4);
						var line = this.drawLineWithOptions(x, y, (dashsize / 2), getRandomIntInclusive(flip * 30, flip * 70), dashOptions);
						group.add(line);
					}
				}
				break;
			case 'dots':
				var dotSpacing = 8;
				var dotOffset = 4;
				var dotOptions = _.extend({}, lineOptions, {
					radius: 1,
					fill: lineOptions.stroke,
					strokeWidth: 0
				});
				for (var i = -1; i < (container.height / dotSpacing) + 1; i++) {
					for (var n = -1; n < (container.width / dotSpacing) + 1; n++) {
						var top = container.top + (dotSpacing * i) + dotOffset;
						var left = container.left + (dotSpacing * n) + dotOffset;
						var dot = new fabric.Circle(_.extend({}, dotOptions, {
							top: top,
							left: left
						}));
						group.add(dot);
					}
				}
				// todo
				break;
			default:
				break;
		}
		
		group.clipTo = function(ctx) {
			var width = Math.ceil(container.width) + lineOptions.strokeWidth;
			var height = Math.ceil(container.height) + lineOptions.strokeWidth;
			ctx.rect(-(width / 2), -(height / 2), width, height);
		}
		
		return group;
	}
}


var init = function() {
	
	initButton.disabled = true;
		
	canvas = new fabric.StaticCanvas('c', {
		backgroundColor: background,
		enableRetinaScaling: true,
		width: size,
		height: size
	});
	
	// ?? hmm
	var shuffledPlants = _.shuffle(plants);
	
	for (var i = 0; i < shuffledPlants.length; i++) {
		var plant = shuffledPlants[i];
		var p = new Plant(plant.center, plant.instructions, plant.containerType);
	}

	initButton.disabled = false;

}


var getOrigins = function(points) {
	var origins = { x: undefined, y: undefined };

	// x origin
	if (points[0] > points[2]) {
		origins.x = 'right';
	} else if (points[0] < points[2]) {
		origins.x = 'left';
	} else {
		origins.x = 'left';
	}
	// y origin
	if (points[1] > points[3]) {
		origins.y = 'bottom';
	} else if (points[1] < points[3]) {
		origins.y = 'top';
	} else {
		origins.y = 'bottom';
	}
	
	return origins;
}

// distance should be 0-1
var findPointOnLine = function(line, distance) {
  var xdiff = line.x2 - line.x1;
  var ydiff = line.y2 - line.y1;
  var xstep = xdiff * distance;
  var ystep = ydiff * distance;
	
	return { 
		x:  line.x1 + xstep, 
		y: line.y1 + ystep
	};
}

init();

