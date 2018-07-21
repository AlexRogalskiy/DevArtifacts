const A = .2, _C = document.querySelector('.cube');

let drag = false, x0 = null, y0 = null;

function getE(ev) {
	return ev.touches ? ev.touches[0] : ev;
};

function lock(ev) {
	let e = getE(ev);
	drag = true;
	x0 = e.clientX;
	y0 = e.clientY;
};

function rotate(ev) {
	if(drag) {
		let e = getE(ev), 
				x = e.clientX, y = e.clientY, 
				dx = x - x0, dy = y - y0, 
				d = Math.hypot(dx, dy);
		
		if(d) {
			_C.style.setProperty('--p', getComputedStyle(_C).transform.replace('none', ''));
			_C.style.setProperty('--i', +(-dy).toFixed(2));
			_C.style.setProperty('--j', +(dx).toFixed(2));
			_C.style.setProperty('--a', `${+(A*d).toFixed(2)}deg`);
						
			x0 = x;
			y0 = y;
		}
	}
};

function release(ev) {
	if(drag) {
		drag = false;
		x0 = y0 = null;
	}
};

document.addEventListener('mousedown', lock, false);
document.addEventListener('touchstart', lock, false);

document.addEventListener('mousemove', rotate, false);
document.addEventListener('touchmove', rotate, false);

document.addEventListener('mouseup', release, false);
document.addEventListener('touchend', release, false);