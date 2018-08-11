console.clear();

const buttons = [...document.querySelectorAll('.color-controls-button')];
const house = document.getElementById('house');

buttons.forEach(button => button.addEventListener('click', () => {
	updateColor(button)																									
}));

function updateColor(button) {
	const color = button.getAttribute('data-color');
	
	house.className = 'house';
	house.classList.add(color);
	
	document.querySelector('.active').classList.remove('active');
	button.classList.add('active');
}const data = [
	{ text: 'Hello! 😄' },
	{ text: 'How\'s it going?' },
	{ text: 'Cool.' },
	{ text: 'Okay.' },
	{ text: '👍' },
	{ text: 'Kay, bye! 👋' }
];
let	counter = 1;

Vue.component('bubble', {
	props: ['bubbtext'],
	template: `<div class="bubble">{{bubbtext}}</div>`
})

var vm = new Vue({
	el: '#app',
	data: {
		noResponses: false,
		isTyping: false,
		newMessage: '',
		contents: []
	},
	watch: {
		newMessage: function() {
			if (this.newMessage !== '') {
				this.isTyping = true;
				setTimeout(moveChat, 100);
			} else {
				this.isTyping = false;
			}
		}
	},
	methods: {
		addToChat: function() {
			if (this.newMessage !== '') {
				this.contents.push({text: this.newMessage, isUser: true});
				this.newMessage = "";
				counter++;
				setTimeout(moveChat, 100);
				setTimeout(this.addNewResponse, 1000);
			}
		},
		addNewResponse: function() {
			if (counter < data.length) {
				this.contents.push(data[counter]);
			} else {
				this.noResponses = true;
			}
			
			setTimeout(moveChat, 100);
		}
	}
})

vm.contents.push(data[0]);
vm.contents.push(data[1]);

function moveChat() {
	const wrap = document.getElementById('wrapper');
	wrap.scrollTop = wrap.scrollHeight;
}