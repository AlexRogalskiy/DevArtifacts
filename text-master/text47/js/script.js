class Smoke {
  constructor(config) {
    this.particles = [];
    this.canvas = config.el;

    if (!this.canvas.getContext) {
      return alert("Please use a modern browser");
    }

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context = this.canvas.getContext("2d");

    document.addEventListener("mousemove", e => {
      var pos = getMousePosition(e, this.canvas);
      this.mouseDirection = pos.x - this.canvas.width * 0.5;
    });

    window.addEventListener("resize", e => {
      this.canvas.width = e.target.innerWidth;
      this.canvas.height = e.target.innerHeight;
    });

    const smokePngs = [
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke1.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke2.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke3.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke4.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke5.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke6.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke7.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke8.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke9.png",
      "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png"
    ];

    for (var i = 0; i < config.particleCount; i++) {
      //  get random smoke img
      let ImgObject = new Image();
      ImgObject.src = smokePngs[Math.floor(Math.random() * smokePngs.length)];

      this.particles.push(
        new Particle({
          x: getRandomInt(0, this.canvas.width),
          y: getRandomInt(this.canvas.height / 2, this.canvas.height),
          vx: config.maxVelocity * Math.random(),
          vy: config.maxVelocity * Math.random(),
          img: ImgObject,
          size: getRandomInt(480, 800),
          canvas: this.canvas
        })
      );
    }

    this.loop();
  }

  loop() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // black bg
    // this.context.fillStyle = "red";
    // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouseDirection);
      this.particles[i].draw();
    }
    requestAnimationFrame(this.loop.bind(this));
  }
}

const TO_RADIANS = Math.PI/180; 

class Particle {
  constructor(settings) {
    this.x = settings.x;
    this.y = settings.y;
    this.vx = settings.vx;
    this.vy = settings.vy;
    this.rotation = 0;
    this.image = settings.img;
    this.size = settings.size;
    this.canvas = settings.canvas;
    this.context = settings.canvas.getContext("2d");
  }

  draw() {
    // this.context.fillStyle = "red";
    // this.context.fillRect(this.x, this.y, 2, 2);
    
    //  process rotation
    this.context.save(); 
    
    this.context.translate(this.x, this.y);
    this.context.rotate(this.rotation * TO_RADIANS);

    this.context.drawImage(
      this.image, 
      -this.size / 2, 
      -this.size / 2, 
      this.size, this.size
    );
    
    this.context.restore();
  }

  update(mouse = 0) {
    let mouseModifier = 1.5;
    this.x += this.vx + mouse / (this.canvas.width / 2 / mouseModifier);
    this.y += this.vy;
    
    this.rotation += 0.2;

    if (this.x > this.canvas.width + this.size) this.x = -this.size;
    if (this.x < 0 - this.size) this.x = this.canvas.width + this.size;

    if (this.y < 0 || this.y > this.canvas.height * 0.4) this.vy = -this.vy;
  }
}

let anim = new Smoke({
  el: document.getElementById("myCanvas"),
  particleCount: 80,
  maxVelocity: 1
});

function getMousePosition(evt, canvas) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
