var RENDERER = {
	RESIZE_INTERVAL : 100,
	ACCELARATION_INTERVAL : 30,
	PARTICLE_INTERVAL : 60,
	FRICTION : 0.98,
	ACCELARATION_COEFFICIENT : 0.05,
	MIN_SCALE : 0.7,
	
	init : function(){
		this.setParameters();
		this.reconstructMethods();
		this.setup();
		this.bindEvent();
		this.render();
	},
	setParameters : function(){
		this.$window = $(window);
		this.$container = $('#jsi-floor-container');
		this.$canvas = $('<canvas />');
		this.context = this.$canvas.appendTo(this.$container).get(0).getContext('2d');
		this.particles = [];
		this.resizeIds = [];
		this.accelarationIds = [];
	},
	setup : function(){
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.accelerationEnabled = false;
		this.particles.length = 0;
		this.resizeIds.length = 0;
		this.accelarationIds.length = 0;
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.countX = Math.floor(this.width / this.PARTICLE_INTERVAL) + 3;
		this.countY = Math.floor(this.height / this.PARTICLE_INTERVAL) + 3;
		this.$canvas.attr({width : this.width, height : this.height});
		
		this.createParticles();
	},
	createParticles : function(){
		for(var i = 0, countX = this.countX; i < countX; i++){
			for(var j = 0, countY = this.countY; j < countY; j++){
				this.particles.push(new PARTICLE(this, this.PARTICLE_INTERVAL * (i - 1), this.PARTICLE_INTERVAL * (j - 1)));
			}
		}
	},
	reconstructMethods : function(){
		this.watchWindowSize = this.watchWindowSize.bind(this);
		this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
		this.enableAccel = this.enableAccel.bind(this);
		this.render = this.render.bind(this);
	},
	watchWindowSize : function(){
		this.clearTimer(this.resizeIds);
		this.tmpWidth = this.$window.width();
		this.tmpHeight = this.$window.height();
		this.resizeIds.push(setTimeout(this.jdugeToStopResize, this.RESIZE_INTERVAL));
	},
	clearTimer : function(ids){
		while(ids.length > 0){
			clearTimeout(ids.pop());
		}
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
	enableAccel : function(event){
		this.clearTimer(this.accelarationIds);
		
		var offset = this.$container.offset(),
			x = event.clientX - offset.left + this.$window.scrollLeft(),
			y = event.clientY - offset.top + this.$window.scrollTop();
			
		if(!this.accelerationEnabled){
			this.x = x;
			this.y = y;
			this.ax = 0;
			this.ay = 0;
			this.accelerationEnabled = true;
			return;
		}
		this.accelerationEnabled = true;
		
		this.ax = (this.x - x) * this.ACCELARATION_COEFFICIENT;
		this.ay = (this.y - y) * this.ACCELARATION_COEFFICIENT;
		this.x = x;
		this.y = y;
		
		this.accelarationIds.push(setTimeout(this.disableAccel.bind(this, false), this.ACCELARATION_INTERVAL));
	},
	disableAccel : function(toResetPosition){
		this.clearTimer(this.accelarationIds);
		
		if(toResetPosition){
			this.x = 0;
			this.y = 0;
		}
		this.ax = 0;
		this.ay = 0;
		this.accelerationEnabled = false;
	},
	bindEvent : function(){
		this.$window.on('resize', this.watchWindowSize);
		this.$container.on('mousemove', this.enableAccel);
		this.$container.on('mouseout', this.disableAccel.bind(this, true));
	},
	render : function(){
		requestAnimationFrame(this.render);
		this.context.fillStyle = 'hsla(0, 0%, 0%, 0.5)';
		this.context.fillRect(0, 0, this.width, this.height);
		
		var theta = Math.atan2(this.vy, this.vx),
			scale = Math.max(this.MIN_SCALE, 1 - Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 30);
			
		this.context.save();
		this.context.globalCompositeOperation = 'lighter';
		
		for(var i = 0, count = this.particles.length; i < count; i++){
			this.particles[i].render(this.context, this.x, this.y, this.vx, this.vy, theta, scale);
		}
		this.context.restore();
		
		this.vx += this.ax;
		this.vy += this.ay;
		this.vx *= this.FRICTION;
		this.vy *= this.FRICTION;
	}
};
var PARTICLE = function(renderer, x, y){
	this.renderer = renderer;
	this.x = x;
	this.y = y;
	this.luminance = this.LUMIMANCE.MIN;
};
PARTICLE.prototype = {
	RADIUS : 15,
	LUMIMANCE : {
		MIN : 5,
		MAX : 50
	},
	render : function(context, x, y, vx, vy, theta, scale){
		var dx = this.x - x,
			dy = this.y - y;
			
		if(dx * dx + dy * dy <= this.renderer.PARTICLE_INTERVAL * this.renderer.PARTICLE_INTERVAL && x > 0 && y > 0){
			this.luminance = this.LUMIMANCE.MAX;
		}
		context.save();
		context.translate(this.x, this.y);
		context.rotate(theta);
		context.scale(2 - scale, scale);
		
		if(this.luminance > this.LUMIMANCE.MIN){
			context.shadowColor = 'hsl(210, 60%, ' + this.luminance + '%)';
			context.shadowBlur = 50;
		}
		context.fillStyle = 'hsl(210, 60%, ' + this.luminance + '%)';
		context.beginPath();
		context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
		context.fill();
		context.restore();
		
		this.x += vx;
		this.y += vy;
		
		if(this.luminance > this.LUMIMANCE.MIN){
			this.luminance--;
		}
		if(this.x < -this.RADIUS * 2 && vx < 0){
			this.luminance = this.LUMIMANCE.MIN;
			this.x += this.renderer.countX * this.renderer.PARTICLE_INTERVAL;
		}else if(this.x > this.renderer.width + this.RADIUS * 2 && vx > 0){
			this.luminance = this.LUMIMANCE.MIN;
			this.x -= this.renderer.countX * this.renderer.PARTICLE_INTERVAL;
		}
		if(this.y < -this.RADIUS * 2 && vy < 0){
			this.luminance = this.LUMIMANCE.MIN;
			this.y += this.renderer.countY * this.renderer.PARTICLE_INTERVAL;
		}else if(this.y > this.renderer.height + this.RADIUS * 2 && vy > 0){
			this.luminance = this.LUMIMANCE.MIN;
			this.y -= this.renderer.countY * this.renderer.PARTICLE_INTERVAL;
		}
	}
};
$(function(){
	RENDERER.init();
});