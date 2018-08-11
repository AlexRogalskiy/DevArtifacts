console.clear();

const app = new Vue({
	el: '#app',
	data: {
		complete: false,
		toppings: [
			{ 
				name: 'Patty',
				height: 25
			},
			{ 
				name: 'Mustard',
				height: 10
			},
			{ 
				name: 'Ketchup',
				height: 10
			},
			{ 
				name: 'Tomato',
				height: 10
			},
			{ 
				name: 'Cheese',
				height: 10
			},
			{ 
				name: 'Lettuce',
				height: 15
			}
		],
		checked: [
			{ 
				name: 'Patty',
				height: 25
			}
		]
	},
	// computed: {
	// 	reverseChecked() {
	// 		// let copy = [...this.checked];
	// 		this.checked.splice(0, 0, this.checked.pop());
	// 		return this.checked;
	// 	}
	// },
	filters: {
		lowercase: function(value) {
			return value.toLowerCase();
		}
	},
	methods: {
		bounceStart(el) {
			el.style.transform = 'scaleY(0)';
			el.style.height = '0';
		},
		bounceEnter(el, done) {
			let bounce = anime.timeline({
				complete: function() {
					done();
				}
			});
			let height = el.getAttribute('data-height');
			bounce
				.add({
					targets: el,
					height: parseInt(height)  + 20,
					duration: 800,
					// easing: 'linear',
					elasticity: 100
				})
				.add({
					targets: el,
					scaleY: 1,
					delay: 100
				})
				.add({
					targets: el,
					height: height,
					duration: 600,
					elasticity: 100
				});
		},
		bounceLeave(el, done) {
			let bounce = anime.timeline({
				complete: function() {
					done();
				}
			});
			bounce
				.add({
					targets: el,
					// scaleY: 0,
					translateY: 10,
					opacity: 0,
					height: 0,
					duration: 300,
					easing: 'linear',
					elasticity: 100
				})
				// .add({
				// 	targets: el,
				// 	height: 0,
				// 	easing: 'linear',
				// 	elasticity: 0
				// });
		},
		completeOrder() {
			this.complete = true;
		}
	}
});