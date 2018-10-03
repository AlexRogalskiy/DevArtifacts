class AttractButton {
	
	constructor() {
		this.ui = this.getUi();
		this.bind();
		this.circle = {
			x: null,
			xInitValue: null,
			xTarget: null,
			y: null,
			yInitValue: null,
			yTarget: null,
			maxRadius: 45,
			initRadius: 35,
			radius: 35,
			radiusTarget: 35
		}
		
		this.strength = 40;
		this.isHovering = false;
		
		this.onResize();
		this.ctx = this.ui.canvas.getContext('2d');
		TweenMax.ticker.addEventListener('tick', this.update);
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousemove', this.onMouseMove);
	}
	
	getUi() {
		return {
			'canvas' : document.querySelector('canvas')
		}
	}
	
	bind () {
		this.update = this.update.bind(this);
		this.onResize = this.onResize.bind(this);	
		this.onMouseMove = this.onMouseMove.bind(this);
	}
	
	onMouseMove(e) {
		
		let x = e.clientX;
		let y = e.clientY;
		
		if (!this.pointInCircle(this.circle.xInitValue, this.circle.yInitValue, x, y, this.circle.radius + this.strength)) {
			this.ui.canvas.classList.remove('is-grabbing');
			this.strength = 120;
			this.mouseValue = {
					x: this.circle.xInitValue,
					y: this.circle.yInitValue
			}
			this.circle.radiusTarget = this.circle.initRadius
		} else {
			this.ui.canvas.classList.add('is-grabbing');
			this.strength = 150;
			const distance = Math.hypot(x - this.circle.xInitValue, y - this.circle.yInitValue);
			let ratio =  1 - (distance / (this.circle.radius + this.strength));
			ratio = this.changeRange(ratio, 1, 0, 1, 0.3);
			this.circle.radiusTarget = this.circle.maxRadius
			let newXvalue = this.circle.xInitValue - (this.circle.xInitValue - x) * ratio;
			let newYvalue = this.circle.yInitValue - (this.circle.yInitValue - y) * ratio;
			this.mouseValue = {
					x: newXvalue,
					y: newYvalue
			}
		}

	}
	
	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.ui.canvas.width = this.width;
		this.ui.canvas.height = this.height;
		this.circle.xInitValue = this.circle.x = this.circle.xTarget = this.width / 2;
		this.circle.yInitValue = this.circle.y = this.circle.yTarget = this.height / 2;
	}
	
	update() {
		this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.ctx.beginPath();

		if (this.mouseValue) {
			this.circle.xTarget = this.mouseValue.x
			this.circle.yTarget = this.mouseValue.y
		}

		this.circle.x += (this.circle.xTarget - this.circle.x) * 0.1;
		this.circle.y += (this.circle.yTarget - this.circle.y) * 0.1;
		this.circle.radius += (this.circle.radiusTarget - this.circle.radius) * 0.1;

		this.ctx.arc(this.circle.x, this.circle.y, this.circle.radius ,0,2*Math.PI);
		let grd = this.ctx.createLinearGradient(this.circle.x - this.circle.radius, this.circle.y, this.circle.x + this.circle.radius, this.circle.y);
		this.ctx.strokeStyle = "#ebebeb";
		this.ctx.stroke();
		this.ctx.lineWidth = 5;
		this.ctx.closePath();
		
		// debug
		this.ctx.beginPath();
		// this.ctx.arc(this.circle.xInitValue, this.circle.yInitValue, this.circle.radius + this.strength,0,2*Math.PI);
		this.ctx.strokeStyle = "red";
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	pointInCircle(x, y, cx, cy, radius) {
  		let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
		return distancesquared <= radius * radius;
	}
	
	clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}
	
	changeRange(val, oldMin, oldMax, newMin, newMax) {
		return (val - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
	}
}

new AttractButton()