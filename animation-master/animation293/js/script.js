/**********************************************************************

APP
Blob experiment: http://lab.corentinfardeau.fr/blob
Code : https://github.com/Corentinfardeau/blob

**********************************************************************/


/**
 *
 * Class APP
 *
 */

class App{
	
	constructor(){
		
		_.bindAll(this, 'onResize', 'onMousemove', 'onClick', 'draw', 'init');
		
		this.ui = this.ui();
		this.context = this.ui.canvas.getContext('2d');

		this.params = {
			radius : 100,
			nbPoints : 50,
			spring: 0.03,
			debug : false
		};

		this.isFirst = true;

		this.circles = [];
				
		this.center = {
			x: window.innerWidth/2,
			y: window.innerHeight/2
		}

		// this.gui = new dat.GUI();
		// this.initDat();

		this.init();

	}
	
	ui(){
		return {
			canvas: document.querySelector('.canvas'),
		} 	
	}

	addEvent(){
		window.addEventListener('resize', this.onResize);
		window.addEventListener('click', this.onClick);
		window.addEventListener('mousemove', this.onMousemove);
	}

	init(){
		this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.onResize();

		let grd = this.context.createLinearGradient(this.center.x,this.center.y,170,0);
		grd.addColorStop(0,"#006CB8");
		grd.addColorStop(1,"#FFF");

		let circle = new Circle(this.context, this.params, {
			x: this.center.x,
			y: this.center.y
		}, grd);

		this.circles.push(circle);

		TweenMax.ticker.addEventListener('tick', this.draw);
	}

	drawCursor(){
		if(this.mousePos){
			this.context.fillStyle = '#FFFFFF';
			this.context.globalAlpha = 0.05;		
			this.context.beginPath();
			this.context.arc(this.mousePos.x, this.mousePos.y, this.params.radius, 0, 2 * Math.PI, false);			
			this.context.closePath();
			this.context.fill();
			this.context.globalAlpha = 1;		
		}
	}

	onResize(){
		this.context.canvas.width  = window.innerWidth;
  		this.context.canvas.height = window.innerHeight;

  		this.center = {
			x: window.innerWidth/2,
			y: window.innerHeight/2
		}
	}
	
	onClick(e){

		let grd2 = this.context.createLinearGradient(this.center.x,this.center.y,170,0);
		grd2.addColorStop(0,"#ddd6f3");
		grd2.addColorStop(1,"#faaca8");

		let circle = new Circle(this.context, this.params, {
			x: e.clientX,
			y: e.clientY
		}, grd2);

		this.circles.push(circle);
	}

	onMousemove(e){
	    this.mousePos = {
	    	x: e.pageX,
	    	y: e.pageY
	    }
	}

	initDat(){
		this.gui.add(this.params, 'debug').onChange(this.init);
		this.gui.add(this.params, 'nbPoints', 3, 500).onChange(this.init);
		this.gui.add(this.params, 'spring').min(0).max(0.5).step(0.01).onChange(this.init);
		this.gui.add(this.params, 'radius', 5, 400).onChange(this.init);
	}

	updateBackground(){		
		this.context.fillStyle = "#000000";
		this.context.beginPath();
		this.context.fillRect(0,0,window.innerWidth, window.innerHeight);
		this.context.closePath();
	}

	draw(){
		this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.updateBackground();

		for (var i = 0; i < this.circles.length; i++) {
			this.circles[i].update();
		}

		this.drawCursor();
		
		if(this.isFirst){
			
			this.isFirst = false;
			this.addEvent();

			TweenMax.staggerFromTo([this.ui.contentTitle,this.ui.contentInfos, this.ui.back], 1,{
				y: 10,
				alpha: 0
			},{
				y: 0,
				alpha: 1,
				ease: Quint.easeOut
			}, 0.1, 0);

			TweenMax.set(this.ui.loader, {
				autoAlpha: 0
			});
		}
	}
	
}

/**
 *
 * Class Circle
 *
 */

class Circle{

	constructor(context, params, center, grd){

		_.bindAll(this, 'updateAnimateIn');

		this.params = params;
		this.context = context;
		this.center = center;
		this.points = [];
		this.grd = grd;
		this.inactive = true;
		this.angleAnimateIn = this.params.radius * Math.abs(Math.cos(-1.2));

		this.drawCircle();
		this.animateIn();
	}

	drawCircle(){
		for (var i = 0; i < this.params.nbPoints ; i++) {
			let slice = Math.PI / this.params.nbPoints*2;
			let t = slice * i;
			let float = {
				x: this.params.radius*Math.cos(t) + this.center.x,
				y: this.params.radius*Math.sin(t) + this.center.y
			}
			let point = new Point(float.x, float.y, this.params, this.context, this.center);	
			point.maxDist = this.params.radius;
			point.maxX = Math.cos(Math.PI * 2) * 20;
			point.maxY = Math.sin(Math.PI * 2) * 20;
			this.points.push(point);		
		}

	}

	animateIn(){

		let radius = {
			scale : 0
		}

		TweenMax.to(radius, 0.8, {
			scale: this.params.radius,
			ease: Elastic.easeOut.config(1, 0.5),
			onUpdate: this.updateAnimateIn,
			onUpdateParams:[radius],
			onComplete: function(){
				this.inactive = false
			}.bind(this)
		});

	}

	updateAnimateIn(radius){
		this.animateInRadius = radius;
	}

	update(){
		if(!this.inactive){
			this.context.fillStyle = this.grd;
			this.context.shadowBlur = 500;
			this.context.shadowColor = "#003C65";
			this.context.beginPath();

			for (var i = 0; i < this.points.length - 1; i++) {
				this.context.lineTo(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
			}

			this.context.closePath();
			this.context.fill();

			for (var i = 0; i < this.points.length; i++) {
				this.points[i].update();
				if (this.params.debug){
					this.context.fillStyle = '#3370d4';
					this.context.beginPath();
					this.context.arc(this.points[i].x, this.points[i].y, 4, 0, 2 * Math.PI, false);
					this.context.closePath();
					this.context.fill();
				}
			}

			this.drawCenter();

		} else {

			this.context.fillStyle = this.grd;
			this.context.shadowBlur = 500;
			this.context.shadowColor = "#003C65";			
			this.context.beginPath();

			this.context.arc(this.center.x, this.center.y, this.animateInRadius.scale, 0, Math.PI * 2, false);

			this.context.closePath();
			this.context.fill();

		}
	}

	drawCenter(){
		if (this.params.debug){
			this.context.fillStyle = '#FFFFFF';
			this.context.beginPath();
			this.context.arc(this.center.x, this.center.y, 10, 0, 2 * Math.PI, false);
			this.context.closePath();
			this.context.fill();
		}
	}

	getAngle(a, b){
		return Math.atan2(a.y - b.y, a.x - b.x);
	}
}

/**
 *
 * Class Points
 *
 */

class Point{
	
	constructor(x, y, params, context, originCenter){

		_.bindAll(this, 'onMousemove');

		this.ox = x;
		this.oy = y;
		this.x = x;
		this.y = y;
		this.maxX = 0;
		this.maxY = 0;
		this.targetX = 0;
		this.targetY = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.maxDist = 0;
		this.params = params;
		this.context = context;
		this.originCenter = originCenter;

		window.addEventListener('mousemove', this.onMousemove);

	}
	
	onMousemove(e){
	    this.mousePos = {
	    	x: e.pageX,
	    	y: e.pageY
	    }
	}
	
	update(){

		if(this.mousePos){		

			let distance = this.distance(this.mousePos , this);
			let angle = this.getAngle(this.mousePos, this.originCenter);

			if(distance < this.maxDist) {
				var distRatio = 1 - (distance / this.maxDist);
				this.targetX = this.ox + Math.cos(angle)*((this.maxX - this.ox) * distRatio);
				this.targetY = this.oy + Math.sin(angle)*((this.maxY - this.oy) * distRatio);
		    } else {
		      this.targetX = this.ox;
		      this.targetY = this.oy;
		    }
   
		    this.velocityY += (this.targetY - this.y) * this.params.spring;
		    this.y += (this.velocityY *= 0.76);

		   	this.velocityX += (this.targetX - this.x) * this.params.spring;
		    this.x += (this.velocityX *= 0.76);
		}

	}

	distance(a, b) {
		return Math.sqrt(this.sqr(b.y - a.y) + this.sqr(b.x - a.x));
	}

	sqr(a) {
		return a*a;
	}

	getAngle(a, b){
		return Math.atan2(a.y - b.y, a.x - b.x);
	}
		
}

let app = new App();