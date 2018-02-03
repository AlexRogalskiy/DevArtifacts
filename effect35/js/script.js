var Arm = Arm || {
  x: 0,
  y: 0,
  length: 100,
  angle: 0,
  parent: null,

  create: function(x, y, length, angle) {
    var obj = Object.create(this);
    obj.init(x, y, length, angle);
    return obj;
  },

  init: function(x, y, length, angle) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
  },

  getEndX: function() {
    var angle = this.angle,
      parent = this.parent;
    while (parent) {
      angle += parent.angle;
      parent = parent.parent;
    }
    return this.x + Math.cos(angle) * this.length;
  },

  getEndY: function() {
    var angle = this.angle,
      parent = this.parent;
    while (parent) {
      angle += parent.angle;
      parent = parent.parent;
    }
    return this.y + Math.sin(angle) * this.length;
  },

  render: function(context) {
    context.strokeStyle = "#aef3ee";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.getEndX(), this.getEndY());
    context.stroke();
  }
};

window.onload = function() {
  var canvas = document.getElementById("canvas"),
    canvas2 = document.getElementById("canvas2"),
    context = canvas.getContext("2d"),
    context2 = canvas2.getContext("2d"),
    width = (canvas.width = canvas2.width = window.innerWidth),
    height = (canvas.height = canvas2.height = window.innerHeight),
    drawing = false;
  context2.fillStyle = "#010101";
  context2.fillRect(0, 0, width, width);
  context2.strokeStyle = "#feefee";
  
  

  var param = {
    drawSpeed: 30,
    rewind: false,
    lineWidth: 0.3,
    running: true,
    'pause/run': function() {
      param.running = !(param.running);
      if(param.running) update();
    },
    clear: function() {
      context2.fillStyle = "#010101";
      context2.fillRect(0, 0, width, width);
    }
  };
  var gui = new dat.GUI();
  gui.add(param, "drawSpeed", 0, 500);
  gui.add(param, "rewind");
  gui.add(param, "lineWidth", 0, 5);
  gui.add(param, "pause/run");
  gui.add(param, "clear");

  var arm = Arm.create(width / 2, height / 2, 61, 0),
    angle = 0,
    arm2 = Arm.create(arm.getEndX(), arm.getEndY(), 83, 0),
    arm3 = Arm.create(arm2.getEndX(), arm2.getEndY(), 71, 0);

  arm2.parent = arm;
  arm3.parent = arm2;

  var lastFrameTime = window.performance.now();
  update();
  drawing = true;
  function update() {
    if(param.running) {
      requestAnimationFrame(update);
    }
    var t = window.performance.now();
    var deltaT = t - lastFrameTime;
    lastFrameTime = t;

    
    context2.lineWidth = param.lineWidth;
    context2.strokeStyle = '#fff';
    if (drawing) {
      context2.beginPath();
      context2.moveTo(arm3.getEndX(), arm3.getEndY());
    }

    context.clearRect(0, 0, width, height);
    arm.angle = Math.sin(angle) * 2.476;
    arm2.angle = Math.cos(angle * 0.5 + 2) * 2.12;
    arm3.angle = Math.sin(angle * 1.498 - 0.5) * 2.34;
    arm2.x = arm.getEndX();
    arm2.y = arm.getEndY();
    arm3.x = arm2.getEndX();
    arm3.y = arm2.getEndY();
    angle += param.drawSpeed / 10000  * (param.rewind ? -1 : 1) * deltaT ;
    arm.render(context);
    arm2.render(context);
    arm3.render(context);

    if (drawing) {
      context2.lineTo(arm3.getEndX(), arm3.getEndY());
      context2.stroke();
    }
  }
};
