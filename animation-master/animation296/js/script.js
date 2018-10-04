var spun = 0;
var kiwi = document.getElementById('kiwi');

function spin() {
	spun += 720;
	kiwi.style.transform = 'rotate(' + spun + 'deg)';
}

kiwi.addEventListener('click',spin);
