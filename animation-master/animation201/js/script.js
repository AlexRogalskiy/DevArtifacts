// randomiser courtesy of @bdc https://twitter.com/bdc/status/839960325805969408
const randomInterval = (() => {
  const random = (min, max) => Math.random() * (max - min) + min;
  return (callback, min, max) => {
    const time = {
      start: performance.now(),
      total: random(min, max)
    };
    const tick = now => {
      if (time.total <= now - time.start) {
        time.start = now;                                                                                     
        time.total = random(min, max);
        callback();
      }   
      requestAnimationFrame(tick);
    };  
    requestAnimationFrame(tick);
  };  
})();

const allElements = document.querySelectorAll('span');

const getRandomElement = (elements) => {
	return elements[Math.floor(Math.random()*elements.length)];
} 

const animate = (elements) => {
	const element = getRandomElement(elements);
	element.setAttribute('data-animate', true);
	setTimeout( () => { 
		element.removeAttribute('data-animate');
	}, 1200);
}

randomInterval(() => animate(allElements), 1000, 3000);