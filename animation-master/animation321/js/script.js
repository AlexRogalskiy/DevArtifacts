var RENDERER = {
	TREE_COUNT : 7,
	LIGHT_COUNT : 200,
	INTERVAL_Z : 400,
	FOCUS : 100,
	TREE_LUMINANCE : {min : 3, max : 15},
	TREE_CHANGE_COUNT : 10,
	TREE_CHANGE_DELTA : 0.5,
	DELTA_THETA : Math.PI / 100,
	
	init : function(){
		this.setParameters();
		this.reconstructMethod();
		this.createElements();
		this.render();
	},
	setParameters : function(){
		this.$container = $('#jsi-forest-container');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.context = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		
		this.backgroundDark = this.context.createLinearGradient(0, 0, 0, this.height);
		this.backgroundDark.addColorStop(0, 'hsl(220, 80%, 40%)');
		this.backgroundDark.addColorStop(0.3, 'hsl(220, 80%, 10%)');
		this.backgroundDark.addColorStop(0.4, 'hsl(220, 80%, 3%)');
		this.backgroundDark.addColorStop(0.6, 'hsl(120, 30%, 3%)');
		this.backgroundDark.addColorStop(1, 'hsl(120, 30%, 10%)');
		this.backgroundLight = this.context.createLinearGradient(0, 0, 0, this.height);
		this.backgroundLight.addColorStop(0, 'hsl(220, 80%, 60%)');
		this.backgroundLight.addColorStop(0.4, 'hsl(220, 80%, 60%)');
		this.backgroundLight.addColorStop(0.6, 'hsl(120, 50%, 60%)');
		this.backgroundLight.addColorStop(1, 'hsl(120, 50%, 60%)');
		
		this.theta = 0;
		this.trees = [];
		this.lights = [];
		this.treeIndex = 0;
		this.orderAsc = true;
		this.distance = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
		this.maxLuminaceCount = (this.TREE_LUMINANCE.max - this.TREE_LUMINANCE.min) * this.TREE_CHANGE_COUNT / this.TREE_CHANGE_DELTA;
	},
	reconstructMethod : function(){
		this.render = this.render.bind(this);
	},
	createElements : function(){
		var treeLight = TREE_CREATOR.create(this.TREE_LUMINANCE.max),
			treeDarks = [],
			centerX = this.width / 2,
			centerY = this.height / 2,
			x = this.width * 1.6,
			y = this.height * 1.6,
			maxZ = this.INTERVAL_Z *  this.TREE_COUNT;
			
		for(var i = this.TREE_LUMINANCE.min, max = this.TREE_LUMINANCE.max; i <= max; i += this.TREE_CHANGE_DELTA){
			treeDarks.push(TREE_CREATOR.create(i));
		}
		for(var i = 0, length = this.TREE_COUNT; i < length; i++){
			var z = this.INTERVAL_Z * (length - i);
			this.trees.push(new TREE(treeLight, treeDarks, centerX, centerY, x, y, z, maxZ, this.FOCUS));
			this.trees.push(new TREE(treeLight, treeDarks, centerX, centerY, -x, y, z, maxZ, this.FOCUS));
			
			if(i > this.TREE_COUNT / 2){
				this.trees.push(new TREE(treeLight, treeDarks, centerX, centerY, x * 2, y, z + this.INTERVAL_Z / 2, maxZ / 2, this.FOCUS));
				this.trees.push(new TREE(treeLight, treeDarks, centerX, centerY, -x * 2, y, z + this.INTERVAL_Z / 2, maxZ / 2, this.FOCUS));
			}
		}
		for(var i = 0, length = this.LIGHT_COUNT; i < length; i++){
			this.lights.push(new LIGHT(this.width, this.height, centerX, centerY, maxZ, this.FOCUS));
		}
		this.shadow = SHADOW.init(this.width, this.height);
	},
	render : function(){
		requestAnimationFrame(this.render);
		
		this.context.fillStyle = this.backgroundDark;
		this.context.fillRect(0, 0, this.width, this.height);
		
		for(var i = 0, length = this.trees.length, index = this.treeIndex / this.TREE_CHANGE_COUNT | 0; i < length; i++){
			this.trees[i].render(this.context, false, index);
		}
		this.shadow.render(this.context);
		this.context.save();
		this.context.beginPath();
		
		for(var i = 0, length = this.lights.length; i < length; i++){
			this.lights[i].render(this.context);
		}
		this.context.clip();
		this.context.fillStyle = this.backgroundLight;
		this.context.fillRect(0, 0, this.width, this.height);
		
		for(var i = 0, length = this.trees.length; i < length; i++){
			this.trees[i].render(this.context, true);
		}
		this.shadow.render(this.context);
		this.context.globalCompositeOperation = 'lighter';
		
		var backgroundCover = this.context.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.distance),
			hue = 180 + 90 * Math.sin(this.theta);
			
		backgroundCover.addColorStop(0, 'hsl(' + hue + ', 80%, 10%)');
		backgroundCover.addColorStop(1, 'hsl(' + hue + ', 80%, 40%)');
		this.context.fillStyle = backgroundCover;
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.restore();
		this.changeTreeIndex();
		
		this.theta += this.DELTA_THETA;
		this.hue %= Math.PI * 2;
	},
	changeTreeIndex : function(){
		if(this.orderAsc){
			if(++this.treeIndex == this.maxLuminaceCount){
				this.treeIndex--;
				this.orderAsc = false;
			}
		}else{
			if(--this.treeIndex == 0){
				this.treeIndex++;
				this.orderAsc = true;
			}
		}
	}
};
var TREE_CREATOR = {
	WIDTH : 120,
	HEIGHT : 200,
	TRUNK_RATE : 0.8,
	BRANCH_RADIAN : Math.PI / 6,
	BRANCH_RATE : 0.55,
	BRANCH_LEVEL : 8,
	COLOR : 'hsl(120, 80%, %luminance%)',
	
	create : function(luminance){
		this.setParameters(luminance);
		this.drawTree(this.WIDTH / 2, this.HEIGHT, Math.PI / 2, this.HEIGHT / 4, 3, 0);
		return {canvas : this.canvas, x : -this.WIDTH / 2, y : -this.HEIGHT};
	},
	setParameters : function(luminance){
		this.canvas = $('<canvas />').attr({width : this.WIDTH, height : this.HEIGHT}).get(0);
		this.context = this.canvas.getContext('2d');
		this.context.strokeStyle = this.COLOR.replace('%luminance', luminance);
	},
	drawTree : function(x, y, radian, length, width, level){
		if (level > this.BRANCH_LEVEL) {
			return;
		}
		var sin = length * Math.sin(radian),
			cos = length * Math.cos(radian);
			
		this.drawTree(x + cos * this.TRUNK_RATE, y - sin * this.TRUNK_RATE, radian, length * this.TRUNK_RATE, width * this.TRUNK_RATE, level + 1);
		
		for(var i = -1; i <= 1; i += 2){
			this.drawTree(x + cos * this.BRANCH_RATE, y - sin * this.BRANCH_RATE, radian + this.BRANCH_RADIAN * i, length * this.BRANCH_RATE, width * this.BRANCH_RATE, level + 1);
		}
		this.context.lineWidth = width;
		this.context.beginPath();
		this.context.moveTo(x, y);
		this.context.lineTo(x + length*Math.cos(radian), y - length*Math.sin(radian));
		this.context.stroke();
	}
};
var TREE = function(treeLight, treeDarks, centerX, centerY, x, y, z, maxZ, focus){
	this.treeLight = treeLight;
	this.treeDarks = treeDarks;
	this.centerX = centerX;
	this.centerY = centerY;
	this.x = x;
	this.y = y;
	this.z = z;
	this.maxZ = maxZ;
	this.focus = focus;
};
TREE.prototype = {
	MAGNIFICATION : 10,
	
	render : function(context, isLight, index){
		var tree = isLight ? this.treeLight : this.treeDarks[index],
			rate = this.focus / (this.focus + this.z),
			x = this.centerX + this.x * rate,
			y = this.centerY + this.y * rate;
			
		rate *= this.MAGNIFICATION;
		
		context.save();
		context.translate(x, y);
		context.scale(rate, rate);
		context.drawImage(tree.canvas, tree.x, tree.y);
		context.restore();
		
		if(--this.z < 0){
			this.z = this.maxZ;
		}
	}
};
var LIGHT = function(width, height, centerX, centerY, maxZ, focus){
	this.width = width;
	this.height = height;
	this.centerX = centerX;
	this.centerY = centerY;
	this.maxZ = maxZ;
	this.focus = focus;
	this.init();
};
LIGHT.prototype = {
	VELOCITY_RANGE : {min : -3, max : 3},
	MAX_RADIUS : 12,
	
	init : function(){
		this.x = this.getRandomValue({min : -this.width * 2, max : this.width * 2});
		this.y = this.getRandomValue({min : -this.height, max : this.height});
		this.z = this.getRandomValue({min : 0, max : this.maxZ});
		this.vx = this.getRandomValue(this.VELOCITY_RANGE);
		this.vy = this.getRandomValue(this.VELOCITY_RANGE);
		this.rate = 1;
	},
	getRandomValue : function(range){
		return range.min + (range.max - range.min) * Math.random();
	},
	render : function(context){
		var rate = this.focus / (this.focus + this.z),
			x = this.centerX + this.x * rate,
			y = this.centerY - this.y * rate;
		
		context.moveTo(x, y);
		context.arc(x, y, this.MAX_RADIUS * rate * this.rate, 0, Math.PI * 2, false);
		
		if(--this.z < -this.focus || x < 0 || x > this.width || y < 0 || y > this.height){
			this.init();
			this.rate = 0;
		}
		this.x += this.vx * rate;
		this.y += this.vy * rate;
		
		if(this.rate >= 1){
			return;
		}
		this.rate += 0.01;
	}
};
var SHADOW = {
	SHAKE_INTERVAL : Math.PI / 120,
	COLOR : 'rgba(0, 0, 0, 0.3)',
	
	init : function(width, height){
		this.width = width;
		this.height = height;
		this.theta = 0;
		return this;
	},
	render : function(context){
		context.save();
		context.fillStyle = this.COLOR;
		context.translate(this.width / 2, this.height);
		context.scale(0.6, 1.2);
		context.rotate(Math.PI / 60 * Math.sin(this.theta));
		
		context.beginPath();
		context.arc(0, -108, 8, 0, Math.PI * 2, false);
		context.fill();
		
		context.beginPath();
		context.moveTo(5, -100);
		context.bezierCurveTo(40, -100, 40, -70, 30, -40);
		context.lineTo(25, -40);
		context.lineTo(25, 5);
		context.lineTo(5, 5);
		context.lineTo(5, -40);
		context.lineTo(-5, -40);
		context.lineTo(-5, 5);
		context.lineTo(-25, 5);
		context.lineTo(-25, -40);
		context.lineTo(-30, -40);
		context.bezierCurveTo(-40, -70, -40, -100, -5, -100);
		context.fill();
		context.restore();
		
		this.theta += this.SHAKE_INTERVAL;
		this.theta %= Math.PI * 2;
	}
};
$(function(){
	RENDERER.init();
});