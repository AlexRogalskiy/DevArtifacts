let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const textures = [];
const sparkles = [];
let nSparkles = 0;
let toLaunch = 0;
const spread = 200;
const startX = -200;
const startY = windowHeight + 350;
const maxD = Math.sqrt((startX - startX+spread)*(startX - startX+spread) + (startY - startY+spread)*(startY - startY+spread));

// init stage
const renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight, { 
  backgroundColor : 0x111111 
});
document.body.appendChild(renderer.view);
const stage = new PIXI.Container();
const container = new PIXI.Container();
stage.addChild(container);
container.x = 0;
container.y = 0;

const initTextures = () => {
  for (var i = 0; i < 10; i++) {
    textures.push(PIXI.Texture.fromImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-' + i + '.png'));
  }
}

class Spark {
  constructor(texture, scale) {
    this.sprite = PIXI.Sprite.from(texture);
    this.vel = { x: 0, y: 0 };
    this.sprite.x = -20;
    this.sprite.y = -20;
    this.sprite.width = scale * 15;
    this.sprite.height = scale * 15;
    this.rebounded = false;
    container.addChild(this.sprite);
  }
  
  update() {
    this.sprite.x += this.vel.x;
    this.sprite.y += this.vel.y;
    if (this.sprite.x > windowWidth/2 && !this.rebounded) {
      this.rebounded = true;
      this.vel.y = Math.random();
      this.vel.x = Math.random()*-1;
      launchRebounds(this.sprite.x, this.sprite.y, this.sprite.texture);
    }
    if (this.rebounded) {
      this.sprite.alpha -= 0.004;
    }
  }
}

const initSparkles = () => {
  const n = windowWidth*7;
  for (var i = 0; i < n; i++) {
    const sparkle = new Spark(textures[0], Math.random());
    sparkles.push(sparkle);
  }
  nSparkles = n;
}

const getSparkle = () => {
  toLaunch++;
  if (toLaunch === nSparkles-1) toLaunch = 0;
  return sparkles[toLaunch];
}

const launchSparkle = () => {
  const sparkle = getSparkle();
  const x = startX + Math.random() * spread;
  const y = startY + Math.random() * spread;
  const d = Math.sqrt((startX - x)*(startX - x) + (startY - y)*(startY - y));
  sparkle.sprite.texture = textures[Math.floor(d/maxD*10)];
  sparkle.vel.x = 0.9 + Math.random() * 0.2;
  sparkle.vel.y = -0.9 + Math.random() * -0.2;
  sparkle.sprite.x = x;
  sparkle.sprite.y = y;
  sparkle.rebounded = false;
  sparkle.sprite.alpha = 0.5+Math.random()*0.5;
}

const launchRebounds = (x, y, texture) => {
  for (var i = 0; i < 3; i++) {
    const sparkle = getSparkle();
    sparkle.sprite.texture = texture;
    sparkle.vel.x = Math.random()*-1;
    sparkle.vel.y = Math.random()*1;
    sparkle.sprite.x = x;
    sparkle.sprite.y = y;
    sparkle.rebounded = true;
    sparkle.sprite.alpha = 0.5+Math.random()*0.5;
  }
}

const animate = () => {
  for (var s = 0; s < 3; s ++) {
    launchSparkle();
  }
  
  for (var i = 0; i < nSparkles; i++) {
    sparkles[i].update();
  }
  renderer.render(stage);
  requestAnimationFrame(animate);
}

const resize = () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  renderer.view.style.width = windowWidth + 'px';
  renderer.view.style.height = windowHeight + 'px';
  renderer.resize(windowWidth, windowHeight)
};

initTextures();
initSparkles();
requestAnimationFrame(animate);
window.addEventListener('resize', resize);