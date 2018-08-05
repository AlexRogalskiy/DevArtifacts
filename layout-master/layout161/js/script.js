const btn = document.querySelector('.toggle input');
const pers = document.querySelector('.perspective');
const behind = document.querySelector('.behind');
let active = false;

btn.addEventListener('change', (e) => {	
	
	if(active) {		
		behind.style.transitionDelay = "0ms";	
	} else {
		behind.style.transitionDelay = "200ms";	
	}
	
	pers.classList.toggle('pers');
	behind.classList.toggle('active');
	e.target.parentElement.classList.toggle('checked');
	active = !active;
});