const container3d = document.querySelector('.js-container-3d');
const units = document.querySelectorAll('.js-unit');
const boxes = document.querySelectorAll('.js-box-3d');
let vh = window.innerHeight;
let ch = 0;
let tweens = [];

const computeHeight = () => {
  for(let unit of units){
    ch += unit.clientHeight;
  }
}

const posBoxes = () => {
  for(let box of boxes){
    box.style.top = ch + vh + 'px';
  }
}


const initTweens = () => {
  let dur = 150;
  let i = -1;
  for (let box of boxes) {
    i++;
    
    const tween = new TimelineMax({
      repeat: -1,
      delay: dur / boxes.length
    });
    
    let rotX = '360deg';
    let rotY = 360 * 20 + 'deg';
    if(i % 2 == 0) {
      rotX = '-360deg';
      rotY = -360 * 10 + 'deg';
    }
    if(i % 3 == 0) {
      rotX = 360 * 15 + 'deg';
      rotY = -360 * 2 + 'deg';
    }

    tween.to(box, dur, {
      y: -(ch + 2 * vh),
      rotationX: rotX,
      rotationY: 360 * 20 + 'deg',
      ease: Power0.easeNone
    }).play( dur * Math.random() * 100);
    
    tweens.push(tween);
  }
}

const rebuiltTweens = () => {
  for (let tween of tweens){
    let currentTime = tween.time();
    tween.seek(0).invalidate().seek(currentTime);
  }
}


const debounce = (func, wait, immediate) => {
	let timeout;
	return function() {
		let context = this, args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


const resizeHandler = debounce(function() {
  vh = window.innerHeight;
  ch = 0;
	computeHeight();
  posBoxes();
  rebuiltTweens();
}, 250);


const init = () => {
  computeHeight();
  posBoxes();
  initTweens();
  window.addEventListener('resize', resizeHandler); 
}

init();