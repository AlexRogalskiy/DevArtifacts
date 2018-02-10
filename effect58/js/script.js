$('#canvas').attr('width', $(window).width() );
$('#canvas').attr('height', $(window).height() );

function createBall(color, rad) {
	var ball = new createjs.Shape();
	ball.graphics.beginFill(color).drawCircle(0, 0, rad);
	ball.vx = 0;
	ball.vy = 0;
	return ball;
}

function clamp(aMin, aNum, aMax) {
	return Math.min(Math.max(aMin, aNum), aMax);
}

const BALLS_NUM = 50;
const MOVE_TIME = 1500;

let ballsArr = [];
let stage = new createjs.Stage('canvas');
let lastTime = Date.now();

class Balls extends createjs.Container {
	
	constructor() {
		super();
		this.ballsNum = 3;
		this.balls = [];
		this.line = new createjs.Shape();
		
		this.spring = _.random(5, 10) / 100;
		this.springLength = _.random(10, 200);
		this.friction = _.random(70, 95) / 100;
		
		for (let i = 0; i < this.ballsNum; i++) {
			this['isActive' + i] = false;
		}
		this._setup();
	}
	
	_setup() {
		this.addChild(this.line);
		for (let i = 0; i < this.ballsNum; i++) {
			let color = createjs.Graphics.getRGB(0x999999, Math.random());
			let ball = createBall(color, _.random(3, 10));
			ball.x = Math.random() * stage.canvas.width;
			ball.y = Math.random() * stage.canvas.height;
			ball.id = i;
			this.balls.push( ball );
			this.addChild(ball);
		}
	}
	
	move() {
		let delay = _.random(300, 800);
		let targetID = Math.floor( Math.random() * this.balls.length);
		let target = this.balls[targetID];
		let cp = new createjs.Point(target.x, target.y);
		let lp = new createjs.Point(
			Math.random() * stage.canvas.width,
			Math.random() * stage.canvas.height
		);
		this['isActive'+ target.id] = true;
		createjs.Tween.get(target)
			.to({x: lp.x, y: lp.y}, delay, createjs.Ease.bounceInOut())
			.call(() => {
				for (let i = 0; i < this.ballsNum; i++) {
					// console.log(this['isActive' + i]);
					this['isActive' + i] = false;
				}
			});
	}
	
	springTo(ballA, ballB) {
		var dx = ballB.x - ballA.x;
		var dy = ballB.y - ballA.y;
		var angle = Math.atan2(dy, dx);
		var targetX = ballB.x - Math.cos(angle) * this.springLength;
		var targetY = ballB.y - Math.sin(angle) * this.springLength;
		ballA.vx += (targetX - ballA.x) * this.spring;
		ballA.vy += (targetY - ballA.y) * this.spring;
		ballA.vx *= this.friction;
		ballA.vy *= this.friction;
		ballA.x += ballA.vx;
		ballA.y += ballA.vy;
	}
	
	update() {
		// Balls
		if (!this.isActive0) {
			this.springTo(this.balls[0], this.balls[1]);
			this.springTo(this.balls[0], this.balls[2]);
		}
		if (!this.isActive1) {
			this.springTo(this.balls[1], this.balls[0]);
			this.springTo(this.balls[1], this.balls[2]);
		}
		if (!this.isActive2) {
			this.springTo(this.balls[2], this.balls[0]);
			this.springTo(this.balls[2], this.balls[1]);
		}
		
		// Line
		this.line.graphics
			.clear()
			.setStrokeStyle(1)
			.beginStroke('#333')
			.moveTo(this.balls[0].x, this.balls[0].y);
		for (let i = 1, l = this.balls.length; i < l; i++) {
			this.line.graphics.lineTo(this.balls[i].x, this.balls[i].y);
		}
		this.line.graphics.lineTo(this.balls[0].x, this.balls[0].y);
	}
}

for (var i = 0; i < BALLS_NUM; i++) {
	let balls = new Balls();
	stage.addChild(balls);
	ballsArr.push(balls);
}

createjs.promote(Balls, 'Container');
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener('tick', () => {	
	ballsArr.forEach(function(ball){
		ball.update();
	});
	let currentTime = Date.now();
	if (currentTime - lastTime > MOVE_TIME) {
		ballsArr.forEach(function(ball){
			ball.move();
		});
		lastTime = currentTime;
	}
	
	stage.update();
});