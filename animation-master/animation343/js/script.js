var app = new Vue({
  el: "#app",

  data: {
    range: 0,
		previous: 0,
		circles: [
      { color: '#FB5652' },
      { color: '#FDBD3D' },
			{ color: '#2EC846' },
    ]
  },
	
  methods: {
		translate(el, from, to) {
			// 13.5 is the circle size + the gap 
			const vw = `${13.5 + (2 * (to - from) )}vmin`;
			const colorFrom = this.circles[from].color;
			const colorTo = this.circles[to].color;
			
			el.animate([
				{ transform: `translateX(calc(${from} * 13.5vmin)) scale(1)`, backgroundColor: colorFrom }, 
				{ transform: `translateX(calc(${from} * ${vw})) scale(0.5)`, offset: .2 },
				{ transform: `translateX(calc(${to} * ${-vw})) scale(0.5)`, offset: .8 }, 
				{ transform: `translateX(calc(${to} * 13.5vmin)) scale(1)`, backgroundColor: colorTo }
			], {
				duration: 500,
				fill: 'forwards',
				iteration: 1,
				easing: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
			});
		},
		wobble(el, direction) {
			el.animate([
				{ transform: `scaleX(1)` }, 
				{ transform: `scaleX(1.2) scaleY(0.8)`, offset: .06 } ,
				{ transform: `scaleX(0.8) scaleY(1.2)`, offset: .18 }, 
				{ transform: `scaleX(1.1) scaleY(0.9)`, offset: .312  },
				{ transform: `scaleX(0.9) scaleY(1.1)`, offset: .437  },
				{ transform: `scaleX(1.05) scaleY(0.95)`, offset: .625  },
				{ transform: `scaleX(0.95) scaleY(1.05)`, offset: .812 },
				{ transform: `scaleX(1) scaleY(1)` }
			], {
				duration: 600,
				delay: 250,
				fill: 'forwards',
				iteration: 1,
				easing: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
			});
		},
		changeValue(toAdd) {
			let newValue = range + toAdd;
			if(newValue >= 0 && newValue <= 2) {
				range += toAdd;
			}
		}
	},
	
	watch: {
    range() {
			this.translate(this.$refs.control, this.previous, this.range);
			this.wobble(this.$refs.circle[this.range]);
			this.previous = this.range;
	 }
	}
});