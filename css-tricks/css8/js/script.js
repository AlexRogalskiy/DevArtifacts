let lastX = 0;
let lastTime = 0;
const container = document.querySelector(".swiper-container");
const wrapper = document.querySelector(".swiper-wrapper");

const swiper = new Swiper(".swiper-container", {
	freeMode: true,
	//freeModeMomentum: false,
	slidesPerView: "auto",
	virtualTranslate: true,
	slideToClickedSlide: true,
	on: {
		setTranslate: function (translate) {
			const x = translate;
			//const dX = x - lastX;			
			//const time = Date.now();
			//const dTime = time - lastTime;
			//const velocity = dX / dTime;			
			//const skew = truncate(velocity * 0.2, -30, 30);		
			const matrix = new WebKitCSSMatrix();
			
			matrix.translateSelf(translate);
			//matrix.skewXSelf(skew);			
			wrapper.style.webkitTransform = matrix.toString();
			
			//console.log("setTranslate", velocity, skew);

			//lastX = x;
			//lastTime = time;
		},
		setTransition: function (transition) {
			//console.log("setTransition", transition);			
			//const matrix = new WebKitCSSMatrix();
			
			//matrix.translateSelf(lastX);
			
			//wrapper.style.webkitTransform = matrix.toString();
		}
	}
});

function truncate(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function update() {
	requestAnimationFrame(update);
	
	const transform = getComputedStyle(wrapper).transform;
	const matrix = new WebKitCSSMatrix(transform);
	const x = matrix.m41;	
	const dX = x - lastX;
	const skew = truncate(dX, -30, 30);
	
	//matrix.translateSelf(0);
	//matrix.skewXSelf(skew);
	//container.style.transform = matrix.toString();
	
	lastX = x;
}

requestAnimationFrame(update);