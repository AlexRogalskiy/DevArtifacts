var RENDERER = {
	GRAVITY : 0.08,
	BASE_RATE : 0.6,
	OFFSET_RATE : 1 / 50,
	PARTICLE_COUNT : 30,
	
	init : function(){
		this.setParameters();
		this.setup();
		this.reconstructMethods();
		this.bindEvent();
		this.render();
	},
	setParameters : function(){
		this.$window = $(window);
		this.$container = $('#jsi-fountain-container');
		this.$canvas = $('<canvas />');
		this.context = this.$canvas.appendTo(this.$container).get(0).getContext('2d');
		this.particles = [];
		this.fountains = [];
		this.resizeIds = [];
	},
	setup : function(){
		this.particles.length = 0;
		this.fountains.length = 0;
		this.resizeIds.length = 0;
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.$canvas.attr({width : this.width, height : this.height});
		this.velocity = 1;
		
		while(true){
			var distance = 0,
				velocity = this.velocity;
				
			while(velocity >= 0){
				velocity -= this.GRAVITY;
				distance += velocity;
			}
			if(distance > Math.min(this.height * (this.BASE_RATE - this.OFFSET_RATE), 500)){
				this.velocity -= 0.2;
				break;
			}
			this.velocity += 0.2;
		}
		this.gradient = this.context.createLinearGradient(0, this.height * this.BASE_RATE, 0, this.height);
		this.gradient.addColorStop(0, 'hsla(210, 80%, 5%, 0.5)');
		this.gradient.addColorStop(0.1, 'hsla(210, 80%, 5%, 0.8)');
		this.gradient.addColorStop(1, 'hsla(210, 80%, 5%, 0.9)');
		this.createElements();
	},
	createElements : function(){
		for(var i = 0, count = this.PARTICLE_COUNT * this.width / 500  * this.height / 500; i < count; i++){
			this.particles.push(new PARTICLE(this));
		}
		for(var i = -2; i <= 2; i++){
			this.fountains.push(new FOUNTAIN(this, this.width / 2 + i * Math.max(250, this.width / 5), this.height * (this.BASE_RATE - this.OFFSET_RATE), i));
		}
	},
	watchWindowSize : function(){
		while(this.resizeIds.length > 0){
			clearTimeout(this.resizeIds.pop());
		}
		this.tmpWidth = this.$window.width();
		this.tmpHeight = this.$window.height();
		this.resizeIds.push(setTimeout(this.jdugeToStopResize, this.RESIZE_INTERVAL));
	},
	jdugeToStopResize : function(){
		var width = this.$window.width(),
			height = this.$window.height(),
			stopped = (width == this.tmpWidth && height == this.tmpHeight);
			
		this.tmpWidth = width;
		this.tmpHeight = height;
		
		if(stopped){
			this.setup();
		}
	},
	reconstructMethods : function(){
		this.watchWindowSize = this.watchWindowSize.bind(this);
		this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
		this.render = this.render.bind(this);
	},
	bindEvent : function(){
		this.$window.on('resize', this.watchWindowSize);
	},
	getRandomValue : function(min, max){
		return min + (max - min) * Math.random();
	},
	render : function(){
		requestAnimationFrame(this.render);
		this.context.fillStyle = 'hsla(0, 0%, 0%, 0.3)';
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.save();
		this.context.globalCompositeOperation = 'lighter';
		
		for(var i = 0, count = this.particles.length; i < count; i++){
			this.particles[i].render(this.context);
		}
		for(var i = 0, count = this.fountains.length; i < count; i++){
			this.fountains[i].render(this.context);
		}
		this.context.restore();
		this.context.save();
		this.context.translate(0, this.height * this.BASE_RATE);
		this.context.scale(1, -(1 - this.BASE_RATE) / this.BASE_RATE);
		this.context.drawImage(this.$canvas.get(0), 0, 0, this.width, this.height * this.BASE_RATE, 0,  -this.height * this.BASE_RATE, this.width, this.height * this.BASE_RATE);
		this.context.restore();
		this.context.fillStyle = this.gradient;
		this.context.fillRect(0, this.height * this.BASE_RATE, this.width, this.height * (1 - this.BASE_RATE));
	}
};
var PARTICLE = function(renderer){
	this.renderer = renderer;
	this.init();
};
PARTICLE.prototype = {
	THRESHOLD : 10,
	
	init : function(){
		this.x = this.renderer.getRandomValue(-this.THRESHOLD, this.renderer.width + this.THRESHOLD);
		this.y = this.renderer.getRandomValue(-this.THRESHOLD, this.renderer.height * this.renderer.BASE_RATE + this.THRESHOLD);
		this.vx = this.renderer.getRandomValue(-0.3, 0.3);
		this.vy = this.renderer.getRandomValue(-0.3, 0.3);
		this.theta = this.renderer.getRandomValue(0, Math.PI * 2);
		this.deltaTheta = this.renderer.getRandomValue(Math.PI / 300, Math.PI / 100);
	},
	getColor : function(){
		var baseIndex = -1,
			fountains = this.renderer.fountains,
			hue = 0;
			
		for(var i = 0, count = fountains.length; i < count; i++){
			if(this.x < fountains[i].x){
				break;
			}
			baseIndex = i;
		}
		if(baseIndex == -1){
			hue = fountains[0].hue;
		}else if(baseIndex == fountains.length - 1){
			hue = fountains[fountains.length - 1].hue;
		}else{
			var dx1 = this.x - fountains[baseIndex].x,
				dx2 = fountains[baseIndex + 1].x - this.x;
			hue = fountains[baseIndex].hue * (dx2 / (dx1 + dx2)) + fountains[baseIndex + 1].hue * (dx1 / (dx1 + dx2));
		}
		return 'hsl(' + hue + ', 60%, ' + (15 * (1 + Math.sin(this.theta))) + '%)';
	},
	render : function(context){
		context.save();
		context.fillStyle = this.getColor();
		context.beginPath();
		context.arc(this.x, this.y, 1, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		this.x += this.vx;
		this.y += this.vy;
		this.theta += this.deltaTheta;
		this.theta %= Math.PI * 2;
		
		if(this.x < -this.THRESHOLD && this.vx < 0 || this.x > this.renderer.width + this.THRESHOLD && this.vx > 0){
			this.vx *= -1;
		}
		if(this.y < -this.THRESHOLD && this.vy < 0 || this.y > this.renderer.height * this.renderer.BASE_RATE + this.THRESHOLD && this.vy > 0){
			this.vy *= -1;
		}
	}
};
var FOUNTAIN = function(renderer, x, y, index){
	this.renderer = renderer;
	this.x = x;
	this.y = y;
	this.index = index;
	this.init();
};
FOUNTAIN.prototype = {
	init : function(){
		this.waterLines = [];
		this.hue = 60;
		this.destinationHue = this.hue + 72 * this.index;
		this.waitCount = Math.abs(this.index) * 100;
		this.count = 0;
		this.theta = 0;
		this.status = 0;
	},
	controlStatus : function(){
		switch(this.status){
		case 0:
			if(++this.count >= this.waitCount){
				this.status = 1;
			}
			break;
		case 1:
			if(++this.count >= 300){
				this.status = 2;
				this.count = 0;
			}
			break;
		case 2:
			this.hue += this.index;
			
			if(this.hue == this.destinationHue){
				this.status = 3;
			}
			break;
		case 3:
			if(++this.count == 300){
				this.status = 4;
				this.count = 0;
			}
			break;
		case 4:
			this.theta += Math.PI / 50;
			this.theta %= Math.PI * 2;
			
			if(this.count++ == 25){
				this.status = 3;
			}
		}
		return this.status > 0;
	},
	render : function(context){
		var hue = this.hue + Math.sin(this.theta) * 36;
		context.save();
		context.fillStyle = 'hsl(' + hue + ', 70%, 30%)';
		context.translate(this.x, this.y);
		context.scale(1, 0.3);
		context.beginPath();
		context.arc(0, 0, 10, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		if(!this.controlStatus()){
			return;
		}
		context.save();
		context.translate(this.x, this.y);
		
		for(var i = this.waterLines.length - 1; i >= 0; i--){
			if(!this.waterLines[i].render(context, hue)){
				this.waterLines.splice(i, 1);
			}
		}
		context.restore();
		this.waterLines.push(new WATER_LINE(this.renderer));
	}
};
var WATER_LINE = function(renderer){
	this.renderer = renderer;
	this.init();
};
WATER_LINE.prototype = {
	MAX_TRACES : 80,
	
	init : function(){
		var theta = this.renderer.getRandomValue(-Math.PI / 20, Math.PI / 20),
			rate = this.renderer.getRandomValue(0.8, 1);
		this.x = this.renderer.getRandomValue(-2, 2);
		this.y = 0;
		this.vx = this.renderer.velocity * Math.sin(theta) * rate;
		this.vy = -this.renderer.velocity * Math.cos(theta * this.renderer.getRandomValue(3, 6)) * rate;
		this.opacity = 1;
		this.luminance = 0;
		this.traces = [];
	},
	render : function(context, hue){
		this.traces.push({x : this.x, y : this.y});
		
		if(this.traces.length > this.MAX_TRACES){
			this.traces.shift();
		}
		context.save();
		context.strokeStyle = 'hsla(' + hue + ', 70%, ' + this.luminance + '%, ' + this.opacity + ')';
		context.beginPath();
		context.moveTo(this.traces[0].x, this.traces[0].y);
		
		for(var i = 1, count = this.traces.length; i < count; i++){
			context.lineTo(this.traces[i].x, this.traces[i].y);
		}
		context.stroke();
		context.restore();
		this.x += this.vx;
		this.y += this.vy;
		this.vy += this.renderer.GRAVITY;
		
		if(this.vy > 0){
			this.opacity -= 0.02;
		}
		if(this.luminance < 10){
			this.luminance += 0.1;
		}
		return this.opacity > 0;
	}
};
$(function(){
	RENDERER.init();
});