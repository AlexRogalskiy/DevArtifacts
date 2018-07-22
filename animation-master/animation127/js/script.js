const scl = 8;
let cols, rows;
let xstart, ystart;
let zoff = 0;
let angleMultiplier;

let flowfield;

function setup() {
  createCanvas(600, 600);
  cols = round((width - width/5) / scl);
  rows = round((height - height/5) / scl);
  // cols = round((width + 50) / scl);
  // rows = round((height + 50) / scl);
  
  flowfield = new Array();
  initField();
  
  xstart = random(500);
  ystart = random(500);
  angleMultiplier = floor(random(1, 5));
}

function draw() {
  background(255);
  
  translate(width/10 + scl/2, height/10 + scl/2);
  // translate((scl-25)/2, (scl-25)/2);
  
  updateField();
  drawField();
  
  // noLoop();
}

function updateField() {
  let yoff = ystart;
	
  for (let y = 0; y < rows; y++) {
    let xoff = xstart;
    for (let x = 0; x < cols; x++) {
      let fieldIndex = x+y*cols;
      
      // let angle = cos(noise(xoff, yoff+frameCount*0.005, zoff)) * TWO_PI * 10;
      let angle = tan(noise(xoff, yoff+frameCount*0.0009, sin(zoff))) * TWO_PI * 5;
      // let angle = noise(xoff, yoff, zoff) * TAU + (1*xoff*yoff) + (zoff*angleMultiplier);
      //let angle = sin(xoff * x + yoff * y + zoff * fieldIndex);
      //let angle = sin(xoff + yoff + zoff) * fieldIndex/2;
      //let angle = sin((x + y) * zoff);
      //let angle = sin((xoff + x) * (yoff + y) * zoff);
      
      let v = createVector(x+0.5, y+0.5).rotate(angle);
      //PVector v = PVector.fromAngle(angle);
      v.setMag(cos(noise(xoff, yoff, zoff))*15);
      //v.setMag(angle+5);
      //v.setMag(scl);
      //v.setMag(5);
      //v.setMag(scl*zoff+scl);
      //v.setMag(sin(noise(x, y))*TWO_PI);
      //v.setMag(zoff*yoff*xoff + scl + 1);
      
      //flowfield[fieldIndex].angle = v;
      flowfield[fieldIndex].showPos = flowfield[fieldIndex].startPos.copy().add(v);
      //flowfield[fieldIndex].showPos.add(v);
			
			// if (fieldIndex === 0 || fieldIndex === 1) {
			// 	console.log({angle});
			// 	console.log({v});
			// 	console.log(v.mag());
			// }
      
      // strokeWeight(1);
      // stroke(0, 10+(v.mag()*0.1));
      // push();
      // translate(x*scl, y*scl);
      // rotate(v.heading());
      // line(0, 0, scl/2 * (v.mag()*0.1), 0);
      // pop();
      
      xoff += 0.01;
    }
    yoff += 0.01;
  }
  
  zoff += 0.01;
}

function drawField() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let fieldIndex = x+y*cols;
      flowfield[fieldIndex].show();
    }
  }
}

function initField() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let fieldIndex = x+y*cols;
      flowfield[fieldIndex] = new GridPoint(createVector(x*scl,y*scl));
    }
  }
}

class GridPoint {
  constructor(newPos) {
    this.startPos = newPos;
    this.showPos = newPos;
		this.angle = p5.Vector.fromAngle(1);
  }
  
  show() {
    noStroke();
    fill(100);
    ellipse(this.showPos.x, this.showPos.y, 3, 3);
  }
}