console.clear();

class SpatialHash {
  
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.reset();
  }
  
  reset() {
    this.cells = {};
  }
  
  key(point) {
    let x = math.floor(point.x / this.cellSize);
    let y = math.floor(point.y / this.cellSize);
    return `${x}-${y}`;
  }
  
  insert(point) {
    let key = this.key(point);
    let cell = this.cells[key];
    if(!cell) {
      cell = this.cells[key] = {};
      cell.x = math.floor(point.x / this.cellSize);
      cell.y = math.floor(point.y / this.cellSize);
      cell.alpha = 0;
      cell.alphaTarget = 0;
      cell.items = [];
    }
    cell.items.push(point);
  }
  
  remove(point, last) {
    let cell = null;
    let key = null;
    if(last) {
      cell = this.cells[last];
    } else {
      key = this.key(point);
      cell = this.cells[key];
    }
    if(cell) {
      let index = fast.indexOf(cell.items, point);
      if(index !== -1) {
        cell.items.splice(index, 1);
      }
    }
  }
  
}

class Point {
 
  constructor(demo, ctx) {
    this.guid = demo.guid++;
    this.demo = demo;
    this.ctx = demo.ctx;
    this.x = Calc.rand(0, this.demo.width);
    this.y = Calc.rand(0, this.demo.height);
    this.vx = Calc.rand(-1, 1);
    this.vy = Calc.rand(-1, 1);
    this.radius = 1;
    this.demo.sh.insert(this);
    this.hash = this.demo.sh.key(this);
    this.lastHash = this.hash;
    this.thresh = math.pow(this.demo.sh.cellSize, 2);
    this.compareList = [];
    this.scale = 1;
    this.scaleTarget = 1;
  }
  
  compareOther(other) {
    if(fast.indexOf(this.compareList, other.guid) > -1 || fast.indexOf(other.compareList, this.guid) > -1) {
      return false;
    }
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let dist = dx * dx + dy * dy;
    if(dist < this.thresh) {
      let angle = math.atan2(dy, dx);
      let cos = math.cos(angle);
      let sin = math.sin(angle);
      let mag = (this.thresh - dist) * 0.0001;
      this.vx -= cos * mag;
      this.vy -= sin * mag;
      other.vx += cos * mag;
      other.vy += sin * mag;
    }
    this.compareList.push(other.guid);
    other.compareList.push(this.guid);
  }
  
  compareMouse() {
    let dx = this.demo.mouse.x - this.x;
    let dy = this.demo.mouse.y - this.y;
    let dist = dx * dx + dy * dy;
    let thresh = this.thresh * 3;
    this.scaleTarget = 1;
    if(dist < thresh) {
      let angle = math.atan2(dy, dx);
      let mag = (thresh - dist) * 0.0003;
      this.vx -= math.cos(angle) * mag;
      this.vy -= math.sin(angle) * mag;
      this.scaleTarget = 1 + (thresh - dist) * 0.009;
    }
  }
  
  preupdate() {
    this.inRange = false;
    this.compareList.length = 0;
  }
  
  update(iMax) {
    this.hash = this.demo.sh.key(this);
    if(this.hash != this.lastHash) {
      this.demo.sh.remove(this, this.lastHash);
      this.demo.sh.insert(this);
    }
    
    this.vx += (this.demo.mouse.x - this.demo.width / 2) * 0.0009;
    this.vy += (this.demo.mouse.y - this.demo.height / 2) * 0.0009;
    
    this.compareMouse();
    
    if(this.vx > 0.5) {
      this.vx *= 0.95;
    }
    if(this.vx < -0.5) {
      this.vx *= 0.95;
    }
    if(this.vy > 0.5) {
      this.vy *= 0.95;
    }
    if(this.vy < -0.5) {
      this.vy *= 0.95;
    }
    
    this.x += this.vx * this.demo.dt;
    this.y += this.vy * this.demo.dt;
    
    if(this.x >= this.demo.width - this.radius) {
      this.x = this.demo.width - this.radius;
      this.vx -= 1; 
    }
    if(this.x <= this.radius) {
      this.x = this.radius;
      this.vx += 1;
    }
    if(this.y >= this.demo.height - this.radius) {
      this.y = this.demo.height - this.radius;
      this.vy -= 1; 
    }
    if(this.y <= this.radius) {
      this.y = this.radius
      this.vy += 1;  
    }
    
    this.lastHash = this.hash;
    
    this.scale += (this.scaleTarget - this.scale) * 0.1;
  }
  
  render() {
    this.demo.ctx.fillStyle = `hsla(${this.demo.hue + this.y * 0.15 + this.x * 0.15}, 80%, 50%, 1)`;
    this.demo.ctx.beginPath();
    this.demo.ctx.arc(this.x, this.y, this.radius * this.scale, 0, Math.PI * 2);
    this.demo.ctx.fill();
  }
  
}

class Demo {
  
  constructor() {
    this.guid = 0;
    this.currTime = Date.now();
    this.lastTime = this.currTime;
    this.dt = 1;
    this.setupCanvas();
    this.setupHash();
    
    this.points = [];
    this.combined = [];
    this.mouse = {
      x: 0,
      y: 0
    };
    this.hue = 160;
    
    this.capturer = new CCapture( { 
      verbose: true, 
      framerate: 60,
      //motionBlurFrames: 12,
      quality: 100,
      format: 'webm',
      workersPath: 'js/'
    });
    this.capturing = false;
    
    this.reset();
    this.loop();
    
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMousemove(e));
    window.addEventListener('keydown', (e) => this.onKeydown(e));
  }
  
  setupCanvas() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }
  
  setupHash() {
    this.sh = new SpatialHash(30);
  }
  
  reset() {
    this.points = [];
    this.sh.reset();
    this.onResize();
    
    for(let i = 0; i < 300; i++) {
      let point = new Point(this);
      this.points.push(point);
    }
  }
  
  onResize() {
    this.width = 300;
    this.height = 300;
    this.dpr = window.devicePixelRatio;
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
    
    this.bcr = this.canvas.getBoundingClientRect();
    this.mouse.x = this.width / 2;
    this.mouse.y = this.height / 2;
  }
  
  onMousemove(e) {
    this.mouse.x = Calc.clamp(e.pageX - this.bcr.left, 0, this.width - 1);
    this.mouse.y = Calc.clamp(e.pageY - this.bcr.top, 0, this.height - 1);
  }
  
  onKeydown(e) {
    if(e.which === 82) {
      //this.toggleCapture(); 
    }
  }
  
  toggleCapture() {
    if(this.capturing) {
      this.capturer.stop();
      this.capturer.save();
      this.capturing = false;  
    } else {
      this.capturer.start();
      this.capturing = true;
    }
  }
  
  preupdate() {
    let i = this.points.length;
    while(i--) {
      let point = this.points[i];
      point.preupdate(i);
    }
  }
  
  update() {
    this.hue += 0.5;
    
    for(let key in this.sh.cells) {
      this.combined.length = 0;
      let cell = this.sh.cells[key];
      cell && this.combined.push(...cell.items);
      let cellNW = this.sh.cells[`${cell.x - 1}-${cell.y - 1}`];
      cellNW && this.combined.push(...cellNW.items);
      let cellN = this.sh.cells[`${cell.x}-${cell.y - 1}`];
      cellN && this.combined.push(...cellN.items);
      let cellNE = this.sh.cells[`${cell.x + 1}-${cell.y - 1}`];
      cellNE && this.combined.push(...cellNE.items);
      let cellW = this.sh.cells[`${cell.x - 1}-${cell.y}`];
      cellW && this.combined.push(...cellW.items);
      let cellE = this.sh.cells[`${cell.x + 1}-${cell.y}`];
      cellE && this.combined.push(...cellE.items);
      let cellSW = this.sh.cells[`${cell.x - 1}-${cell.y + 1}`];
      cellSW && this.combined.push(...cellSW.items);
      let cellS = this.sh.cells[`${cell.x}-${cell.y + 1}`];
      cellS && this.combined.push(...cellS.items);
      let cellSE = this.sh.cells[`${cell.x + 1}-${cell.y + 1}`];
      cellSE && this.combined.push(...cellSE.items);
      let j = this.combined.length;
      while(j--) {
        let item = this.combined[j];
        let k = j;
        while(k--) {
          let other = this.combined[k];
          item.compareOther(other);
        }
      }
    }
    
    let i = this.points.length;
    while(i--) {
      let point = this.points[i];
      point.update(i);
    }
  }
  
  render() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = 'hsla(0, 0%, 5%, 1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.globalCompositeOperation = 'lighter';
    
    this.ctx.beginPath();
    for(let x = 0; x < this.width; x += this.sh.cellSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for(let y = 0; y < this.height; y += this.sh.cellSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }
    this.ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.05)';
    this.ctx.stroke();
    
    let mxc = math.floor(this.mouse.x / this.sh.cellSize);
    let myc = math.floor(this.mouse.y / this.sh.cellSize);
    
    for(let key in this.sh.cells) {
      let cell = this.sh.cells[key];
      let length = cell.items.length;
      cell.alphaTarget = length * 0.04;
      let b = 50;
      let s = 70;
      if(cell.x === mxc && cell.y == myc) {
        b = 70;
        s = 100;
        cell.alphaTarget = 1;
        cell.alpha = 1;
      }
      cell.alpha += (cell.alphaTarget - cell.alpha) * 0.1;
      this.ctx.fillStyle = `hsla(${this.hue + cell.y * this.sh.cellSize * 0.15 + cell.x * this.sh.cellSize * 0.15}, ${s}%, ${b}%, ${cell.alpha})`;
      this.ctx.fillRect(cell.x * this.sh.cellSize, cell.y  * this.sh.cellSize, this.sh.cellSize, this.sh.cellSize);
    }
    
    // draw points
    let i = this.points.length;
    while(i--) {
      let point = this.points[i];
      point.render();
    }
    
    if(this.capturing) {
      this.capturer.capture(this.canvas); 
    }
  }
  
  loop() {
    this.currTime = Date.now();
    if(this.oldTime) {
      this.dt = (this.currTime - this.oldTime) / (1000 / 60);
    }
    this.oldTime = this.currTime;
    this.preupdate();
    this.update();
    this.render();
    window.requestAnimationFrame(() => this.loop()); 
  }
}

let demo = new Demo();