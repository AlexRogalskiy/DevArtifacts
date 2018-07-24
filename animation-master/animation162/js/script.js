const imageContainer = document.querySelector('.draggable');
const body = document.querySelector('body');
const offsetX = document.querySelector('.offsetX');
const offsetY = document.querySelector('.offsetY');
const imageURL = document.querySelector('.url');
const allowX = document.querySelector('#allowX');
let mouseAtClick = {};
let bgPosAtClick = {};
const documentMove = function(event) {
	const whereIsMouse = {
		x: event.pageX,
		y: event.pageY
	};
	// moved how much?
	const moved = {
		x: whereIsMouse.x - mouseAtClick.x,
		y: whereIsMouse.y - mouseAtClick.y
	};
	
	const newBGLocation = {
		x: (bgPosAtClick.x + moved.x) + 'px',
		y: (bgPosAtClick.y + moved.y) + 'px',
	}

	// update background with old position plus xMove/yMove
	// console.log('background image start xy', bgPosAtClick);
	// console.log('mouse has moved', moved);
	// console.log('new background x/y', newBGLocation)
	if(allowX.checked) {
		body.style.setProperty('--bg-x', newBGLocation.x);
		offsetX.innerHTML = newBGLocation.x;
	}
	body.style.setProperty('--bg-y', newBGLocation.y);

	offsetY.innerHTML = newBGLocation.y;
};

imageContainer.addEventListener('mousedown', function(e) {
	// console.log('event', e)
	e.preventDefault();
	mouseAtClick = {
		x: e.pageX,
		y: e.pageY
	};
	const imageContainerStyles = window.getComputedStyle(imageContainer, null);
	bgPosAtClick = {
		x: parseInt(imageContainerStyles.backgroundPosition.split(' ')[0], 10),
		y: parseInt(imageContainerStyles.backgroundPosition.split(' ')[1], 10)
	}
	// console.log(imageContainerStyles, imageContainerStyles.backgroundPosition, bgPosAtClick);
	document.addEventListener('mousemove', documentMove);
	return;
});

imageContainer.addEventListener('mouseup', function() {
	document.removeEventListener('mousemove', documentMove);
});

document.querySelector('#zoom').addEventListener('input', function(event){
	// console.log(event, event.target.value)
	const newSize = event.target.value + '%';
	body.style.setProperty('--bg-size', newSize);
	document.querySelector('.size').innerHTML = newSize;
});

imageURL.addEventListener('change', function(event){
	console.log('update URL')
	body.style.setProperty('--bg-url', "url('" + event.target.value + "')");
});