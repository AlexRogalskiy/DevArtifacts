// ///////////////////////////////////////////////////////////
// Particle
// ///////////////////////////////////////////////////////////
var Particle = function(stageConfig, particleConfig) {
  this.stageConfig = stageConfig;
  this.particleConfig = particleConfig;
};

var pProto = Particle.prototype;

pProto.draw = function() {
  this.stageConfig.context.fillStyle = "#FEF1C4";
  this.stageConfig.context.beginPath();
  this.stageConfig.context.arc(this.particleConfig.x, this.particleConfig.y, this.particleConfig.r, 0, Math.PI * 2, false);
  this.stageConfig.context.fill();
};

// ///////////////////////////////////////////////////////////
// ParticlesView
// ///////////////////////////////////////////////////////////
var ParticlesView = function() {
  this.init();
};

var proto = ParticlesView.prototype;

proto.init = function() {
  this
    .setupHandlers()  
    .layout()
    .createParticls()
    .render();
};

proto.setupHandlers = function() {
  this.renderHandler = this.render.bind(this);
  
  return this;
};

proto.layout = function() {
  var stage = document.createElement('canvas');
  stage.width = window.innerWidth;
  stage.height = window.innerHeight;
  var context = stage.getContext('2d');
  var centerX = stage.width / 2;
  var centerY = stage.height / 2;
  
  this.stageConfig = {
    stage: stage,
    context: context,
    centerX: centerX,
    centerY: centerY
  };
  
  document.body.appendChild(this.stageConfig.stage);
  this.particleStore = [];
  
  return this;
};

proto.createParticls = function() {
  var i = 0;
  var l = 120;
  for(; i < l; i++) {
    this.particleStore.push({
      x: 0,
      y: 0,
      r: Math.random() * 5,
      angleX: Math.random() * 360,
      angleY: Math.random() * 360,
      speedX: (Math.random() * 0.01) - (0.1 / 2),
      speedY: (Math.random() * 0.01) - (0.01 / 2),
      radX: Math.random() * this.stageConfig.centerX,
      radY: Math.random() * this.stageConfig.centerY
    });
  }
  
  return this;
};

proto.render = function() {
  this.update();
  this.draw();
  window.requestAnimationFrame(this.renderHandler);  
};

proto.update = function() {
  var i = 0;
  var l = this.particleStore.length;
  for(; i < l; i++) {    
    this.particleStore[i].x = this.stageConfig.centerX + Math.cos(this.particleStore[i].angleX) * this.particleStore[i].radX;
    this.particleStore[i].y = this.stageConfig.centerY + Math.sin(this.particleStore[i].angleY) * this.particleStore[i].radY;
    this.particleStore[i].angleX += this.particleStore[i].speedX;
    this.particleStore[i].angleY += this.particleStore[i].speedY;
  }
};

proto.draw = function() {
  this.stageConfig.context.clearRect(0, 0, this.stageConfig.stage.width, this.stageConfig.stage.height);
  var i = 0;
  var l = this.particleStore.length;
  for(; i < l; i++) {
    var p = new Particle(this.stageConfig, this.particleStore[i]); 
    p.draw();
  }    
};

new ParticlesView();






















