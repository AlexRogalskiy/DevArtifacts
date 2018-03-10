/*
  Johan Karlsson (DonKarlssonSan) 2018
  
  Using my vector lib stored as a separate Pen: 
  https://codepen.io/DonKarlssonSan/pen/JreEJO
  
  Also available at GitHub:
  https://github.com/DonKarlssonSan/vectory
  
  and npm:
  https://www.npmjs.com/package/vectory-lib
*/

const config = {
  text: "Repellers",
  widthToSpikeLengthRatio: 0.054
};

const colorConfig = {
  particleOpacity: 0.2,
  baseHue: 350,
  hueRange: 9,
  hueSpeed: 0.04,
  colorSaturation: 100,
};

// A line that is part of forming the text
class Planet {
  constructor(x, y, g) {
    this.pos = new Vector(x, y);
    this.g = g;
  }
  draw() {
    ctx.fillStyle = "#AAA";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 8, 0, Math.PI*2);
    ctx.fill();  
  } 
}

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, spikeLength);
  }
  
  move(force) {
    if(force) {
      this.vel.addTo(force);
    }
    if(this.vel.getLength() > spikeLength) {
      this.vel.setLength(spikeLength);
    }
  }
    
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    let p2 = this.pos.add(this.vel);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();  
  }  
}

let canvas;
let ctx;
let w, h;
let hue;
let particles;
let spikeLength;
let planets;
let A;
let B;
let a;
let b;
let tick;

function setup() {
  tick = 0;
  planets = [];
  let len = Math.round(Math.random()*3+3);
  for(let i = 0; i < len; i++) {
    let p = new Planet(50+i*100, 340, i?1000:4000);
    planets.push(p);
  }
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("resize", reset);
  canvas.addEventListener("mousemove", mousemove);
  reset();
}

function reset() {
  hue = colorConfig.baseHue; 
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  spikeLength = w * config.widthToSpikeLengthRatio;
  A = w / 2.2;
  B = h / 2.2;
  a = Math.round(Math.random() + 2);
  b = Math.round(Math.random() + 2);
  drawText();
}

function mousemove(event) {
  let x = event.clientX;
  let y = event.clientY;
  planets[0].pos.x = x;
  planets[0].pos.y = y;
}

function draw() {
  clear();
  requestAnimationFrame(draw);
  updateParticles();
  updatePlanets();
  tick++;
}

function clear() {
  ctx.clearRect(0, 0, w, h);
}

function drawText() {
  ctx.save();
  let fontSize = w * 0.2;
  ctx.font = "bold " + fontSize + "px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"
  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
  ctx.strokeText(config.text, w/2, h/2);
  ctx.restore();
  let imageData = ctx.getImageData(0, 0, w, h);

  particles = [];

  for(let x = 0; x < w; x++) {
    for(let y = 0; y < h; y++) {
      let i = (x + w*y)*4;
      let average = (imageData.data[i] + 
                     imageData.data[i + 1] + 
                     imageData.data[i + 2] +
                     imageData.data[i + 3]) / 4;
      if(average > 200) {
        let particle = new Particle(x, y);
        particles.push(particle);
      }
    }
  }
  clear();
}

function updatePlanets() {
  let len = planets.length;
  for(let i = 1; i < len; i++) {
    let angle = Math.PI*2/(len-1)*i;
    let x = A * Math.sin(a*tick/100+angle) + w/2;
    let y = B * Math.sin(b*tick/100+angle) + h/2; 
    let p = planets[i];
    p.pos.x = x;
    p.pos.y = y;
    p.draw();
  }
}

function updateParticles() {
  hue += colorConfig.hueSpeed; 
  let h = Math.sin(hue) * colorConfig.hueRange + colorConfig.baseHue;
  ctx.strokeStyle = `hsla(${h}, ${colorConfig.colorSaturation}%, 50%, ${colorConfig.particleOpacity})`;  
  particles.forEach(p => {
    // Apply the force of each planet (repeller) to the current particle
    planets.forEach(planet => {
      let d = p.pos.sub(planet.pos);
      let length = d.getLength();
      let g = planet.g / length;
      if(g > 40) {
        g = 40;
      }
      // We keep the angle of the distance
      d.setLength(g);
      p.move(d);
    });
    p.draw();
  });
}

setup();
draw();
