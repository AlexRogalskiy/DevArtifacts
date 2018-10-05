var RENDERER = {
	HUE_OFFSET : 30,
	HUE_DELTA : Math.PI / 500,
	THRESHOLD : 140,
	POWER : 0.8,
	
	init : function(){
		this.setParameters();
		this.calculateIndices();
		this.reconstructMethods();
		this.render();
	},
	setParameters : function(){
		var $container = $('#jsi-wormhole-container');
		this.width = $container.width();
		this.height = $container.height();
		this.context = $('<canvas />').attr({width : this.width, height : this.height}).appendTo($container).get(0).getContext('2d');
		this.distance = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / 4;
		this.swirls = [];
		this.indices = [];
		this.theta = 0;
	},
	calculateIndices : function(){
		var width = this.THRESHOLD * 2 + 1,
			cx = this.THRESHOLD,
			cy = this.THRESHOLD,
			rate = Math.PI / 180,
			maxDistance = this.THRESHOLD * this.THRESHOLD,
			indices = this.indices;
			
		for(var dx = -cx; dx <= cx; dx++){
			for(var dy = -cy; dy <= cy; dy++){
				var x = cx + dx,
					y = cy + dy,
					distance = dx * dx + dy * dy;
					
				if(distance < maxDistance){
					var coefficient = 1 - distance / maxDistance,
						theta = (90 + coefficient * coefficient * 180 * this.POWER) * rate,
						sin = Math.sin(theta),
						cos = Math.cos(theta);
						
					x = (cx + dx * sin - dy * cos) | 0;
					y = (cy + dx * cos + dy * sin) | 0;
				}
				indices.push((x + y * width) << 2);
			}
		}
		this.swirls.push(new SWIRL(this, this.width * 2 / 7, this.height * 2 / 7, false));
		this.swirls.push(new SWIRL(this, this.width * 5 / 7, this.height * 5 / 7, true));
	},
	reconstructMethods : function(){
		this.render = this.render.bind(this);
	},
	render : function(){
		requestAnimationFrame(this.render);
		
		var hueOffset = this.HUE_OFFSET * Math.sin(this.theta),
			gradient = this.context.createLinearGradient(0, 0, this.width, this.height);
			
		gradient.addColorStop(0, 'hsl(' + hueOffset + ', 100%, 20%)');
		gradient.addColorStop(1, 'hsl(' + (180 + hueOffset) + ', 100%, 20%)');
		
		this.context.fillStyle = gradient;
		this.context.fillRect(0, 0, this.width, this.height);
		
		for(var i = 0, count = this.swirls.length; i < count; i++){
			this.swirls[i].render(this.context, this.theta);
		}
		this.theta += this.HUE_DELTA;
		this.theta %= Math.PI * 2;
	}
};
var SWIRL = function(renderer, x, y, release){
	this.renderer = renderer;
	this.x = x;
	this.y = y;
	this.release = release;
	this.init();
};
SWIRL.prototype = {
	PARTICLE_COUNT : 400,
	
	init : function(){
		this.particles = [];
		this.base = this.release ? 180 : 0;
		
		for(var i = this.PARTICLE_COUNT - 1; i >= 0; i--){
			this.particles.push(new PARTICLE(this.renderer, this));
		}
		this.width = this.renderer.THRESHOLD * 2 + 1;
		this.destination = this.renderer.context.createImageData(this.width, this.width);
		
		var destinationData = this.destination.data;
		
		for(var indices = this.renderer.indices, i = indices.length - 1; i >= 0; i--){
			destinationData[(i << 2) + 3] = 255;
		}
	},
	createSwirl : function(context){
		var sourceData = context.getImageData(this.x - this.renderer.THRESHOLD, this.y - this.renderer.THRESHOLD, this.width, this.width).data,
			destinationData = this.destination.data;
			
		for(var indices = this.renderer.indices, i = indices.length - 1; i >= 0; i--){
			var sourceIndex = indices[i],
				destinationIndex = i << 2;
				
			destinationData[destinationIndex] = sourceData[sourceIndex];
			destinationData[destinationIndex + 1] = sourceData[sourceIndex + 1];
			destinationData[destinationIndex + 2] = sourceData[sourceIndex + 2];
		}
		context.putImageData(this.destination, this.x - this.renderer.THRESHOLD, this.y - this.renderer.THRESHOLD);
	},
	render : function(context, theta){
		var hue = this.base + this.renderer.HUE_OFFSET * Math.sin(theta);
		context.save();
		context.globalCompositeOperation = 'lighter';
		
		for(var particles = this.particles, i = particles.length - 1; i >= 0; i--){
			particles[i].render(context, hue);
		}
		context.restore();
		this.createSwirl(context);
	}
};
var PARTICLE = function(renderer, swirl){
	this.renderer = renderer;
	this.swirl = swirl;
	this.init(false);
};
PARTICLE.prototype = {
	RADIUS : 20,
	THRESHOLD : 3,
	
	init : function(toReset){
		var theta = this.getRandomValue(0, Math.PI * 2),
			sin = Math.sin(theta),
			cos = Math.cos(theta),
			velocity = this.getRandomValue(1, 2),
			position = this.swirl.release ? (toReset ? this.getRandomValue(0, this.THRESHOLD) : this.getRandomValue(0, this.renderer.distance)) : -(toReset ? (this.renderer.distance + this.RADIUS) : this.getRandomValue(0, this.renderer.distance * 1.5));
			
		this.x = (position * cos + this.swirl.x) | 0;
		this.y = (position * sin + this.swirl.y) | 0;
		this.vx = velocity * cos;
		this.vy = velocity * sin;
	},
	getRandomValue : function(min, max){
		return min + (max - min) * Math.random();
	},
	render : function(context, hue){
		var dx = this.swirl.x - this.x,
			dy = this.swirl.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			rate = (this.renderer.distance - distance) / this.renderer.distance;
			
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = 'hsl(' + hue + ', 80%, ' + 3 * rate * rate + '%)';
		context.beginPath();
		context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		this.x += this.vx;
		this.y += this.vy;
		
		if(this.swirl.release && distance > this.renderer.distance || !this.swirl.release && distance < this.THRESHOLD){
			this.init(true);
		}
	}
};
$(function(){
	RENDERER.init();
});