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

// Bubbling icon class
class bubblingIcon {
	constructor(icons, parent, speeds) {
		this.icons = icons;
		this.parent = parent;
		this.speeds = speeds;
	}

	randomInt(min, max) {
		const randomValue = Math.round(Math.random() * (max - min) + min);
		return randomValue;
	}

	getRandomIconID() {
		const iconID = this.icons[Math.floor(Math.random() * this.icons.length)];
		return iconID;
	}

	generateIcon() {
		const xsvgNS = 'http://www.w3.org/2000/svg';
		const xlinkNS = 'http://www.w3.org/1999/xlink';

		const svg = document.createElementNS(xsvgNS, 'svg');
		const use = document.createElementNS(xsvgNS, 'use');
		const iconID = this.getRandomIconID();

		svg.appendChild(use);
		svg.classList = `icon  icon--floating  icon--${iconID}`;
		use.setAttributeNS(xlinkNS, 'href', `#${iconID}`);

		return svg;
	}

	init() {
		const icon = this.generateIcon();
		const speed = `${this.randomInt(this.speeds[0], this.speeds[1])}000`;
		const position = `${this.randomInt(0, 100)}%`;

		icon.setAttribute('style', `left: calc(${position} - 24px); animation-duration: ${speed}ms`);

		this.parent.appendChild(icon);

		window.setTimeout(() => { this.parent.removeChild(icon); }, speed);
	}
};

// Icons IDs
const socialIcons = ['github', 'twitter', 'dribbble', 'codepen'];

// Parent container
const container = document.querySelector('.container');

// Bubbling icon set to const
const bubbleIcon = new bubblingIcon(socialIcons, container, [3, 9]);

// Generate bubbling icon with random intervals
randomInterval(() => { bubbleIcon.init() }, 200, 600);
