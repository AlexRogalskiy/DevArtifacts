/* 
  Physics using verlet integration,
  from Coding Math by Keith Peters.
*/

class Fan {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.isOn = false;
    this.speed = 0;
    this.maxSpeed = 0.14;
    this.r = 80;
  }  
  
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 165, 0, 1)";
    ctx.fillStyle = "rgba(255, 165, 0, 1)";

    ctx.translate(this.x, this.y);
    ctx.transform(0.5, 0, 0, 1, 0, 0);
    ctx.rotate(this.angle);
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.stroke();

    this.drawBlades(ctx);

    ctx.restore();
    this.angle += this.speed;

    if(this.isOn) {
      if(this.speed < this.maxSpeed) {
        this.speed += 0.002;
      }
    } else {
      // OFF
      if(this.speed > 0) {
        this.speed -= 0.002;
      }
    }
  }
  
  drawBlades(ctx) {
    ctx.save();
    ctx.beginPath();
    var b = 5;
    while(b--) {
      this.drawBlade(ctx);
      ctx.rotate(Math.PI*2/5);
    }
    ctx.fill();
    ctx.restore();
  }
  
  drawBlade(ctx) {
    var h = (this.r - 8);
    var w = 35;

    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      0, 0, 
      -w, -h, 
      0, -h);

    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      0, 0, 
      w, -h, 
      0, -h);
  }
}

class World {
  constructor () {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.h = this.canvas.height = window.innerHeight;
    this.w = this.canvas.width = window.innerWidth;
    this.ctx.lineWidth = 1;
    
    this.bounce = 1;
    this.gravity = 0.2;
    this.fanSpeed = 0;
    this.friction = 0.99;
    this.groundFriction = 0.2;
    this.rigidness = 9;
 
    this.fan = new Fan(50, 250);
    this.points = [];
    this.sticks = [];
    this.addPointsForText();

    this.isDragging = false;
    this.dragPoint = undefined;
    this.setupEventListers();
    
    this.ctx.strokeStyle = "rgba(255, 165, 0, 0.03)";
    this.ctx.fillStyle = "rgba(255, 165, 0, 0.8)";
  }
  
  addPointsForText() {
    var text = "Fantastic!";
    this.ctx.font = "30px serif";
    var size = 4;
    var widthSoFar = 0;
    text.split("").forEach(c => {
      this.ctx.clearRect(0, 0, this.w, this.h);
      var pointsForChar = [];
      this.ctx.fillText(c, 1, 100);
      var width = 500;
      var height = 300;
      var image = this.ctx.getImageData(0, 0, width, height);
      var buffer32 = new Uint32Array(image.data.buffer);
      for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
          // The buffer is linear, y*w+x is a trick
          // to calculate the linear index.
          if (buffer32[y * width + x]) {
            // There is a pixel here, add a point
            pointsForChar.push({
              x: widthSoFar + x*size + 150,
              y: y*size - 120,
              oldx: widthSoFar + x*size + 150,
              oldy: y*size - 120
            });
          }
        }    
      }
      this.getClosestPoint({ x: 0, y: 0 }, pointsForChar).pinned = true;
      this.connectAllPoints(pointsForChar);
   
      Array.prototype.push.apply(this.points, pointsForChar);

      widthSoFar += this.ctx.measureText(c).width * size;
    });
  }
  
  connectAllPoints(points) {
    var length = points.length;
    console.log(length);
    for(var i = 0; i < length; i++) {
      this.connect(points, length, i, 1);
      this.connect(points, length, i, Math.round(length - length/9));
      this.connect(points, length, i, Math.round(length - length/7));
      this.connect(points, length, i, Math.round(length/2));
    }
  }
  
  connect(points, length, index0, offset) {
   // Using modulus to wrap around the end of the array     
    var index1 = (index0 + offset) % length;
    this.sticks.push({
      p0: points[index0],
      p1: points[index1],
      length: this.distance(
        points[index0], 
        points[index1]),
    });    
  }
  
  setupEventListers() {
    this.canvas.addEventListener(
      "mousedown",
      event => this.onMouseDown(event));
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.toggleFanButton = document.getElementById("toggleFan");
    this.toggleFanButton.addEventListener(
      "click", () => this.onToggleFanClick());
    document.getElementById("cutLoose").addEventListener(
      "click", () => this.onCutLooseClick());
  }
      
  onMouseDown(event) {
    var x = event.clientX;
    var y = event.clientY;
    // Only start dragging if clicked near a point
    var p0 = { x: x, y: y };
    var p1 = this.getClosestPoint(p0, this.points);
    var dist = this.distance(p0, p1);
    if(dist < 10) {
      this.dragPoint = p1;
      this.dragPoint.x = x;
      this.dragPoint.y = y;
      this.dragPoint.oldx = x;
      this.dragPoint.oldy = y;
      this.dragPoint.pinned = true;
      this.isDragging = true;
      this.canvas.addEventListener("mousemove", this.onMouseMove);
      this.canvas.addEventListener("mouseup", this.onMouseUp);
    }
  }
  
  onMouseMove(event) {
    this.dragPoint.oldx = this.dragPoint.x;
    this.dragPoint.oldy = this.dragPoint.y;
    this.dragPoint.x = event.clientX;
    this.dragPoint.y = event.clientY;
  }

  onMouseUp(event) {
    this.dragPoint.pinned = false;
    this.isDragging = false;
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
  }
  
  onToggleFanClick() {
    this.fan.isOn = !this.fan.isOn;
    if(this.fan.isOn) {
      this.fanSpeed = 0.4;
      this.toggleFanButton.innerHTML = "Stop Fan";
    } else {
      this.fanSpeed = 0;
      this.toggleFanButton.innerHTML = "Start Fan";
    }
  }
  
  onCutLooseClick() {
    this.points.forEach(p => p.pinned = false);
  }
  
  getClosestPoint(p0, points) {
    var index = 0;
    points.map(p1 => this.distance(p0, p1)).reduce((prev, curr, i) => {
      if(curr < prev) {
        index = i;
      }
      return Math.min(curr, prev);
    });
    return points[index];
  }
  
  distance(p0, p1) {
    var x = p1.x - p0.x;
    var y = p1.y - p0.y;
    return Math.sqrt(x*x + y*y);
  }
  
  update() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.updatePoints();
    // Increase i to make the object more stiff
    var i = this.rigidness;
    while(i--) {
      this.updateSticks();
      this.constrainPoints();
    }
    this.drawSticks();
    this.drawPoints();
    this.fan.draw(this.ctx);
  }
  
  drawPoints() {
    this.points.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  drawSticks() {
    this.ctx.beginPath();
    this.sticks.forEach(s => {
      this.ctx.moveTo(s.p0.x, s.p0.y);
      this.ctx.lineTo(s.p1.x, s.p1.y);     
    });    
    this.ctx.stroke();
  }
  
  updatePoints() {
    this.points.forEach(p => {
      if(!p.pinned) {
        var vx = (p.x - p.oldx) * this.friction;
        var vy = (p.y - p.oldy) * this.friction;
        p.oldx = p.x;
        p.oldy = p.y;
        if(p.y > this.h - 1) {
          vx *= this.groundFriction = 0.2;
        }
        p.x += vx;
        p.x += this.fanSpeed;
        p.y += vy;
        p.y += this.gravity;
      }
    });
  }
  
  updateSticks() {
    this.sticks.forEach(s => {
      var dx = s.p1.x - s.p0.x;
      var dy = s.p1.y - s.p0.y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      var diff = s.length - dist;
      var percent = diff / dist / 2;
      var offsetX = dx * percent;
      var offsetY = dy * percent;
      if(!s.p0.pinned) {
        s.p0.x -= offsetX;
        s.p0.y -= offsetY;
      }
      if(!s.p1.pinned) {
        s.p1.x += offsetX;
        s.p1.y += offsetY;
      }
    });
  }
  
  constrainPoints() {
    this.points.forEach(p => {
      if(!p.pinned) {
        var vx = (p.x - p.oldx) * this.friction;
        var vy = (p.y - p.oldy) * this.friction;
        if(p.x > this.w) {
          p.x = this.w;
          p.oldx = p.x + vx * this.bounce;
        }
        if(p.x < 0) {
          p.x = 0;
          p.oldx = vx * this.bounce;
        }
        if(p.y > this.h) {
          p.y = this.h;
          p.oldy = p.y + vy * this.bounce;
        }
        if(p.y < 0) {
          p.y = 0;
          p.oldy = vy * this.bounce;
        }
      }
    });
  }  
}

var world = new World();

function animate() {  
  world.update();
  requestAnimationFrame(animate);
}

animate();