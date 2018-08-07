const TO_RADIANS = Math.PI/180; 

class Animator {
  constructor(config) {
    this.config = config
    this.particles = [];
    this.canvas = config.el;

    if (!this.canvas.getContext) {
      return alert("Please use a modern browser");
    }

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context = this.canvas.getContext("2d");

    window.addEventListener("resize", e => {
      this.canvas.width = e.target.innerWidth;
      this.canvas.height = e.target.innerHeight;
      
      this.loop()
    });
    
    const particleDiameter = config.particle.sizeTo * 2
    const area = (this.canvas.clientWidth * this.canvas.clientHeight) / (particleDiameter + config.spacing)
    
    const particleCount = parseInt( area / particleDiameter ) 
    const particlesPerLine = parseInt(this.canvas.clientWidth / (particleDiameter + config.spacing)) + 1
    const particlesPerRow = parseInt(this.canvas.clientHeight / (particleDiameter + config.spacing)) + 1

    
    // generate particles
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(
        new Particle({
          x: i % particlesPerLine * (particleDiameter + config.spacing),
          y: i % particlesPerRow * (particleDiameter + config.spacing),
          sizeFrom: config.particle.sizeFrom,
          sizeTo: config.particle.sizeTo,
          canvas: this.canvas
        })
      )
      
    }

    this.loop();
  }

  loop() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // black bg
    // this.context.fillStyle = "red";
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
    }
    requestAnimationFrame(this.loop.bind(this));
  }
}

class Particle {
  constructor(settings) {
    this.x = settings.x;
    this.y = settings.y;
    this.size = getRandomFloat(settings.sizeFrom, settings.sizeTo);
    this.canvas = settings.canvas;
    this.context = settings.canvas.getContext("2d");
  }
  
  update() {
    
//     increase size
// change color
  }

  draw() {
    this.context.fillStyle = "red";
    this.context.beginPath()
    this.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    this.context.fill();
  }

  
}

let anim = new Animator({
  el: document.getElementById("myCanvas"),
  spacing: 25,
  particle: {
    sizeFrom: 2,
    sizeTo: 5,
    colorFrom: 'blue',
    colorTo: 'red'
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
