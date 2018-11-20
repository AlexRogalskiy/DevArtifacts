const tiles = [];
const duration = 500;
const degree = "45deg";
const grid = document.querySelector(".grid");
const gridItems = Array.from(document.querySelectorAll(".grid__item"));
const reset = document.querySelector(".reset");
const heading = document.querySelector(".text");
const text = [
	"You look fantastic today",
	"You got this 👍",
	"I like your style 💅",
	"You're great at figuring stuff out 👩‍🔬",
	"Your hair looks amazing today 🎉",
	"You're a smart cookie 🍪",
];
let iteration = 1;

function Tile(element) {
	tiles.push(this);
	this.element = element;
	this.opacity = this.element.animate([
		{ opacity: 1, transform: "scale(1) rotate(0deg)" }, 
		{ opacity: 0, transform: "scale(0.4) rotate(-75deg)" }
	], {
		duration: duration,
		easing: "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
		fill: "forwards"
	});
	this.opacity.pause();
}

Tile.prototype = {
	fadeOut: function() {
		if(this.opacity.currentTime === 0) {
			this.opacity.playbackRate = 1;
			this.opacity.play();
		}
	},
	reset: function() {
		if(this.opacity) {
			this.opacity.playbackRate = -1;
			this.opacity.play();
		}
	}
};

gridItems.forEach((item) => new Tile(item));

grid.addEventListener('mouseover', (e) => {
	tiles.forEach((tile) => {
		if(tile.element === e.target) {
			tile.fadeOut();
		}
	});
})


reset.addEventListener('click', (e) => {
	// reset animation for tiles
	tiles.forEach((tile) => tile.reset());
	
	setTimeout(function(){
		if (iteration >= text.length) iteration = 0;
		heading.innerHTML = text[iteration++];
	}, duration);
});