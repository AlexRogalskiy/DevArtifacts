// Dev Version
// https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js

// Vue App
// https://vuejs.org/v2/guide/transitions.html#Staggering-List-Transitions
const app = new Vue({
	el: '#vjs-app',
	data() {
		return {
			selected: false,
			modalOrigin: '0px 0px',
			// offsetTop: '0px',
			albums: [
				{
					name: '12 Bar Bruise',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/twelve-bar-bruise.jpg',
					released: 'September 7, 2012',
					length: '34:18'
				},
				{
					name: 'Eyes Like the Sky',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/eyes-like-the-sky.jpg',
					released: 'February 22, 2013',
					length: '27:49'
				},
				{
					name: 'Quarters',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/quarters.jpg',
					released: 'May 1, 2015',
					length: '40:40'
				},
				{
					name: 'Nonagon Infinity',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/nonagon-infinity.jpg',
					released: 'April 29, 2016',
					length: '41:45'
				},
				{
					name: 'Flying Microtonal Banana',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/microtonal-banana.jpg',
					released: 'February 24, 2017',
					length: '41:53'
				},
				{
					name: 'Sketches of Brunswick East',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/sketches-of-brunswick-east.jpg',
					released: 'August 18, 2017',
					length: '37:19'
				},
				{
					name: 'Polygondwanaland',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/polygondwanaland.jpg',
					released: 'November 17, 2017',
					length: '43:54'
				},
				{
					name: 'Gumboot Soup',
					art: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/323064/gumboot-soup.jpg',
					released: 'December 31, 2017',
					length: '44:08'
				}
			]
		}
	},
	methods: {
		openModal: function(e, album) {
			this.selected = album;

			let target 				= e.target,
					target_coords = target.getBoundingClientRect();

			// this.offsetTop = window.pageYOffset + 'px';
			this.modalOrigin = (target.nodeName === 'IMG' ? (target.offsetLeft + (target_coords.width/2)) +'px ' + ((target.offsetTop + (target_coords.height/2))) + 'px' : '0px 0px' );
		}
	},
	mounted: function() {
		var listElement = document.querySelectorAll('.items-list__item');
			listElement.forEach(function(element) {
				setTimeout(function() {
					element.classList.add('js-animated');
				}, 0);
			});
	},
	template: `
		<div class="showcase">
			<h1 class="title">King Gizzard & The Lizard Wizard</h1>
			<small>click or tap to view album details.</small>
			<ol class="items-list fadein-stagger">
				<li class="items-list__item" v-for="album in albums">
					<img :src="album.art" :alt="album.name" @click="openModal($event, album)">
				</li>
			</ol>
			<transition name="modal-transition">
				<dialog ref="modal" v-if="selected" class="modal" @click="selected = false" :style="{ transformOrigin: modalOrigin }">
					<img :src="selected.art" :alt="selected.name">
					<span class="details"><b>Album Title</b>: {{ selected.name }}</span>
					<span class="details"><b>Release Date</b>: {{ selected.released }}</span>
					<span class="details"><b>Album Length</b>: {{ selected.length }}</span>
				</dialog>
			</transition>
		</div>
	`
});