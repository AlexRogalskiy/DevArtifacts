console.clear();

const FF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const PI = Math.PI, PI2 = PI * 2;

document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

const WIREFRAMES = true,
      PIXEL = 40,
      PIXELS_H = 20,
      PIXELS_GROUND_H = 1,
      PIXELS_AIR_H = PIXELS_H - PIXELS_GROUND_H,
      VIEW_W = 1800,
      VIEW_H = PIXEL * PIXELS_H,
      GROUND_H = PIXEL * PIXELS_GROUND_H,
      AIR_H = PIXEL * PIXELS_AIR_H,
      BLOCK_GROUND_Y = VIEW_H - GROUND_H - PIXEL * 0.5,
      STEP = 1;

const // module aliases
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Engine = Matter.Engine,
      Events = Matter.Events,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Render = Matter.Render,
      Vector = Matter.Vector,
      World = Matter.World;

const BODY_OPTS = {
  ceiling: {
    render: { fillStyle: '#000' }, label: 'ceiling', isStatic: true,
    friction: 0.0, restitution: 0.0, density: 1.0
  },
  ground: {
    render: { fillStyle: 'rgba(0,0,0,0.25)' }, label: 'ground', isStatic: true,
    friction: 1.0, restitution: 0.0, density: 1.0
  },
  jumper: {
    render: { fillStyle: '#FFF' }, label: 'jumper', angle: PI * 0.5,
    friction: 0.1, restitution: 0.0, density: 0.01
  },
  obstacle: {
    render: { fillStyle: 'rgba(255,255,255,0.05)' }, label: 'obstacle', isStatic: true,
    friction: 0.0, restitution: 0.0, density: 1.0
  },
  token: {
    render: { fillStyle: '#FFF' }, label: 'token', angle: PI * 0.25, isStatic: true,
    friction: 0.0, restitution: 0.0, density: 0.0, isSensor: true
  }
}

class Abilities {
  constructor(progress) {
    this.progress = progress;
    this.$element = document.querySelector('.abilities');
    this.report();
  }

  report() {
    this.$element.innerHTML = '';
    if (this.progress.stage !== this.stage) {
      this.stage = this.progress.stage;
      this.animTop = true;
    } else {
      this.animTop = false;
    }
    let abilities = this.abilities.slice(0, this.progress.stage);
    abilities.reverse().forEach((ability, i) => {
      if (this.animTop && i === 0) {
        this.$element.innerHTML += `<p class="anim">${ability}</p>`
      } else {
        this.$element.innerHTML += `<p>${ability}</p>`
      }
    });
  }

  get stages() {
    return {
      jump: 1,
      spin: 2,
      tilt: 3,
      down: 4,
      reverse: 5
    }
  }

  get abilities() {
    // ↓↑←→
    return [
      'Jump by holding and releasing <span>↑</span> on the ground',
      'Spin by holding <span>←</span> or <span>→</span> in the air',
      'Tilt by holding <span>←</span> or <span>→</span> on the ground',
      'Force down by pressing <span>↓</span> in the air',
      'The sands of time are <em>confused</em>',
    ];
  }
}

class Background {
  constructor({ directions }) {
    this.direction = directions[Math.floor(Math.random() * directions.length)];
    let maxLength = 8 * PIXEL,
        minLength = 2 * PIXEL,
        range = maxLength - minLength;
    this.l = Math.floor(Math.random() * maxLength) + minLength;
    this.x = this.direction === 1 ? VIEW_W : -this.l;
    this.y = Math.random() * AIR_H;
    this.moveStep = ((this.l / (maxLength + minLength))) * PIXEL * this.direction;
  }

  move(ratio) {
    this.x -= (this.moveStep * 0.25 + ratio * this.moveStep * 0.75);
  }

  offScreen() {
    if (this.direction === 1)
      return this.x < -this.l;
    else 
      return this.x > VIEW_W + this.l;
  }
}

class Canvas {
  constructor({ context, overlay }) {
    this.context = context;
    this.overlay = overlay.getContext('2d');
  }

  animationTick(game) {
    let {
      backgrounds, ground, jumper, obstacles,
      power, progress, progressing, tokens
    } = game;

    let centered = jumper.adjustedCentered;
    
    let lightness = centered * 90;
    let fill = `hsl(0, 0%, ${lightness}%)`;
    let stroke = `hsl(0, 0%, ${centered * 90 + 10}%)`;

    document.body.style.backgroundColor = fill;
    document.body.style.color = stroke;

    this.overlay.clearRect(0, 0, VIEW_W, VIEW_H);
    this.context.fillStyle = fill;
    this.overlay.strokeStyle = stroke;
    this.context.fillRect(0, 0, VIEW_W, VIEW_H);
    this.overlay.strokeRect(0, 0, VIEW_W, VIEW_H);
    
    this.animateBackgrounds(backgrounds, stroke);

    if (!progressing) this.animatePower(power, jumper, progress, stroke);
    
    this.animateJumperStartPosition(jumper);
    
    // rendering bodies
    this.renderBody(ground, stroke, fill);
    obstacles.forEach(o => this.renderBody(o.body, stroke, fill));
    tokens.forEach(t => this.renderBody(t.body, 'white', fill));
    this.renderBody(jumper.body, 'white', fill);

    // this.renderJumperCrosshair(jumper.body, 'white');
  }

  renderJumperCrosshair(body, stroke) {
    let x = body.position.x,
        y = body.position.y,
        a = body.angle,
        r = PIXEL * 0.125;

    this.overlay.strokeStyle = stroke;

    this.overlay.translate(x, y);
    this.overlay.rotate(a);
    this.overlay.beginPath();
    this.overlay.moveTo(-r, 0);
    this.overlay.lineTo(r, 0);
    this.overlay.stroke();
    this.overlay.rotate(-a);
    this.overlay.translate(-x, -y);
  }

  animateJumperStartPosition(jumper) {
    this.overlay.strokeStyle = jumper.body.render.fillStyle;
    this.overlay.lineCap = 'round';
    this.overlay.lineWidth = 2;
    this.overlay.beginPath();
    this.overlay.moveTo(jumper.startX, AIR_H + GROUND_H * 0.25);
    this.overlay.lineTo(jumper.startX, AIR_H + GROUND_H * 0.75);
    this.overlay.stroke();
  }

  animateBackgrounds(backgrounds, stroke) {
    this.context.lineWidth = 2;
    this.context.strokeStyle = stroke;
    backgrounds.forEach(item => {
      this.context.beginPath();
      this.context.moveTo(item.x, item.y);
      this.context.lineTo(item.x + item.l, item.y);
      this.context.stroke();
    });
  }

  animatePower(power, jumper, progress, stroke) {
    let maxTilt = progress.maxTilt;
    let maxDistance = PIXEL * PIXELS_AIR_H - PIXEL * 2.3;
    this.overlay.lineWidth = 2;
    this.overlay.lineCap = 'round';

    // initial x, y
    let startX = jumper.body.position.x,
        startY = jumper.body.position.y;

    if (maxTilt !== 0 && false) {
      // the full area
      let angleMin = PI * -0.5 + (-PI * maxTilt),
          angleMax = PI * -0.5 + (PI * maxTilt),
          curveX = startX,
          curveY = startY - maxDistance - PIXEL * 1.5;
      this.tiltAngleMin = this.calculatePathAtAngle(startX, startY, maxDistance, angleMin);
      this.tiltAngleMax = this.calculatePathAtAngle(startX, startY, maxDistance, angleMax);
      this.overlay.fillStyle = 'rgba(255, 255, 255, 0.04)';
      this.overlay.beginPath();
      this.overlay.moveTo(this.tiltAngleMin.from.x, this.tiltAngleMin.from.y);
      this.overlay.lineTo(this.tiltAngleMin.to.x, this.tiltAngleMin.to.y);
      this.overlay.quadraticCurveTo(
        curveX, curveY, this.tiltAngleMax.to.x, this.tiltAngleMax.to.y
      );
      this.overlay.lineTo(this.tiltAngleMax.from.x, this.tiltAngleMax.from.y);
      this.overlay.fill();
    }
    
    // the angle of tilt
    let angle = PI * -0.5 + (jumper.tilt * PI * maxTilt);
    // coordinates for starting power just off the duder
    let maxPath = this.calculatePathAtAngle(startX, startY, maxDistance, angle);
    // coordinates for showing power
    let currPath = this.calculatePathAtAngle(startX, startY, (power.meter * maxDistance), angle);
    
    this.overlay.strokeStyle = stroke;
    this.overlay.beginPath();
    this.overlay.moveTo(maxPath.from.x, maxPath.from.y);
    this.overlay.lineTo(maxPath.to.x, maxPath.to.y);
    this.overlay.stroke();

    this.overlay.strokeStyle = '#fff';
    this.overlay.beginPath();
    this.overlay.moveTo(currPath.from.x, currPath.from.y);
    this.overlay.lineTo(currPath.to.x, currPath.to.y);
    this.overlay.stroke();
  }

  calculatePathAtAngle(startX, startY, maxDistance, angle) {
    let angleCos = Math.cos(angle);
    let angleSin = Math.sin(angle);

    let fromX = startX + PIXEL * angleCos,
        fromY = startY + PIXEL * angleSin;

    let toX = fromX + maxDistance * angleCos,
        toY = fromY + maxDistance * angleSin;

    return {
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY }
    }
  }

  renderBody(body, stroke, fill) {
    this.context.strokeStyle = stroke || body.render.fillStyle;
    this.context.fillStyle = fill || body.render.fillStyle;
    this.context.lineWidth = 2;
    this.context.beginPath();
    body.vertices.forEach(({ x, y }, j) => {
      let method = (j === 0) ? 'moveTo' : 'lineTo';
      this.context[method](x, y);
    });
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
  }
}

class Game {
  constructor({ world, canvas, score, reset }) {
    let $final = document.body.querySelector('.final-score');
    if ($final) $final.remove();
    this.reset = reset; // function to reset the game
    this.playing = true;
    this.world = world;
    this.canvas = canvas;
    this.progress = new Progress();
    this.abilities = new Abilities(this.progress);
    this.progress.abilities = this.abilities;
    this.power = new Power(this.progress);
    this.score = score;
    this.score.bind(this.progress, this);
    this.progressing = false;
    this.backgrounds = [];
    this.obstacles = [];
    this.tokens = [];
    this.tokenIds = [];
    this.buildCeiling();
    this.buildGround();
    this.jumper = new Jumper(this.progress);
    this.addBodiesToWorld();
  }

  // Adding bodies to the matter js world
  addBodiesToWorld() {
    World.add(this.world, this.ceiling);
    World.add(this.world, this.ground);
    World.add(this.world, this.jumper.body);
  }

  // Building an instance of Background and adding it to backgrounds
  buildBackground() {
    this.backgrounds.push(new Background({ directions: this.progress.directions(this.abilities) }));
  }

  // The ceiling body resting just above the top of the window
  buildCeiling() {
    this.ceiling = Bodies.rectangle(
      VIEW_W * 0.5, -GROUND_H - PIXEL, VIEW_W, GROUND_H, BODY_OPTS.ceiling
    );
  }

  // The ground body dropping beneath the bottom of the window
  buildGround() {
    let relH = GROUND_H * 2,
        relW = VIEW_W * 1.5,
        relY = VIEW_H - relH * 0.5 + (relH - GROUND_H);
    this.ground = Bodies.rectangle(
      VIEW_W * 0.5, relY, relW, relH, BODY_OPTS.ground
    );
  }

  // Building an instance of Obstacle and adding it to obstacles
  buildObstacle() {
    let obstacle = new Obstacle({ stage: this.progress.stage, directions: this.progress.directions(this.abilities) });
    this.obstacles.push(obstacle);
    World.add(this.world, obstacle.body);
  }

  // Building an instance of Token and adding it to tokens
  buildToken() {
    let token = new Token({ sides: this.jumper.sides + 1, directions: this.progress.directions(this.abilities) });
    this.tokens.push(token);
    this.tokenIds.push(token.body.id);
    World.add(this.world, token.body);
  }

  // Determining if the game is over
  checkGameOver() {
    if (this.jumper.offScreen()) {
      this.handleGameEnd();
    }
  }

  // Firing the Jumper, setting "progressing" state
  fire() {
    if (!this.started) {
      this.score.start();
      this.started = true;
    }
    if (this.power.force !== 0) {
      this.jumper.fire(this.power.force);
      this.progressing = true;
    }
  }

  // Handling all collision pairs
  handleCollisionStart({ pairs }) {
    pairs.forEach((collision, i) => {
      let { bodyA, bodyB } = collision;
      let speed = collision.collision.axisBody.speed;
      let coll = bodyA.label + bodyB.label;
      if (coll === 'groundjumper' || coll === 'jumperground')
        this.handleJumperLanded();
      if (coll === 'obstaclejumper' || coll === 'jumperobstacle')
        this.handleJumperObstacle();
      if (coll === 'tokenjumper' || coll === 'jumpertoken')
        this.handleTokenHit(bodyA.label === 'jumper' ? bodyB : bodyA);
    });
  }

  // Handling keydown Jumper "charging" state
  handleJumperCharging() {
    if (this.progressing) return;
    this.charging = true;
  }

  // Handling keydown Jumper downward force command
  handleJumperDown() {
    if (this.progress.stage >= this.abilities.stages.down)
      this.jumper.down();
  }

  // Handling keyup Jumper upward force command
  handleJumperFire() {
    this.fire();
    this.progress.startJump();
    this.power.reset();
    this.charging = false;
  }

  // Jumper has first touched the ground after Jumping
  handleJumperLanded() {
    this.progressing = false;
    this.progress.endJump();
  }

  // Jumper has touched an obstacle
  handleJumperObstacle() {}

  // Command to spin is being fired
  handleJumperSpin(direction) {
    if (this.progress.stage >= this.abilities.stages.spin)
      this.jumper.adjustSpin(direction);
  }

  // Command to tilt is being fired
  handleJumperTilt(direction) {
    if (this.progress.stage >= this.abilities.stages.tilt)
      this.jumper.adjustTilt(direction);
  }

  // The Game is over
  handleGameEnd() {
    if (this.playing) {
      this.score.kill();
      this.notifyFinalScore();
      this.playing = false;
    }
  }

  // The level is being increased
  handleLevelTick() {
    this.abilities.report();
  }

  // Animation frame
  handleTickAfter() {
    this.jumper.tick();
    this.canvas.animationTick(this);
    if (!this.progressing) this.jumper.updateStartX();
    this.checkGameOver();
    this.tickItems();
    if (!this.playing) return;
    if (this.charging) this.tickPower();
    if (this.progressing) this.tickProgress();
  }

  // A Token has been hit by the Jumper
  handleTokenHit(token) {
    this.jumper.increaseSides();
    Composite.remove(this.world, token);
    let idx = this.tokenIds.indexOf(token.id);
    this.tokenIds.splice(idx, 1);
    this.tokens.splice(idx, 1);
    this.tokens.forEach(token => {
      token.increaseSides();
    });
  }

  notifyFinalScore() {
    let $el = document.createElement('div');
    $el.className = 'final-score';
    $el.innerHTML = this.progress.finalReport();
    let $p = document.createElement('p');
    let $a = document.createElement('a');
    $a.innerHTML = 'Restart';
    $a.addEventListener('click', () => { this.restart() });
    $p.appendChild($a);
    $el.appendChild($p);
    $a.setAttribute('href', '#');
    document.body.appendChild($el);
  }

  // Move our items forward (in progressing state)
  progressItems() {
    this.progressGroup(this.obstacles);
    this.progressGroup(this.tokens, this.tokenIds);
    this.progressGroup(this.backgrounds);
  }

  // Take a group of items and progress it, removing items that are now offscreen
  progressGroup(group, ids) {
    let removes = [];
    let centeredAmount = (1 - this.jumper.adjustedCentered);
    let amount = (centeredAmount * 0.5) * this.jumper.proximityFromGround + (centeredAmount * 0.5);
    group.forEach((item, i) => {
      item.move(amount);
      if (item.offScreen()) {
        removes.push(i);
        if (item.body) Composite.remove(this.world, item.body);
      }
    });
    for (let i = removes.length - 1; i >= 0; i--) {
      if (ids) ids.splice(removes[i], 1); 
      group.splice(removes[i], 1); 
    }
  }

  // Restarting the game
  restart() {
    this.score.kill();
    this.reset();
  }

  // Each anim tick actions for Items
  tickItems() {
    this.tokens.forEach((token, i) => { token.spin(); });
  }

  // Ticking the power (in charging state)
  tickPower() {
    if (this.charging) this.power.tick();
  }

  // Ticking the progress (in progressing state)
  tickProgress() {
    this.score.updateBPM(1 - this.jumper.adjustedCentered);
    let levelTick = this.progress.tick(this.jumper);
    this.score.updateFilter(this.jumper.proximityFromGround);
    if (levelTick) this.handleLevelTick();
    if (this.progress.doBackground()) this.buildBackground();
    if (this.progress.doStep()) this.progressItems();
    if (this.progress.doObstacle()) this.buildObstacle();
    if (this.progress.doToken()) this.buildToken();
  }
}

class Jumper {
  constructor(progress) {
    this.progress = progress;
    this.sides = 3;
    this.name = 'Trigon';
    this.spinSpeed = 0.005;
    this.tilt = 0;
    this.centered = 0;
    this.maxForce = 0.4;
    this.buildBody();
  }

  adjustSpin(direction) {
    this.spin = this.body.angularVelocity + this.spinSpeed * direction;
    Body.setAngularVelocity(this.body, this.spin);
  }

  adjustTilt(direction) {
    let value = this.tilt + direction * this.progress.maxTilt;
    this.tilt = Math.min(Math.max(value, -1), 1);
  }

  buildBody() {
    let x = VIEW_W * 0.5,
        y = BLOCK_GROUND_Y - PIXEL * 0.125;
    this.startX = x;
    this.body = Bodies.polygon(x, y, this.sides, PIXEL * 0.5, BODY_OPTS.jumper);
  }

  down() {
    Body.applyForce(this.body, this.body.position, { x: 0, y: Math.min(this.maxForce, 1) });
  }

  fire(force) {
    let x = this.tilt * 0.05,
        y = force * this.maxForce;
    this.updateStartX();
    Body.applyForce(this.body, this.body.position, { x, y });
  }

  increaseSides() {
    this.sides += 1;
    this.sides = Math.min(100, this.sides);
    this.name = polygonName(this.sides);
    let body = Bodies.polygon(0, 0, this.sides, PIXEL * 0.5, {});
    let areaBefore = this.body.area;
    this.body.friction += 0.05;
    // this.body.restitution += 0.025;
    Body.setVertices(this.body, body.vertices);
    // account for extra force for more area
    this.maxForce *= this.body.area / areaBefore;
  }

  offScreen() {
    return this.body.position.x < 0 || this.body.position.x > VIEW_W;
  }

  tick() {
    this.centered = Math.abs(this.body.position.x - VIEW_W * 0.5) / (VIEW_W * 0.5);
    this.adjustedCentered = Math.pow(this.centered, 2);
  }

  updateStartX() {
    this.startX = this.body.position.x;
  }

  get proximityFromGround() {
    return 1 - ((this.body.position.y - PIXEL * 0.5) / AIR_H);
  }
}

class Obstacle {
  constructor({ stage, directions }) {
    this.direction = directions[Math.floor(Math.random() * directions.length)];
    this.stage = stage;
    this.moveStep = PIXEL * (Math.random() * 0.1 + 0.025) * this.direction;
    this.buildBody();
  }

  buildBody() {
    let allOptions = this.stageOptions;
    let options = allOptions[(this.stage - 1) % allOptions.length];
    let idx = Math.floor(Math.random() * options.length);
    let option = options[idx];
    if (option.s) {
      let a = this.randomAngle(),
          s = option.s,
          r = option.r * PIXEL,
          d = r * 2,
          y = (Math.random() * (AIR_H - d) - d * 0.5),
          x = this.direction === 1 ? VIEW_W + d * 0.5 : d * -0.5;
      let opts = BODY_OPTS.obstacle;
      opts.angle = a;
      this.body = Bodies.polygon(x, y, s, r, opts);
    } else {
      let h = option.h * PIXEL,
          w = option.w * PIXEL,
          y = (Math.random() * (AIR_H - h) - h * 0.5),
          x = this.direction === 1 ? VIEW_W + w * 0.5 : w * -0.5;
      this.body = Bodies.rectangle(x, y, w, h, BODY_OPTS.obstacle);
    }
  }

  move(ratio) {
    let x = this.body.position.x - (this.moveStep * 0.25 + ratio * this.moveStep * 0.75);
    Body.setPosition(this.body, { x, y: this.body.position.y });
  }

  offScreen() {
    if (this.direction === 1)
      return this.body.position.x < -PIXEL;
    else 
      return this.body.position.x > VIEW_W + PIXEL;
  }

  randomAngle() {
    return [PI * 0.5, 0, PI * -0.5][Math.floor(Math.random() * 3)];
  }

  get stageOptions() {
    let rectSm = this.shapeRect(1),
        circSm = this.shapePoly(1, 16),
        beamSm = this.shapeBeam(2),
        platSm = this.shapePlat(2),
        trigSm = this.shapePoly(2, 3),
        rectMd = this.shapeRect(2),
        circMd = this.shapePoly(2, 16),
        beamMd = this.shapeBeam(3),
        platMd = this.shapePlat(3),
        trigMd = this.shapePoly(3, 3);
        
    return [
      [rectSm, circSm, beamSm, platSm],   
      [rectSm, circSm, trigSm, beamMd, platMd],
      [rectMd, circMd, trigMd, beamMd, platMd],
    ];
  }

  shapeRect(size)  { return { w: size, h: size }; }
  shapeBeam(size)  { return { w: 1, h: size }; }
  shapePlat(size)  { return { w: size, h: 1 }; }
  shapePoly(di, s) { return { s, r: di * 0.5 }; }
}

class Power {
  constructor() {
    this.meter = 0;
    this.step = 0.025;
    this.direction = 1;
  }

  get force() {
    return this.meter * -1;
  }

  reset() {
    this.meter = 0;
  }

  tick() {
    this.meter += this.step * this.direction;
    if (this.meter < 0) {
      this.direction = 1;
      this.meter = 0;
    } else if (this.meter > 1) {
      this.direction = -1;
      this.meter = 1;
    }
  }
}

class Progress {
  constructor() {
    this.$element = document.querySelector('.progress');
    this.best = 0;
    this.jump = 0;
    this.jumpStart = 0;
    this.jumperName = 'Trigon';
    this.jumperSides = 3;
    this.stage = 1;
    this.level = 1;
    this.levelsPerStage = 4;
    this.levelStep = 750;
    this.position = 0;

    this.update();
    this.report();
  }

  tick(jumper) {
    this.jumperName = jumper.name;
    this.jumperSides = jumper.sides;
    this.position++;
    this.jump = this.position - this.jumpStart;
    let levelTick = false;
    if (Math.floor(this.position / this.levelStep + 1) !== this.level) {
      levelTick = true;
      this.stepForward();
    }
    this.report();
    return levelTick;
  }

  startJump() {
    this.jumpStart = this.position;
  }

  endJump() {
    this.best = Math.max(this.best, this.jump);
    this.report();
  }

  report() {
    let extra = `[${this.jumperSides}]`;
    if (this.jumperName === 'Circle') extra = '';
    this.$element.innerHTML = `
      <span>
        L${this.level}&nbsp;
        ${this.units(this.position)}&nbsp;
      </span>
      <span>${this.jumperName} ${extra}</span>
      <span>
        J ${this.units(this.jump)}&nbsp;
        B ${this.units(this.best)}
      </span>
    `;
  }

  finalReport() {
    if (this.jumperName === 'Circle') {
      return `
        <p>You Achieved</p>
        <p>Circularity</p>
        <p>
          Total ${this.units(this.position)}<br>
          Best Jump ${this.units(this.best)}
        </p>
      `
    }
    return `
      <p>Your Pursuit is Over</p>
      <p>${this.jumperName}</p>
      <p>
        Total ${this.units(this.position)}<br>
        Best Jump ${this.units(this.best)}
      </p>
    `;
  }

  stepForward() {
    this.level++;
    this.stage = Math.floor((this.level - 1) / this.levelsPerStage) + 1;
    this.update();
  }

  doStep() {
    return this.position % STEP === 0;
  }

  doObstacle() {
    return this.position % (STEP * this.obstacle) === 0;
  }

  doBackground() {
    return Math.random() < 0.05;
  }

  doToken() {
    return this.position % (STEP * this.token) === 0;
  }

  update() {
    let max = this.optsObstacle.length;
    let idx = (this.stage - 1) % max;
    if (this.stage <= 7) {
      this.obstacle = this.optsObstacle[idx];
      this.token = this.optsToken[idx];
      this.maxTilt = this.optsMaxTilt[idx];
    }
  }

  directions(abilities) {
    if (this.stage < abilities.stages.reverse) return [1];
    return [1, -1];
  }

  get optsMaxTilt() {
    return [0, 0, 0.025, 0.025, 0.05, 0.05, 0.1];
  }

  get optsObstacle() {
    return [128, 128, 96, 96, 64, 64, 32];
  }

  get optsToken() {
    return [256, 256, 192, 192, 128, 128, 64];
  }

  units(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'u';
  }
}

class Score {
  constructor() {
    this.exists = false;
  }

  bind(progress, game) {
    this.position = 0;
    this.rate = '32n';
    this.chordChange = 8 * 4; // 8 32nd notes = 1 quarter note
    this.arpeggiatorChange = 4;
    this.keyIdx = 0;
    this.chordIdx = 0;
    this.arpeggiatorIdx = 0;
    this.progress = progress;
    this.game = game;
    this.on = { bass: false, arpeggiator: false };
    if (!this.exists) this.initialize();
    this.exists = true;
  }

  buildChannels() {
    this.channels = {};
    this.channels.main = new Tone.Gain(1);
    this.channels.bass = new Tone.Gain(0.9);
    this.channels.bassL = new Tone.Panner(-1);
    this.channels.bassR = new Tone.Panner(1);
    this.channels.arpeggiator = new Tone.Gain(0.45);
  }

  buildEffects() {
    this.effects = {};
    this.effects.filter = new Tone.AutoFilter();
    this.effects.filter.frequency.value = 4;
    this.effects.filter.type = 'square';
    this.effects.filter.depth.value = 0.3;
    this.effects.filter.baseFrequency = 50;
    this.effects.filter.octaves = 2.6;
    this.effects.filter.filter.type = 'lowpass';
    this.effects.filter.filter.rolloff = -24;
    this.effects.filter.filter.Q.value = 1;
    this.effects.filter.start();
  }
  
  buildSynths() {
    this.synths = {};

    this.synths.bassL = new Tone.AMSynth();
    this.synths.bassL.set({
      envelope: { attack: 0.125, release: 0.125 },
      oscillator: { type: 'square4' },
      portamento: FF ? 0 : 0.25
    });
    this.synths.bassL.setNote('C1');
    this.synths.bassR = new Tone.AMSynth();
    this.synths.bassR.set({
      envelope: { attack: 0.125, release: 0.125 },
      oscillator: { type: 'square4' },
      portamento: FF ? 0 : 0.25
    });
    this.synths.bassR.setNote('C1');

    this.synths.arpeggiator = new Tone.AMSynth();
    this.synths.arpeggiator.set({
      envelope: { attack: 0.5, release: 0.125 },
      oscillator: { type: 'sawtooth' },
      portamento: 0.05
    });
  }

  changeChord() {
    this.updateArpeggiatorNotes();
    if (this.on.bass) {
      this.synths.bassL.setNote(this.chord[0] + '1', this.time);
      this.synths.bassR.setNote(this.chord[2] + '1', this.time);
    } else {
      this.on.bass = true;
      this.synths.bassL.triggerAttack(this.chord[0] + '1', this.time);
      this.synths.bassR.triggerAttack(this.chord[2] + '1', this.time);
    }
    this.chordIdx++;
  }

  connectModules() {
    this.channels.main.toMaster();
    this.effects.filter.connect(this.channels.main);
    this.channels.bassL.connect(this.channels.bass);
    this.channels.bassR.connect(this.channels.bass);
    this.channels.bass.connect(this.effects.filter);
    this.channels.arpeggiator.connect(this.effects.filter);
    this.synths.bassL.connect(this.channels.bassL);
    this.synths.bassR.connect(this.channels.bassR);
    this.synths.arpeggiator.connect(this.channels.arpeggiator);
  }

  initialize() {
    this.buildChannels();
    this.buildEffects();
    this.buildSynths();
    this.connectModules();
    // repeated event every 8th note
    Tone.Transport.scheduleRepeat((time) => {
      this.time = time;
      this.tick();
    }, this.rate);
  }

  start() {
    Tone.Transport.start();
  }

  stop() {
    Tone.Transport.stop();
  }

  tick() {
    if (this.position % 16 === 0) this.effects.filter.sync();
    if (this.game.progressing)
      if (this.position % this.chordChange === 0) this.changeChord();
    if (this.position % this.arpeggiatorChange === 0)
      this.triggerArpeggiator();
    this.position++;
  }

  triggerArpeggiator() {
    let note = this.arpeggiatorNotes[this.arpeggiatorIdx % 9];
    if (this.on.arpeggiator) {
      this.synths.arpeggiator.setNote(note, this.time);
    } else {
      this.on.arpeggiator = true;
      this.synths.arpeggiator.triggerAttack(note, this.time);
    }
    this.arpeggiatorIdx++;
  }

  updateBPM(ratio) {
    let bpm = ratio * 40 + 80;
    Tone.Transport.bpm.value = bpm;
  }

  updateFilter(ratio) {
    let frequency = ratio * 1250 + 50;
    this.effects.filter.depth.value = 0.3 * (1-ratio);
    this.effects.filter.baseFrequency = frequency;
  }

  updateArpeggiatorNotes() {
    this.arpeggiatorIdx = 0;
    this.arpeggiatorNotes = [];
    for (let i = 0; i < 3; i++) {
      this.arpeggiatorNotes.push(this.chord[i] + '3');
      this.arpeggiatorNotes.push(this.chord[i] + '4');
      this.arpeggiatorNotes.push(this.chord[i] + '5');      
    }
    this.arpeggiatorNotes = shuffleArray(this.arpeggiatorNotes);
  }

  get key() {
    return this.keys[(this.progress.stage - 1) % this.keys.length];
  }

  get keys() {
    return [
      [
        // G Locrian
        ['G', 'Bb', 'Db'], // Gdim
        ['A#', 'C#', 'F'], // A#min
        ['F', 'Ab', 'C'],  // Fmin
        ['C', 'Eb', 'G'],  // Cmin
        ['C#', 'F', 'G#'], // C#maj
        ['A#', 'C#', 'F'], // A#maj
        ['D#', 'G', 'A#'], // D#maj
        ['G#', 'C', 'D#']  // G#maj
      ],
      // D# Major
      [
        ['D#', 'G', 'Bb'], // D#maj
        ['G', 'Bb', 'D'],  // Gmin
        ['C', 'Eb', 'G'],  // Cmin
        ['G', 'C', 'Eb'],  // Cmin/G
        ['C#', 'F', 'G#'], // Dbmaj
        ['A#', 'D', 'F'],  // Bbmaj
        ['C', 'Eb', 'G'],  // Cmin
        ['F', 'Ab', 'C'],  // Fmin
      ],
      // C Minor (Aeolian)
      [
        ['C', 'Eb', 'G'],  // Cmin
        ['Eb', 'B', 'Gb'], // D#maj
        ['Ab', 'C', 'Eb'], // G#maj
        ['F', 'Ab', 'C'],  // Fmin
        ['G', 'Bb', 'D'],  // Gmin
        ['Eb', 'B', 'Gb'], // D#maj
        ['Ab', 'C', 'Eb'], // G#maj
        ['D', 'F', 'Ab'],  // Ddim
      ]
    ];
  }

  get chord() {
    return this.key[this.chordIdx % this.key.length];
  }

  // stopping all sound, resetting bpm, resetting chords
  kill() {
    this.stop();
    this.synths.bassL.triggerRelease(this.time);
    this.synths.bassR.triggerRelease(this.time);
    this.synths.arpeggiator.triggerRelease(this.time);
  }
}

class Token {
  constructor({ sides, directions }) {
    this.sides = sides;
    this.direction = directions[Math.floor(Math.random() * directions.length)];
    this.moveStep = PIXEL * (Math.random() * 0.1 + 0.025) * this.direction;
    this.buildBody();
  }

  buildBody() {
    let r = PIXEL * 0.4,
        y = Math.random() * (AIR_H - r),
        x = this.direction === 1 ? VIEW_W + r : -r;
    this.body = Bodies.polygon(x, y, this.sides, r, BODY_OPTS.token);
  }

  spin() {
    Body.setAngle(this.body, this.body.angle + 0.05);
  }

  move(ratio) {
    let x = this.body.position.x - (this.moveStep * 0.25 + ratio * this.moveStep * 0.75);
    Body.setPosition(this.body, { x, y: this.body.position.y });
  }

  increaseSides() {
    this.sides++;
    let body = Bodies.polygon(0, 0, this.sides, PIXEL * 0.4, {});
    let areaBefore = this.body.area;
    Body.setVertices(this.body, body.vertices);
  }

  offScreen() {
    if (this.direction === 1)
      return this.body.position.x < -PIXEL;
    else
      return this.body.position.x > VIEW_W + PIXEL;
  }
}

newGame();

let focused = false;
setInterval(checkPageFocus, 200);
function checkPageFocus() {
  let isFocused = document.hasFocus();
  if (isFocused && !focused) {
    document.body.classList.add('focused');
    focused = true;
  } else if (!isFocused && focused) {
    document.body.classList.remove('focused');
    focused = false;
  }
}

let fullscreen = new Fullscreen();
let $fullscreen = document.querySelector('.fullscreen');
if (fullscreen.supported) {
  $fullscreen.addEventListener('click', () => { fullscreen.toggle(); });
} else {
  $fullscreen.remove();
}

function newGame() {  
  let overlay = document.querySelector('canvas.overlay');
  overlay.width = VIEW_W;
  overlay.height = VIEW_H;
  document.body.querySelector('.restart').addEventListener('click', () => {
    game.restart();
  });
  let fresh = false;
  if (window.engine) {
    Engine.clear(window.engine);
    World.clear(engine.world);
    delete window.game;
  } else {
    fresh = true;
    // create a world and engine
    window.world = World.create({ gravity: { x: 0, y: 0.5 } });
    window.engine = Engine.create({ world, timing: { timeScale: 1 } });
    window.score = new Score();

    // create a renderer
    window.element = document.querySelector('div.canvas');
    window.render = Render.create({
      element, engine,
      options: {
        wireframes: WIREFRAMES,
        width: VIEW_W,
        height: VIEW_H,
        background: 'transparent'
      }
    });
  }
  let canvas = new Canvas({ context: render.context, overlay });
  window.game = new Game({ world, canvas, score, reset: newGame });

  let arrowR = 39, arrowL = 37,
      arrowD = 40, arrowU = 38;
  document.body.addEventListener('keydown', ({ keyCode }) => { 
    if (keyCode === arrowU && !game.charging) game.handleJumperCharging();
    if (game.progressing) {
      if (keyCode === arrowR) game.handleJumperSpin(1);
      if (keyCode === arrowL) game.handleJumperSpin(-1);
    } else {
      if (keyCode === arrowR) game.handleJumperTilt(1);
      if (keyCode === arrowL) game.handleJumperTilt(-1);
    }
  });
  document.body.addEventListener('keyup', ({ keyCode }) => { 
    if (keyCode === arrowU && game.charging) game.handleJumperFire();
    if (game.progressing) {
      if (keyCode === arrowD) game.handleJumperDown();
    }
  });

  if (fresh) {
    Events.on(render, 'afterRender', () => game.handleTickAfter());
    Events.on(engine, 'collisionStart', (e) => {
      game.handleCollisionStart({ pairs: e.pairs });
    });

    // run the engine
    Engine.run(engine);
    // run the renderer
    Render.run(render);
  }
}

// shuffling an array
function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// polygonal name for x sides from 1 through 100
function polygonName(sides) {
  return [
    null,
    'Monogon', 'Digon', 'Trigon', 'Tetragon', 'Pentagon',
    'Hexagon', 'Heptagon', 'Octagon', 'Enneagon', 'Decagon',
    'Hendecagon', 'Dodecagon', 'Trisdecagon', 'Tetradecagon', 'Pentadecagon',
    'Hexadecagon', 'Heptadecagon', 'Octadecagon', 'Enneadecagon', 'Icosagon',
    'Icosikaihenagon', 'Icosikaidigon', 'Icosikaitrigon', 'Icosikaitetragon', 
    'Icosikaipentagon',
    'Icosikaihexagon', 'Icosikaiheptagon', 'Icosikaioctagon', 'Icosikaienneagon', 
    'Triacontagon',
    'Triacontakaihenagon', 'Triacontakaidigon', 'Triacontakaitrigon',
    'Triacontakaitetragon', 'Triacontakaipentagon',
    'Triacontakaihexagon', 'Triacontakaiheptagon', 'Triacontakaioctagon',
    'Triacontakaienneagon', 'Tetracontagon',
    'Tetracontakaihenagon', 'Tetracontakaidigon', 'Tetracontakaitrigon',
    'Tetracontakaitetragon', 'Tetracontakaipentagon',
    'Tetracontakaihexagon', 'Tetracontakaiheptagon', 'Tetracontakaioctagon',
    'Tetracontakaienneagon', 'Pentacontagon',
    'Pentacontakaihenagon', 'Pentacontakaidigon', 'Pentacontakaitrigon',
    'Pentacontakaitetragon', 'Pentacontakaipentagon',
    'Pentacontakaihexagon', 'Pentacontakaiheptagon', 'Pentacontakaioctagon', 
    'Pentacontakaienneagon', 'Hexacontagon',
    'Hexacontakaihenagon', 'Hexacontakaidigon', 'Hexacontakaitrigon',
    'Hexacontakaitetragon', 'Hexacontakaipentagon',
    'Hexacontakaihexagon', 'Hexacontakaiheptagon', 'Hexacontakaioctagon',
    'Hexacontakaienneagon', 'Heptacontagon',
    'Heptacontakaihenagon', 'Heptacontakaidigon', 'Heptacontakaitrigon',
    'Heptacontakaitetragon', 'Heptacontakaipentagon',
    'Heptacontakaihexagon', 'Heptacontakaiheptagon', 'Heptacontakaioctagon',
    'Heptacontakaienneagon', 'Octacontagon',
    'Octacontakaihenagon', 'Octacontakaidigon', 'Octacontakaitrigon',
    'Octacontakaitetragon', 'Octacontakaipentagon',
    'Octacontakaihexagon', 'Octacontakaiheptagon', 'Octacontakaioctagon',
    'Octacontakaienneagon', 'Enneacontagon',
    'Enneacontakaihenagon', 'Enneacontakaidigon', 'Enneacontakaitrigon',
    'Enneacontakaitetragon', 'Enneacontakaipentagon',
    'Enneacontakaihexagon', 'Enneacontakaiheptagon', 'Enneacontakaioctagon',
    'Enneacontakaienneagon', 'Circle'
  ][sides];
}