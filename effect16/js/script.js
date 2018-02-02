const rad = Math.PI / 180;
let requestId = null;
let stop = false;
const svg = document.querySelector("svg");
const g = document.querySelector("g");

const TIME = "16:07:50";
// counters
let h = parseInt(TIME.split(":")[0]);
let m = h * 60 + parseInt(TIME.split(":")[1]);
let s = h * 60 * 60 + m * 60 + parseInt(TIME.split(":")[2]);
//data
let circles = {
  s: {
    path: secondsPath,
    divisions: 60,
    r: secondsCirc.getAttribute("r"),
    stroke: "#1ed5f6",
    start: (parseInt(TIME.split(":")[2]))%60
  },
  m: {
    path: minPath,
    divisions: 60,
    r: minCirc.getAttribute("r"),
    stroke: "#f61ed5",
    start: (parseInt(TIME.split(":")[1]))%60
  },
  h: {
    path: hoursPath,
    divisions: 24,
    r: hoursCirc.getAttribute("r"),
    stroke: "#d5f61e",
    start: (parseInt(TIME.split(":")[0]))%24
  }
};

let translation = { x: 25, y: 25 }; //translate
let rotation = -90;
let rot = -(rotation * rad);
g.setAttributeNS(
  null,
  "transform",
  `translate(${translation.x} ${translation.y}) rotate(${rotation})`
);

const spring = 0.09;
const friction = 0.8;

class Clock {
  constructor(o) {
    this.path = o.path;
    this.divisions = o.divisions; //24 || 60
    this.R = o.r;
    this.start = o.start;
    this.strokeDashoffset = 0;
    this.definePath(this.path);
    this.vel = 0;
  }

  update(time) {
    let t = time % this.divisions;

    this.strokeLength = this.target;
    this.target = t * this.pathLength / this.divisions;

    if (this.pathLength - this.strokeLength <= this.delta) {
      this.strokeDashoffset += this.pathLength;
      this.strokeLength = 0.1;
    }
  }

  updateStrokeLength() {
    this.dist = this.target - this.strokeLength;
    this.acc = this.dist * spring;
    this.vel += this.acc;
    this.vel *= friction;
    this.strokeLength += this.vel;
    this.path.style.strokeDasharray = `${this.strokeLength},${this.pathLength -
      this.strokeLength}`;
    this.path.style.strokeDashoffset = this.strokeDashoffset;
   
  }

  definePath() {
    let d =
      "M" +
      this.R +
      "," +
      0 +
      "  A" +
      this.R +
      "," +
      this.R +
      " 0 " +
      1 +
      "," +
      1 +
      this.R +
      "," +
      -1 +
      "z";
    //y-1: the circles are rotated 90 degs

    this.path.setAttributeNS(null, "d", d);
    this.pathLength = this.path.getTotalLength();
    this.delta = this.pathLength / this.divisions;
    this.strokeLength = this.start * this.delta;
    this.target = this.strokeLength;
    this.path.style.strokeDasharray = `${this.strokeLength},${this.pathLength -
      this.strokeLength}`;
    this.path.style.strokeDashoffset = this.strokeDashoffset;
  }
}

let secondsTrack = new Clock(circles.s);
let minTrack = new Clock(circles.m);
let hoursTrack = new Clock(circles.h);

let sid = setInterval(setCron, 1000);

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function setText(h, m, s) {
  text.textContent =
    addZero(h % 24) + ":" + addZero(m % 60) + ":" + addZero(s % 60);
}

setText(h, m, s);

function Animation() {
  requestId = window.requestAnimationFrame(Animation);
  secondsTrack.updateStrokeLength();
  minTrack.updateStrokeLength();
  hoursTrack.updateStrokeLength();
}
Animation();



reset.addEventListener("click",resetCron,false);

function resetCron(){
secondsTrack = new Clock(circles.s);
minTrack = new Clock(circles.m);
hoursTrack = new Clock(circles.h);
  
h = parseInt(TIME.split(":")[0]);
m = h * 60 + parseInt(TIME.split(":")[1]);
s = h * 60 * 60 + m * 60 + parseInt(TIME.split(":")[2]);
  
setText(h, m, s);
}
function setCron() {
  secondsTrack.update(s);
  if (s % 60 == 0) {
    minTrack.update(m);
  }
  if (s % (60 * 60) == 0) {
    hoursTrack.update(h);
  }

  setText(h, m, s);

  s++;
  if (s % 60 == 0) {
    m++;
  }
  if (s % (60 * 60) == 0) {
    h++;
  }
}

toggle.addEventListener("click",function(){

  if(stop) {
    stop = false;
    toggle.textContent = "STOP";
    sid = setInterval(setCron, 1000);
    
  }else{
    stop = true;
    toggle.textContent ="GO"; 
    clearInterval(sid); 
  }
},false);


