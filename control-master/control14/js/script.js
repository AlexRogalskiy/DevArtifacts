var SVG_NS = "http://www.w3.org/2000/svg";
let rid = null;
let m = {};// mouse


class optionsSlider{
  constructor(parent){
    
    this.parent = parent;
    this.thumb = this.parent.querySelector(".thumb");
    this.track = this.parent.querySelector(".track");
    this.fillLower = this.parent.querySelector(".fillLower");
    this.scale = this.parent.querySelector(".scale");
    this.draggable = false;
    this.spring = 0.2;
    this.friction = 0.76;
    this.deltaX = 0;// distance between mouse & the center of the thumb
    this.cx = 25;// center of the thumb
    this.startX = this.track.getAttribute("x");
    this.vel = 0;
    this.points = [];
    this.getPointsArray();
    this.addEvents();
    

  }
  
  getTarget() {
  let maxDist = 40;
  let nearest = false;
  for (let i = 0; i < this.points.length; i++) {
    if (this.points[i] - this.cx < maxDist) {
      nearest = this.points[i];
      maxDist = this.cx - this.points[i];
    }
  }
  this.target = nearest;
}

  updatePos() {
  this.getTarget()
  let dist = this.target - this.cx; 
  let acc = dist * this.spring;
  this.vel += acc;
  this.vel *= this.friction;
  this.cx += this.vel; //console.log(this.cx)
  this.thumb.setAttributeNS(null, "cx", this.cx);
  this.fillLower.setAttributeNS(null, "width", this.cx - this.startX);
}
                                
                                
  getPointsArray(){
    let n = 20;
    for (let i = 0; i <= 100; i += n) {
    let x = map(i, 0, 100, 5, 45);
    this.points.push(x);
    drawElmt({ x1: x, y1: 9, x2: x, y2: 11 }, "line", this.scale);
    let newText = drawElmt({ x: x, y: 7 }, "text", this.scale);
    newText.textContent = i / n;
    }
  }
  
  addEvents(){
    let _this = this;
    this.thumb.addEventListener("mousedown", function(e) {
    _this.draggable = true;
    m = oMousePosSVG(e);
    _this.deltaX = this.getAttribute("cx") - m.x;
      console.log(_this.deltaX)
    });
    
    this.parent.addEventListener("mouseup", function(){
    _this.draggable = false;});
    
    this.parent.addEventListener("mousemove", function(e) {
  
    m = oMousePosSVG(e); //console.log(m.x)
  
    if (_this.draggable == true) {
    _this.cx = m.x + _this.deltaX;
    if (_this.cx > 45) {
      _this.cx = 45;
    }
    if (_this.cx < 5) {
      _this.cx = 5;
    }

    _this.thumb.setAttributeNS(null, "cx", _this.cx);
    _this.fillLower.setAttributeNS(null, "width", _this.cx - _this.startX);
      }
      });
    
    this.parent.addEventListener("mouseleave", function(e) {
    _this.draggable = false;});
  }
  
 
}


let sliders = [];


sliders.push(new optionsSlider(svg));
//sliders.push(new optionsSlider(svg1));



function Frame() {
  rid = window.requestAnimationFrame(Frame);
  
    sliders.map((s) =>{
      if (s.draggable == false) {
      s.updatePos();
      }
    })
}
Frame();



//useful
function oMousePosSVG(e) {
  let p = svg.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  let ctm = svg.getScreenCTM().inverse();
  p = p.matrixTransform(ctm);
  return p;
}

function drawElmt(o, tagname, parent) {
  var elmt = document.createElementNS(SVG_NS, tagname);
  for (var name in o) {
    if (o.hasOwnProperty(name)) {
      elmt.setAttributeNS(null, name, o[name]);
    }
  }
  parent.appendChild(elmt);
  return elmt;
}

function map(n, a, b, _a, _b) {
  let d = b - a;
  let _d = _b - _a;
  let u = _d / d;
  return _a + n * u;
}