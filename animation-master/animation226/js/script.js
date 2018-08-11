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
}