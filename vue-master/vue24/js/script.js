console.clear();

const appCenter = body.getBoundingClientRect();
const appCenterX = appCenter.left + (appCenter.width / 2);
const appCenterY = appCenter.top + (appCenter.height / 2);

var app = new Vue({
	el: '#app',
	data: {
		onRight: false,
		movingAway: true,
		booPos: '',
		// booCenter: 0,
		mouseFromBooPos: 0,
		lastMouseFromBooPos: 0
	},
	computed: {
		getCenter() {
			return this.booPos.left + (this.booPos.width / 2);
		},
		getDelta() {
			return Math.abs(this.lastMouseFromBooPos - this.mouseFromBooPos);
		}
	},
	methods: {
		getMousePos: _.throttle(function(e) {
			const mousePos = {x: e.clientX, y: e.clientY};
			
			// move boo
			this.movingAway && document.documentElement.style.setProperty('--pos-x', -(appCenterX - mousePos.x));
			this.movingAway && document.documentElement.style.setProperty('--pos-y', -(appCenterY - mousePos.y));
			
			const boo = document.getElementById('boo');
			this.booPos = boo.getBoundingClientRect();
			this.mouseFromBooPos = this.getCenter - mousePos.x;
			
			// check where the mouse is relative to boo
			this.onRight = (this.mouseFromBooPos <= 0) || false;
			if (this.getDelta > 15) {
				this.movingAway = ((!this.onRight && this.mouseFromBooPos >= this.lastMouseFromBooPos) || (this.onRight && this.mouseFromBooPos <= this.lastMouseFromBooPos)) || false;
			}
			
			if (!this.movingAway) {
				this.moveArm('#armRight', 180, 10);
				this.moveEye('#eyeRight');
				this.moveEye('#eyeLeft');
				this.moveMouth('#mouth', 'M38.41,103.33s1.26-3.15,4-3.26,5.69,2,9.26,4.34');
			} else {
				this.moveArm('#armRight', 0, 0);
				this.moveEye('#eyeRight', 1);
				this.moveEye('#eyeLeft', 1);
				this.moveMouth('#mouth', 'M22.64,75A32.84,32.84,0,0,0,39.4,79.43c9.56-.18,21.31-4.16,24.74-6.34', 1);
			}
			
			this.lastMouseFromBooPos = this.mouseFromBooPos;
		}, 100),
		
		moveArm(el, degY, deg) {
			let arm = anime({
				targets: el,
				rotateY: `${degY}deg`,
				rotate: `${deg}deg`,
				easing: 'linear',
				elasticity: 0,
				duration: 100
			});
			
			return arm;
		},
		
		moveEye(el, val = 0) {
			let eye = anime.timeline();
			eye 
				.add({
					targets: `${el} .boo-eye`,
					scaleY: val,
					easing: 'linear',
					elasticity: 0,
					duration: 100
				})
				.add({
					targets: `${el} .boo-eye`,
					opacity: val,
					easing: 'linear',
					elasticity: 0,
					duration: 0
				})
				.add({
					targets: `${el} .boo-inner-stroke.boo-eyelid`,
					opacity: val,
					easing: 'linear',
					elasticity: 0,
					duration: 1
				});
			
			return eye;
		},
		
		moveMouth(el, path, val = 0) {
			let mouth = anime.timeline();
			mouth
				.add({
					targets: `${el} #mouthOpen`,
					scaleY: val,
					easing: 'linear',
					elasticity: 0,
					duration: 100
				})
				.add({
					targets: `${el} #mouthOpen`,
					opacity: val,
					easing: 'linear',
					elasticity: 0,
					duration: 0
				})
				.add({
					targets: `${el} #mouthClosed`,
					// d: path,
					strokeWidth: val ? 1 : 2,
					easing: 'linear',
					elasticity: 0,
					duration: 200
				});
			
			return mouth;
		}
	},
	mounted() {
		let shadow = anime({
			targets: '.boo-shadow-fill',
			translateY: -17,
			elasticity: 0,
			easing: 'linear',
			direction: 'alternate',
			loop: true,
			duration: 5000
		});
		
		return shadow;
	}
})