const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cw = (canvas.width = 500);
const ch = (canvas.height = 400);
const rad = Math.PI / 180;
ctx.lineWidth = 0.5;
ctx.lineJoin = "round";

let shapes = [];

let m = { x: 200, y: 200 };
const fl = 300; // focal length 200 - 300
let vp = { x: cw / 2, y: ch / 8 }; // vanishing point

let vertices = 3; //triangles
let numShapes = 720;//total number of triangles
let increment = 2 * Math.PI / numShapes;
let R = 130; // wreath's radius
let r = 40; //shape's radius

class Shape {
  constructor(points, beta) {
    this.points = points;
    this.beta = beta;
    //this.delta = this.beta*3;
    this.stroke = "hsl(" + beta + ",90%,70%)";
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.points[0]._2d.x, this.points[0]._2d.y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i]._2d.x, this.points[i]._2d.y);
    }
    ctx.closePath();
    ctx.strokeStyle = this.stroke;
    ctx.stroke();
  }

  update(ax, ay) {
    this.points.map(p => {
      p.update(ax, ay);
    });
  }

  getDepth() {
    //to determine the order that each triangle is drawn.
    return Math.min(
      this.points[0]._3d.z,
      this.points[1]._3d.z,
      this.points[2]._3d.z
    );
  }
}

class Dot3d {
  constructor(x, y, z) {
    this._2d = { x: 0, y: 0 };
    this._3d = { x, y, z };

    this.r = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.visible = true;
    this.setPerspective();
  }

  draw() {
    ctx.save();
    ctx.translate(this._2d.x, this._2d.y);
    //ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);

    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }

  rotateX(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let y1 = this._3d.y * cos - this._3d.z * sin;
    let z1 = this._3d.z * cos + this._3d.y * sin;
    this._3d.y = y1;
    this._3d.z = z1;
  }

  rotateY(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let x1 = this._3d.x * cos - this._3d.z * sin;
    let z1 = this._3d.z * cos + this._3d.x * sin;
    this._3d.x = x1;
    this._3d.z = z1;
  }

  setPerspective() {
    if (this._3d.z > -fl) {
      let scale = fl / (fl + this._3d.z);
      this.scaleX = this.scaleY = scale;
      this._2d.x = vp.x + this._3d.x * scale;
      this._2d.y = vp.y + this._3d.y * scale;
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  update(ax, ay) {
    this.rotateX(ax);
    this.rotateY(ay);
    this.setPerspective();
  }
}

for (let beta = 0; beta <= 2 * Math.PI; beta += increment) {
  //Triangle's center
  let x = R * Math.cos(beta);
  let y = 0;
  let z = R * Math.sin(beta);

  let delta = beta * 3; //triangle's rotation

  let sry = [];// the array of the points if the triangle

  for (let angle = 0; angle < 2 * Math.PI; angle += 2 * Math.PI / vertices) {
    let cos = r * Math.cos(angle + delta);
    let sin = r * Math.sin(angle + delta);
    sry.push(
      new Dot3d(
        (R + cos) * Math.cos(beta), //x
        R + sin, //y
        (R + cos) * Math.sin(beta) //z
      )
    );
  }

  shapes.push(new Shape(sry, beta / rad));
}

//shapes.map((s,i) =>{if(i%6 == 0){s.stroke = "red"}})

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  ctx.clearRect(0, 0, cw, ch);

  let ay = (m.x - vp.x) * 0.0001;
  let ax = 0; // (m.y - vp.y)*.0001;

  shapes.sort(depth);

  shapes.map(s => {
    s.update(ax, ay);
    s.draw();
  });
}

Draw();

// used to sort triangles by depth
function depth(triangle_1, triangle_2) {
  return triangle_1.getDepth() - triangle_1.getDepth();
}

function oMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(evt.clientX - rect.left),
    y: Math.round(evt.clientY - rect.top)
  };
}

canvas.addEventListener(
  "mousemove",
  function(evt) {
    m = oMousePos(canvas, evt);
  },
  false
);

function depth(triangle_1, triangle_2) {
  return triangle_2.getDepth() - triangle_1.getDepth();
}
