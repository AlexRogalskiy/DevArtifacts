var RENDERER = {
	AUXILIARY_LINE_COUMT : 16,
	MAX_ROTATION_ANGLE : Math.PI / 200,
	FIREWORK_INTERVAL : {min : 30, max : 100},
	
	init : function(){
		this.setParameters();
		this.setupData();
		this.reconstructMethod();
		this.bindEvent();
		this.render();
	},
	setParameters : function(){
		this.$document = $(document);
		this.$window = $(window);
		this.$container = $('#jsi-sphere-container');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.contextBackground =  $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		this.contextForeground =  $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		this.camera = CAMERA.init(this);
		this.angleX = this.MAX_ROTATION_ANGLE / 2;
		this.angleY = this.MAX_ROTATION_ANGLE / 2;
		this.points = [];
		this.fireworks = [];
		this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL) | 0;
		this.fireworkInterval = this.maxFireworkInterval;
		this.base = Math.min(this.width, this.height);
		this.scatterRadius = this.base * 3 / 2;
	},
	reconstructMethod : function(){
		this.render = this.render.bind(this);
		this.changeDepth = this.changeDepth.bind(this);
		this.changeAngle = this.changeAngle.bind(this);
	},
	getRandomValue : function(range){
		return range.min + (range.max - range.min) * Math.random();
	},
	bindEvent : function(){
		this.$document.on('onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll', this.changeDepth);
		this.$container.on('mousemove', this.changeAngle);
	},
	setupData : function(){
		for(var i = 1; i < this.AUXILIARY_LINE_COUMT; i++){
			for(var phi = 0, deltaPhi = Math.PI * 2 / (this.AUXILIARY_LINE_COUMT * 2 - Math.abs(this.AUXILIARY_LINE_COUMT * 2 - i * 4)); phi < Math.PI * 2; phi += deltaPhi){
				this.points.push(new POINT(this.camera, this.getAxis3D(Math.PI / this.AUXILIARY_LINE_COUMT * i, phi)));
			}
		}
	},
	changeDepth : function(event){
		event.preventDefault();
		this.camera.move(0, 0, (event.originalEvent.deltaY || -event.originalEvent.wheelDelta ||  event.originalEvent.detail) >= 0 ? 3 : -2);
	},
	changeAngle : function(event){
		var offset = this.$container.offset(),
			x = event.clientX - offset.left + this.$window.scrollLeft(),
			y = event.clientY - offset.top + this.$window.scrollTop();
		this.angleY = (this.width / 2 - x) / this.width * 2 * this.MAX_ROTATION_ANGLE;
		this.angleX = (this.height / 2 - y) / this.height * 2 * this.MAX_ROTATION_ANGLE;
	},
	getAxis3D : function(theta, phi){
		var cosTheta = Math.cos(theta),
			sinTheta = Math.sin(theta);
		return {
			x : this.scatterRadius * sinTheta * Math.cos(phi),
			y : this.scatterRadius * cosTheta,
			z : this.scatterRadius * sinTheta * Math.sin(phi)
		};
	},
	render : function(){
		requestAnimationFrame(this.render);
		this.contextForeground.clearRect(0, 0, this.width, this.height);
		this.contextBackground.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
		this.contextBackground.fillRect(0, 0, this.width, this.height);
		
		for(var i = 0, length = this.points.length; i < length; i++){
			this.points[i].rotateX(this.angleX);
			this.points[i].rotateY(this.angleY);
		}
		for(var i = 0, length = this.fireworks.length; i < length; i++){
			this.fireworks[i].rotateX(this.angleX);
			this.fireworks[i].rotateY(this.angleY);
		}
		this.points.sort(function(point1, point2){
			return point2.getAxis3D().z - point1.getAxis3D().z;
		});
		this.fireworks.sort(function(firework1, firework2){
			return firework2.getAxis3D().z - firework1.getAxis3D().z;
		});
		for(var i = this.points.length - 1; i >= 0; i--){
			this.points[i].render(this.contextForeground);
		}
		for(var i = this.fireworks.length - 1; i >= 0; i--){
			if(!this.fireworks[i].render(this.contextBackground)){
				this.fireworks.splice(i, 1);
			}
		}
		if(--this.fireworkInterval == 0){
			this.fireworks.push(new FIREWORK(this, this.camera));
			this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL) | 0;
			this.fireworkInterval = this.maxFireworkInterval;
		}
	}
};
var CAMERA = {
	INIT_AXIS : {X : 0, Y : 0, Z : -2300},
	MIN_Z : -3000,
	FOCUS_DISTANCE : 500,
	MAGNIFICATION : 50,
	OFFSET : 100,
	
	init : function(renderer){
		this.renderer = renderer;
		this.x = this.INIT_AXIS.X;
		this.y = this.INIT_AXIS.Y;
		this.z = this.INIT_AXIS.Z;
		return this;
	},
	move : function(deltaX, deltaY, deltaZ){
		this.x += deltaX;
		this.y += deltaY;
		this.z -= deltaZ * this.MAGNIFICATION;
		this.z = Math.min(this.z, -this.renderer.scatterRadius);
		this.z = Math.max(this.z, this.MIN_Z);
	},
	rotate : function(deltaX, deltaY, deltaZ){
		this.angle.x += deltaX;
		this.angle.y += deltaY;
		this.angle.z += deltaZ;
	},
	getCompensatedParameters : function(point){
		var denominator = point.z - this.z;
		
		if(denominator <= this.OFFSET){
			return null;
		}
		var scale = this.FOCUS_DISTANCE / denominator,
			luminance = Math.min(80, scale * 250),
			x = this.renderer.width / 2 + (point.x + this.x) * scale,
			y = this.renderer.height / 2 - (point.y + this.y) * scale,
			radius = point.RADIUS * scale;
		if(x + radius < 0 || x - radius > this.renderer.width || y + radius < 0 || y - radius > this.renderer.height){
			return null;
		}
		return {x : x, y : y, radius : radius, luminance : luminance, scale : scale};
	}
};
var BASE = function(methods){
	this.parameters = null;
	$.extend(this, methods);
};
BASE.prototype = {
	COLOR : 'hsl(%h, 80%, %l%)',
	
	rotateX : function(angle){
		var sin = Math.sin(angle),
			cos = Math.cos(angle),
			y = this.y * cos - this.z * sin,
			z = this.z * cos + this.y * sin;
		this.y = y;
		this.z = z;
	},
	rotateY : function(angle){
		var sin = Math.sin(angle),
			cos = Math.cos(angle),
			x = this.x * cos - this.z * sin,
			z = this.z * cos + this.x * sin;
		this.x = x;
		this.z = z;
	},
	rotateZ : function(angle){
		var sin = Math.sin(angle),
			cos = Math.cos(angle),
			x = this.x * cos - this.y * sin,
			y = this.y * cos + this.x * sin;
		this.x = x;
		this.y = y;
	},
	getAxis3D : function(){
		return {x : this.x, y : this.y, z : this.z};
	},
	getAxis2D : function(){
		this.parameters = this.camera.getCompensatedParameters(this);
		
		if(!this.parameters){
			return null;
		}
		this.parameters.color = this.COLOR.replace('%h', this.hue).replace('%l', this.parameters.luminance);
		return this.parameters;
	}
};
var POINT = function(camera, axis){
	this.camera = camera;
	this.x = axis.x;
	this.y = axis.y;
	this.z = axis.z;
};
POINT.prototype = new BASE({
	RADIUS : 7,
	hue : 180,
	
	render : function(context){
		var axis = this.getAxis2D();
		
		if(!axis){
			return;
		}
		context.save();
		context.translate(axis.x, axis.y);
		context.beginPath();
		context.fillStyle = axis.color;
		context.arc(0, 0, axis.radius, 0, Math.PI * 2, true);
		context.fill();
		context.restore();
	}
});
var FIREWORK = function(renderer, camera){
	this.renderer = renderer;
	this.camera = camera;
	this.init();
};
FIREWORK.prototype = new BASE({
	PARTICLE_COUNT : 300,
	DELTA_OPACITY : 0.01,
	RADIUS : 12,
	THRESHOLD : 30,
	DELTA_THETA : Math.PI / 10,
	GRAVITY : -Math.PI / 100000,
	VELOCITY : Math.PI / 160,
	
	init : function(){
		var axis = this.renderer.getAxis3D(Math.PI * Math.random(), Math.PI * 2 * Math.random());
		this.hue = 256 * Math.random() | 0;
		this.maxCount = this.renderer.getRandomValue({min : 150, max : 300});
		this.count = 0;
		this.x = axis.x;
		this.y = axis.y;
		this.z = axis.z;
		this.status = 0;
		this.theta = 0;
		this.waitCount = this.renderer.getRandomValue({min : 30, max : 60});
		this.opacity = 1;
		this.particles = [];
		var theta = this.renderer.getRandomValue({min : 0, max : Math.PI * 2});
		this.velocityX = this.VELOCITY * Math.cos(theta);
		this.velocityY = this.VELOCITY * Math.sin(theta);
	},
	render : function(context){
		switch(this.status){
		case 0:
			var axis = this.getAxis2D();
			
			if(axis){
				context.save();
				context.fillStyle = axis.color;
				context.globalAlpha = (this.maxCount - this.count) <= this.THRESHOLD ? Math.max(0, 1 - (this.THRESHOLD - this.maxCount + this.count) / this.THRESHOLD) : 1;
				context.translate(axis.x + Math.sin(this.theta) / 2, axis.y);
				this.rotateX(this.velocityX);
				this.rotateY(this.velocityY);
				context.beginPath();
				context.arc(0, 0, axis.radius, 0, Math.PI * 2, false);
				context.fill();
				context.restore();
			}
			if(this.count++ >= this.maxCount){
				this.status = 1;
			}
			this.theta += this.DELTA_THETA;
			this.theta %= Math.PI * 2;
			this.velocity += this.GRAVITY;
			return true;
		case 1:
			if(--this.waitCount <= 0){
				this.status = 2;
				
				for(var i = 0, length = this.PARTICLE_COUNT; i < length; i++){
					this.particles.push(new PARTICLE(this.camera, this.x, this.y, this.z, this.hue));
				}
			}
			return true;
		case 2:
			context.save();
			context.globalCompositeOperation = 'lighter';
			context.globalAlpha = this.opacity;
			
			for(var i = 0, length = this.particles.length; i < length; i++){
				this.particles[i].render(context);
			}
			context.restore();
			this.opacity -= this.DELTA_OPACITY;
			return this.opacity > 0;
		}
	}
});
var PARTICLE = function(camera, x, y, z, hue){
	this.camera = camera;
	this.x = x;
	this.y = y;
	this.z = z;
	this.hue = hue;
	this.init();
};
PARTICLE.prototype = new BASE({
	RADIUS : 5,
	GRAVITY : -0.98,
	FRICTION : 0.98,
	
	init : function(){
		var radian = Math.PI * 2 * Math.random(),
			velocity = this.getVelocity(),
			rate = Math.random();
		this.vx = velocity * Math.cos(radian) * rate;
		this.vy = velocity * Math.sin(radian) * rate;
		this.vz = this.getVelocity();
	},
	getVelocity : function(){
		return (1 - Math.pow(Math.random(), 6)) * 30;
	},
	render : function(context){
		var axis = this.getAxis2D();
		
		if(!axis){
			return;
		}
		context.beginPath();
		context.fillStyle = axis.color;
		context.arc(axis.x, axis.y, axis.radius, 0, Math.PI * 2, false);
		context.fill();
		this.x += this.vx * axis.scale;
		this.y += this.vy * axis.scale;
		this.z += this.vz * axis.scale;
		this.vy += this.GRAVITY * axis.scale;
		this.vx *= this.FRICTION;
		this.vy *= this.FRICTION;
		this.vz *= this.FRICTION;
	}
});
$(function(){
	RENDERER.init();
});