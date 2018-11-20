const animation = "https://gist.githubusercontent.com/lisilinhart/b0ee825b2f5a07009b3af6416460b297/raw/f03662ad3076b01d4c8a3cef9e40b85c9dcb2ba8/animation.json";
const $svg = document.querySelector('.space');
const $spaceShip = document.querySelector('#spaceship')
const $planet = document.querySelector('#planet')

let master;
let raf;
let start = {
	x: 0,
	y: 0,
};

spirit
	.setup()
	.then(() => spirit.load(animation))
	.then(groups => {

	let rocket = groups.get("rocket").construct().timeScale(0.7).play();
	let bg = groups.get("background").construct().timeScale(0.3).play();
	let planet = groups.get("planet").construct().timeScale(0.7).play();
	let stars = groups.get("little_stars").construct().timeScale(0.7).play();
	let suns = groups.get("suns").construct().timeScale(0.5).play();
	let shooting = groups.get("shooting").construct().timeScale(0.4).play();
	
	master = new TimelineMax({ onComplete: listen });
	master
		.add(bg)
		.add(planet, "-=.8")
		.add(stars)
		.add(suns)
		.add(shooting)
		.addLabel("rocket")
		.add(rocket, "rocket");
	});


function lerp(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: start.x + dx * 0.1,
    y: start.y + dy * 0.1,
  };
};


function update(){
	TweenMax.to($svg, 1, {"--x":  start.x, "--y": start.y, });
  raf = null;
}

function listen() {
	master.clear();
	document.addEventListener('mousemove', (e) => {
		const end = {
			x: ((e.clientX / window.innerWidth) - 0.5) * 2,
			y: ((e.clientY / window.innerHeight) - 0.5) * 2
		}
		start = lerp(start, end);
		raf = raf || requestAnimationFrame(update);
	});
} 

$spaceShip.addEventListener('click', () => {
	spirit.groups.get("rocket").construct().timeScale(0.7).startTime(0).play();
})