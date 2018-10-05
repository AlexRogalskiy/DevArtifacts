var RENDERER = {
	POWER : 10000,
	EDGE_OFFSET : 5,
	OFFSET_LIMIT : 50,
	GOLDFISH_COUNT : 15,
	
	init : function(){
		this.setParameters();
		this.reconstructMethods();
		this.createGoldfishes();
		this.bindEvent();
		this.render();
	},
	setParameters : function(){
		this.$window = $(window);
		this.$container = $('#jsi-ripple-container');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.context = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		this.goldfishes = [];
		this.currentHeights = new Array(this.width * this.height).fill(0);
		this.nextHeights = new Array(this.width * this.height).fill(0);
		this.x = 0;
		this.y = 0;
		this.distance = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
	},
	reconstructMethods : function(){
		this.watchMouse = this.watchMouse.bind(this);
		this.render = this.render.bind(this);
	},
	createGoldfishes : function(){
		for(var i = 0, count = this.GOLDFISH_COUNT; i < count; i++){
			this.goldfishes.push(new GOLDFISH(this));
		}
	},
	bindEvent : function(){
		this.$container.on('click mousemove', this.watchMouse);
	},
	watchMouse : function(event){
		var offset = this.$container.offset();
		this.x = event.clientX - offset.left + this.$window.scrollLeft();
		this.y = event.clientY - offset.top + this.$window.scrollTop();
		this.propagateRipple(Math.round(this.x), Math.round(this.y));
	},
	propagateRipple : function(x, y){
		if(x <= this.EDGE_OFFSET || x >= this.width - this.EDGE_OFFSET || y <= this.EDGE_OFFSET || y >= this.height - this.EDGE_OFFSET){
			return;
		}
		var index = Math.round(x + this.width * y);
		this.currentHeights[index] += this.POWER;
		this.currentHeights[index - this.width] -= this.POWER;
	},
	processData : function(){
		var image = this.context.getImageData(0, 0, this.width, this.height),
			data = image.data,
			width = this.width,
			currentHeights = this.currentHeights,
			nextHeights = this.nextHeights;
			
		for(var y = 1, lengthy = this.height - 1; y < lengthy; y++){
			for(var x = 1, lengthx = width - 1; x < lengthx; x++){
				var index = x + width * y;
				currentHeights[index] = (currentHeights[index] + currentHeights[index - 1] + currentHeights[index + 1] + currentHeights[index - width] + currentHeights[index + width]) / 5;
			}
		}
		for(var y = 1, lengthy = this.height - 1; y < lengthy; y++){
			for(var x = 1, lengthx = width - 1; x < lengthx; x++){
				var baseIndex = x + width * y,
					index = baseIndex * 4,
					height = (currentHeights[baseIndex - 1] + currentHeights[baseIndex + 1] + currentHeights[baseIndex - width] + currentHeights[baseIndex + width]) / 2 - nextHeights[baseIndex];
					
				nextHeights[baseIndex] = height;
				height = height < -this.OFFSET_LIMIT ? -this.OFFSET_LIMIT : (height > this.OFFSET_LIMIT ? this.OFFSET_LIMIT : height);
				
				for(var i = 0; i < 3; i++){
					data[index + i] += height;
				}
			}
		}
		this.context.putImageData(image, 0, 0);
		
		var tmp = this.currentHeights;
		this.currentHeights = this.nextHeights;
		this.nextHeights = tmp;
	},
	render : function(){
		requestAnimationFrame(this.render);
		
		var gradient = this.context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.distance);
		gradient.addColorStop(0, 'hsl(200, 60%, 60%)');
		gradient.addColorStop(1, 'hsl(220, 60%, 40%)');
		this.context.fillStyle = gradient;
		this.context.fillRect(0, 0, this.width, this.height);
		
		for(var i = 0, count = this.goldfishes.length; i < count; i++){
			this.goldfishes[i].render(this.context);
		}
		this.processData();
	}
};
var GOLDFISH = function(renderer){
	this.renderer = renderer;
	this.init();
};
GOLDFISH.prototype = {
	OFFSET : 30,
	RIPPLE_INTERVAL : 20,
	VELOCITY_LIMIT : 0.3,
	
	init : function(toRandomize){
		this.x = this.getRandomValue(0, this.renderer.width);
		this.y = this.getRandomValue(0, this.renderer.height);
		this.radius = this.getRandomValue(0, Math.PI * 2);
		this.velocity = this.getRandomValue(1, 2);
		this.theta = 0;
		this.vx = this.velocity * Math.sin(this.radius);
		this.vy = -this.velocity * Math.cos(this.radius);
		this.waitCount = this.getRandomValue(0, 100) | 0;
		this.rippleInterval = this.RIPPLE_INTERVAL;
		this.hue = this.getRandomValue(0, 30) | 0;
		
		this.gradient = this.renderer.context.createLinearGradient(-15, 0, 15, 0);
		this.gradient.addColorStop(0, 'hsl(' + (this.hue + 20) + ', 50%, 80%)');
		this.gradient.addColorStop(0.5, 'hsl(' + this.hue + ', 70%, 50%)');
		this.gradient.addColorStop(1, 'hsl(' + (this.hue + 20) + ', 50%, 80%)');
	},
	getRandomValue : function(min, max){
		return min + (max - min) * Math.random();
	},
	render : function(context){
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.radius);
		context.fillStyle = 'hsla(' + (this.hue + 20) + ', 70%, 50%, 0.8)';
		
		for(var i = -1; i <= 1; i += 2){
			context.save();
			context.translate(0, 10);
			context.rotate(Math.PI / 12 * Math.sin(this.theta * 2) * i);
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(12 * i, 4);
			context.lineTo(10 * i, 10);
			context.lineTo(0 * i, 4);
			context.fill();
			context.restore();
		}
		context.save();
		context.translate(0, 25);
		context.rotate(Math.PI / 12 * Math.sin(this.theta * 8));
		context.beginPath();
		context.moveTo(0, 0);
		context.quadraticCurveTo(5, 5, 3, 15);
		context.lineTo(0, 8);
		context.lineTo(-3, 15);
		context.quadraticCurveTo(-5, 5, 0, 0);
		context.fill();
		context.restore();
		
		context.fillStyle = this.gradient;
		context.beginPath();
		context.moveTo(0, 30);
		context.quadraticCurveTo(-10, 10, 0, 0);
		context.quadraticCurveTo(10, 10, 0, 30);
		context.fill();
		context.restore();
		
		if(this.waitCount == 0){
			var rate = Math.max(this.VELOCITY_LIMIT, Math.sin(this.theta));
			this.x += this.vx * rate;
			this.y += this.vy * rate;
			this.theta += Math.PI / 100;
			
			if(this.theta >= Math.PI){
				this.theta %= Math.PI;
				this.waitCount = this.getRandomValue(0, 100) | 0;
			}
			if(--this.rippleInterval == 0){
				this.rippleInterval = this.RIPPLE_INTERVAL;
				
				if(this.theta >= Math.PI * 3 / 8 && this.theta <= Math.PI * 5 / 8){
					this.renderer.propagateRipple(Math.round(this.x), Math.round(this.y));
				}
			}
		}else{
			this.x += this.vx * this.VELOCITY_LIMIT;
			this.y += this.vy * this.VELOCITY_LIMIT;
			this.waitCount--;
		}
		if(this.x < -this.OFFSET && this.vx < 0 || this.x > this.renderer.width + this.OFFSET && this.vx > 0 || this.y < -this.OFFSET && this.vy < 0|| this.y > this.renderer.height + this.OFFSET && this.vy > 0){
			this.radius += Math.PI + this.getRandomValue(-Math.PI / 4, Math.PI / 4);
			this.radius %= Math.PI * 2;
			this.vx = this.velocity * Math.sin(this.radius);
			this.vy = -this.velocity * Math.cos(this.radius);
		}
	}
};
$(function(){
	RENDERER.init();
});