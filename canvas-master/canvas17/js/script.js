const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

// colors
const colors = [
  '#2185C5',
  '#7ECEFD',
  // '#FFF6E5',
  '#FF7F66'
];

// events
window.addEventListener('mousemove', ({x, y}) => mouse = {x, y});

window.addEventListener('resize', () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  canvas.width = windowWidth;
  canvas.height = windowHeight;

  init();
});

window.addEventListener('click', () => {
  init();
});

// utils
const randomRange = (min, max) => {
  return Math.floor( Math.random() * (max - min + 1) + min );
};

const randomColor = () => {
  return colors[ Math.floor(  Math.random() * colors.length ) ];
};

class Particle {
  constructor(x, y, radius, color) {
    this._x = x;
    this._y = y;

    this.x = this._x;
    this.y = this._y;

    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;

    this.distanceFromCenter = {x: randomRange(50, 250), y: randomRange(50, 250)};
    this.lastMouse = {x: this.x, y: this.y};
  }

  draw() {
    c.beginPath();
    c.strokeStyle = this.color;
    c.lineWidth = this.radius;
    c.moveTo(this.lastPoint.x, this.lastPoint.y);
    c.lineTo(this.x, this.y);
    c.stroke();
    c.closePath();
  }

  update() {
    this.lastPoint = {x: this.x, y: this.y};

    this.radians += this.velocity;

    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

    this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter.x;
    this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter.y;

    this.draw();
  }
};

let particles;
const init = () => {
  particles = [];

  for (var i = 0, len = 200; i < len; i++) {
    const radius = (Math.random() * 5) + 1;
    const x = windowWidth / 2;
    const y = windowHeight / 2;
    const color = randomColor();

    particles.push( new Particle(x, y, radius, color) );
  }
};

const animate = () => {
  requestAnimationFrame(animate);

  c.fillStyle = 'rgba(255, 255, 255, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => p.update());
}

init();
animate();
