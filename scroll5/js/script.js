//config vars
const lagAmount = 50;
const maxSpeed = 100;
const frameRate = 20;
const selector = '.pin';
//code
let scrollTop = 0;
let pinTop = 0;
let lastTime;
const updatePinPosition = (time) => {
	if (!lastTime)
		lastTime = time;
	let delta = time - lastTime;
	if (delta >= frameRate){
		scrollTop = $(window).scrollTop();
		var move = (scrollTop - pinTop) * delta / (lagAmount + delta);
		var direction = move === 0 ? 0 : move / Math.abs(move);
		pinTop = pinTop + Math.min( Math.abs(move), maxSpeed ) * direction;
		$(selector).css('transform', `translateY(${-move}px`)
		lastTime = time;
	}
	requestAnimationFrame(updatePinPosition);
}
requestAnimationFrame(updatePinPosition);