let width = window.innerWidth;
let height = window.innerHeight;
let mouse = [width / 2, height / 2];
let time = 0.0;
const data = {
  sprites: [],
  links: []
};

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent);

const numberOfItems = isMobile ? 500 : 1500;
let globalDragging = false;

const app = new PIXI.Application(width, height, { antialias: true });
app.renderer.backgroundColor = 0x212121;
document.body.appendChild(app.view);

const viewport = new PIXI.extras.Viewport({
  screenWidth: width,
  screenHeight: height,
  worldWidth: width,
  worldHeight: height
});

viewport.wheel().drag().decelerate();
app.stage.addChild(viewport);

const advancedBloomFilter = new PIXI.filters.AdvancedBloomFilter({
  treshold: 1.0, // default 0.5,
  brightness: 4.0, // default 1.0
  bloomScale: 2.0, // default 1.0
  quality: 4, // default 4
  blur: 4 // default 2
});
const crtFilter = new PIXI.filters.CRTFilter({
  curvature: 5,
  lineWidth: 1.0, // default 1.0
  lineContrast: 1.0,
  vignetting: 0.3, // default 0.3
  noise: 0.1,
  noiseSize: 7
});

app.stage.filters = [advancedBloomFilter, crtFilter];

function makeParicleTexture(props) {
  const gfx = new PIXI.Graphics();
  gfx.beginFill(props.fill);
  gfx.lineStyle(props.strokeWidth, props.stroke);
  gfx.moveTo(props.strokeWidth, props.strokeWidth);
  gfx.lineTo(props.size - props.strokeWidth, props.strokeWidth);
  gfx.lineTo(props.size - props.strokeWidth, props.size - props.strokeWidth);
  gfx.lineTo(props.strokeWidth, props.size - props.strokeWidth);
  gfx.lineTo(props.strokeWidth, props.strokeWidth);
  gfx.endFill();

  const texture = app.renderer.generateTexture(gfx, PIXI.SCALE_MODES.LINEAR, 2);

  return texture;
}

const texture = makeParicleTexture({
  fill: 0xd30000,
  stroke: 0xffffff,
  strokeWidth: 1,
  size: isMobile ? 16 : 8
});

const textureHover = makeParicleTexture({
  fill: 0xffffff,
  stroke: 0xffffff,
  strokeWidth: 1,
  size: isMobile ? 20 : 10
});

const linksGraphics = new PIXI.Graphics();
viewport.addChild(linksGraphics);

function makeSprites(numberOfItems) {
  const sprites = [];
  for (let i = 0; i < numberOfItems; i++) {
    const sprite = new PIXI.Sprite(texture);
    sprite.x = Math.random() * width;
    sprite.y = Math.random() * height;
    sprite.radius = 10;
    sprite.index = i;
    sprite.peers = d3
      .range(Math.floor(Math.random() * 10))
      .map(() => Math.floor(Math.random() * 100));
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.rotation = i * 10;
    sprite.interactive = true;
    sprite.buttonMode = true; // cursor change
    sprite.scale.set(Math.random() * 2 + 1);
    sprite
      .on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd)
      .on("pointerupoutside", onDragEnd)
      .on("pointerover", onMouseOver)
      .on("pointerout", onMouseOut)
      .on("pointermove", onDragMove);
    sprites.push(sprite);
    viewport.addChild(sprite);
  }
  return sprites;
}

function makeLinks(nodes) {
  const links = d3.range(nodes.length - 1).map(i => ({
    source: Math.floor(Math.sqrt(i)),
    target: i + 1,
    value: Math.random() + 0.5
  }));
  return links;
}

let tick = 0;
function makeSimulation(data, manualLooping) {
  const simulation = d3
    .forceSimulation(data.sprites)
    .velocityDecay(0.8)
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(-100)
        .distanceMax(250)
        .distanceMin(80)
    )
    .force(
      "center",
      d3
        .forceCenter()
        .x(width * 0.5)
        .y(height * 0.5)
    )
    .force(
      "link",
      d3
        .forceLink(data.links)
        .id(d => d.index)
        .distance(80)
        .strength(d => d.value)
    )
    .force(
      "collision",
      d3
        .forceCollide()
        .radius(d => d.radius)
        .iterations(2)
    )
    .on("tick", function() {});
  if (manualLooping) simulation.stop();
  return simulation;
}

data.sprites = makeSprites(numberOfItems);
data.links = makeLinks(data.sprites);

simulation = makeSimulation(data, true);

app.ticker.add(function updateGraphLinks(delta) {
  simulation.tick();
  updateLinks(data, linksGraphics);
  crtFilter.time += delta * 0.1;
});

function onMouseOver() {
  this.isOver = true;
  this.texture = textureHover;
}

function onMouseOut() {
  if (this.dragging) {
    return;
  }
  this.isOver = false;
  this.texture = texture;
}

function onDragStart(event) {
  viewport.pausePlugin('drag');
  simulation.alphaTarget(0.3).restart();
  this.isDown = true;
  this.eventData = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  globalDragging = true;
  
}

function onDragEnd(event) {
  if(!event.active) simulation.alphaTarget(0);
  this.alpha = 1;
  this.dragging = false;
  this.isOver = false;
  this.data = null;
  this.fx = null;
  this.fy = null;
  this.texture = texture;
  globalDragging = false;
  viewport.resumePlugin('drag');
}

function onDragMove(event) {
  if (this.dragging) {
    const newPosition = this.eventData.getLocalPosition(this.parent);
    this.fx = newPosition.x;
    this.fy = newPosition.y;
  }
  if (this.isOver) {
    this.texture = textureHover;
  }
}

function updateLinks(_data, _links) {
  _links.clear();
  _links.alpha = 0.07;
  _data.links.forEach(link => {
    let { source, target } = link;
    _links.lineStyle(link.value, 0xfefefe);
    _links.moveTo(source.x, source.y);
    _links.lineTo(target.x, target.y);
  });
  _links.endFill();
}
