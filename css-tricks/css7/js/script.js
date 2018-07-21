const overlay = document.querySelector(".js-overlay");

function clickHandler(event) {
	event.preventDefault();
	
	if (event.target.classList.contains("js-button")) {
		overlay.classList.toggle("overlay--active");		
	} else {
		console.log("Not a button!");
	}
}

window.addEventListener("click", clickHandler);