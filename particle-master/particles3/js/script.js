// see https://nextparticle.nextco.de for more informations

var nextParticle = new NextParticle(document.all.logo);
nextParticle.particleGap = 2;
nextParticle.noise = 30;
nextParticle.mouseForce = 30;
nextParticle.size = Math.max(window.innerWidth, window.innerHeight);
nextParticle.colorize = false;
nextParticle.tint = '#FF00FF';
nextParticle.minWidth = nextParticle.size;
nextParticle.minHeight = nextParticle.size;
nextParticle.maxWidth = nextParticle.size;
nextParticle.maxHeight = nextParticle.size;

var redraw = function() {
  nextParticle.initPosition = "none";
  nextParticle.initDirection = "none";
  nextParticle.fadePostion = "none";
  nextParticle.fadeDirection = "none";
  nextParticle.minWidth = nextParticle.size;
  nextParticle.minHeight = nextParticle.size;
  nextParticle.maxWidth = nextParticle.size;
  nextParticle.maxHeight = nextParticle.size;
  nextParticle.color = nextParticle.colorize ? nextParticle.tint : '';
  nextParticle.start();
};

var gui = new dat.GUI();
gui.add(nextParticle, "particleGap", 1, 10, 1).onChange(redraw);
gui.add(nextParticle, "noise", 0, 200, 1).onChange(redraw);
gui.add(nextParticle, "mouseForce", -200, 200, 1).onChange(redraw);
gui.add(nextParticle, "size", 100, 800, 1).onChange(redraw);
gui.add(nextParticle, "colorize").onChange(redraw);
gui.addColor(nextParticle, "tint").onChange(redraw);

if (window.innerWidth < 1000) {
  gui.close();
}

window.onresize(function() {
  nextParticle.width = window.innerWidth;
  nextParticle.height = window.innerHeight;
  redraw();
});
