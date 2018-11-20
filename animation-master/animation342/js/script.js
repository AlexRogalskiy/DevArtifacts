const frame = document.querySelector('.frame');

let raf;
let start = {
	x: 0,
	y: 0,
};

function lerp(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: start.x + dx * 0.1,
    y: start.y + dy * 0.1,
  };
};

document.addEventListener('mousemove', (e) => {
	const end = {
		x: ((e.clientX / window.innerWidth) - 0.5) * 2,
		y: ((e.clientY / window.innerHeight) - 0.5) * 2
	}
	start = lerp(start, end);
  raf = raf || requestAnimationFrame(update);
});

function update(){
  frame.style.setProperty('--x', start.x );
  frame.style.setProperty('--y', start.y );
  raf = null;
}




