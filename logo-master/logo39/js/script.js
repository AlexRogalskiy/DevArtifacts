let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

// const colors = ["#82FFEB", "#549FCC", "#116699", "#FFCAC2", "#CC5456"];

function resize(){
  canvas.width = 1920;
  canvas.height = 1000;
}

//window.onresize = resize;
resize();


class Brain{
  constructor(savedBrain){
    this.neurons = [];
    this.synapses = [];
    this.electrons = [];

    if(savedBrain){
      // Load saved neurons
      for(let loadNeuron of savedBrain.neurons){
        let neuron = this.createNeuron();
        Object.keys(loadNeuron).forEach( key => {
          neuron[key] = loadNeuron[key];
        });
        let randomHue = Math.floor(Math.random() * 360);
        neuron.color = `hsl(${randomHue}, 80%, 33%)`;
      }

      // Load saved synapses
      for(let loadSynapse of savedBrain.synapses){
        let from = this.neurons[loadSynapse.from];
        let to = this.neurons[loadSynapse.to];
        from.createSynapse(to);
      }
    }
  }

  createNeuron(){
    let neuron = new Neuron(this, ...arguments);
    neuron.id = this.neurons.length;
    this.neurons.push(neuron);
    return neuron;
  }

  addSynapse(synapse){
    synapse.id = this.synapses.length;
    this.synapses.push(synapse);
  }

  addElectron(electron){
    electron.id = this.electrons.length;
    this.electrons.push(electron);
  }

  JSONstringify(){
    let neurons = JSON.parse(JSON.stringify(this.neurons, (key, value) => {
      if(key === "brain" || key === "synapses"){
        return undefined;
      }
      return value;
    }));

    let synapses = JSON.parse(JSON.stringify(this.synapses, (key, value) => {
      if(key === "brain" || key === "electrons"){
        return undefined;
      }
      if(value instanceof Neuron){
        return value.id;
      }
      return value;
    }));

    let electrons = JSON.parse(JSON.stringify(this.electrons, (key, value) => {
      if(key === "brain"){
        return undefined;
      }
      if(value instanceof Synapse){
        return value.id;
      }
      return value;
    }));

    return JSON.stringify({neurons, synapses, electrons});
  }
}

class Neuron{
  constructor(brain, x, y, color, size){
    this.brain = brain;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size * 0.5;
    this.baseSize = size;
    this.sizeVelocity = 1;
    this.synapses = [];
  }

  createSynapse(neuron){
    let synapse = new Synapse(this.brain, this, neuron);
    this.addSynapse(synapse);
    neuron.addSynapse(synapse);
    this.brain.addSynapse(synapse);
    return synapse;
  }

  addSynapse(synapse){
    this.synapses.push(synapse);
  }

  animate(progress){
    let difference = this.baseSize - this.size;
    this.sizeVelocity += difference * progress * 40;
    this.sizeVelocity *= Math.pow(0.03, progress);
    this.size += this.sizeVelocity * progress;
  }
}

class Synapse{
  constructor(brain, from, to){
    this.brain = brain;
    this.from = from;
    this.to = to;

    this.electrons = [];

    if(Math.random() < 0.33){
      this.createElectron();
    }
  }

  createElectron(){
    let electron = new Electron(this.brain, this);
    this.electrons.push(electron);
    this.brain.addElectron(electron);
    return electron;
  }

  removeElectron(removeElectron){
    this.electrons = this.electrons.filter(electron => electron !== removeElectron);
    removeElectron.synapse = undefined;
  }

  getDirection(){
    return Math.atan2(this.from.y - this.to.y, this.from.x - this.to.x);
  }

  addElectron(electron, from){
    if(this.from === from){
      electron.reverseDirection = false;
    }
    else{
      electron.reverseDirection = true;
    }

    this.electrons.push(electron);
    electron.synapse = this;
  }
}

class Electron{
  constructor(brain, synapse){
    this.synapse = synapse;
    this.brain = brain;
    this.size = 10;
    this.reverseDirection = false;
    this.progress = Math.random();
    this.speed = 0.4 + Math.random() * 0.2;
  }

  getFrom(){
    return this.reverseDirection ? this.synapse.to : this.synapse.from;
  }

  getTo(){
    return this.reverseDirection ? this.synapse.from : this.synapse.to;
  }

  getPosition(){
    let x, y;
    let progress = this.reverseDirection ? easeInOutQuad(this.progress) : easeInOutQuad(1 - this.progress);
    let toOffset = this.synapse.to.baseSize - this.size * 1.5;
    let fromOffset = this.synapse.to.baseSize - this.size * 1.5;
    let direction = this.synapse.getDirection();

    x = (this.synapse.to.x + toOffset * Math.cos(direction)) * (1 - progress) + (this.synapse.from.x - fromOffset * Math.cos(direction)) * progress;
    y = (this.synapse.to.y + toOffset * Math.sin(direction)) * (1 - progress) + (this.synapse.from.y - fromOffset * Math.sin(direction)) * progress;

    return {x, y};
  }

  getVelocity(){
    return easeInOutQuadDeriv(this.progress);
  }

  getDirection(){
    if(this.reverseDirection){
      return this.synapse.getDirection();
    }
    else{
      return this.synapse.getDirection() + Math.PI;
    }
  }

  animate(progress){
    this.progress += progress * this.speed;

    if(this.progress > 1){
      let toSynpses = this.getTo().synapses;
      let randomSynapse = toSynpses[Math.floor(Math.random() * toSynpses.length)];

      let oldTo = this.getTo();
      this.progress = 0;
      this.synapse.removeElectron(this);
      randomSynapse.addElectron(this, oldTo);

      oldTo.sizeVelocity += 50;
    }
  }
}

var last = null;
function anim(timestamp){
  if(!last){last = timestamp}
  let progress = (timestamp - last) / 1000;
  if(progress > 0.1){progress = 0.1};
  progress *= 2;
  last = timestamp;

  for(let electron of brain.electrons){
    electron.animate(progress);
  }

  for(let neuron of brain.neurons){
    neuron.animate(progress);
  }

  draw();

  window.requestAnimationFrame(anim);
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let synapse of brain.synapses){
    let direction = synapse.getDirection();
    const width = 12;
    const widthMiddle = 2;
    let middle = between(synapse.from, synapse.to, 0.5);
    let point1 = between(synapse.from, synapse.to, 0.25);
    let point2 = between(synapse.from, synapse.to, 0.06 + (synapse.from.size - synapse.from.baseSize) * 0.06);
    let point3 = between(synapse.from, synapse.to, 0.94 - (synapse.to.size - synapse.to.baseSize) * 0.06);
    let point4 = between(synapse.from, synapse.to, 0.75);
    let perp = { // Perpendicular
      x: Math.cos(direction + Math.PI / 2),
      y: Math.sin(direction + Math.PI / 2),
    };

    let gradient;
    if(!synapse.gradient){
      gradient=ctx.createLinearGradient(point2.x, point2.y, point3.x, point3.y);
      gradient.addColorStop(0, synapse.from.color);
      gradient.addColorStop(1, synapse.to.color);
      synapse.gradient = gradient;
    }
    else{
      gradient = synapse.gradient;
    }


    ctx.fillStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(synapse.from.x + perp.x * width, synapse.from.y + perp.y * width);
    ctx.bezierCurveTo(
      point1.x + perp.x * width,
      point1.y + perp.y * width,
      point2.x + perp.x * widthMiddle,
      point2.y + perp.y * widthMiddle,
      middle.x + perp.x * widthMiddle,
      middle.y + perp.y * widthMiddle
    );
    ctx.bezierCurveTo(
      point3.x + perp.x * widthMiddle,
      point3.y + perp.y * widthMiddle,
      point4.x + perp.x * width,
      point4.y + perp.y * width,
      synapse.to.x + perp.x * width,
      synapse.to.y + perp.y * width
    );
    ctx.lineTo(synapse.to.x - perp.x * width, synapse.to.y - perp.y * width);
    ctx.bezierCurveTo(
      point4.x - perp.x * width,
      point4.y - perp.y * width,
      point3.x - perp.x * widthMiddle,
      point3.y - perp.y * widthMiddle,
      middle.x - perp.x * widthMiddle,
      middle.y - perp.y * widthMiddle
    );
    ctx.bezierCurveTo(
      point2.x - perp.x * widthMiddle,
      point2.y - perp.y * widthMiddle,
      point1.x - perp.x * width,
      point1.y - perp.y * width,
      synapse.from.x - perp.x * width,
      synapse.from.y - perp.y * width
    );
    ctx.fill();
  }

  for(let electron of brain.electrons){
    let position = electron.getPosition();
    let direction = electron.getDirection();
    let fontSide = {
      x: position.x + Math.cos(direction) * electron.size,
      y: position.y + Math.sin(direction) * electron.size,
    };
    let upSide = {
      x: position.x + Math.cos(direction + Math.PI / 2) * electron.size,
      y: position.y + Math.sin(direction + Math.PI / 2) * electron.size,
    };
    let downSide = {
      x: position.x + Math.cos(direction - Math.PI / 2) * electron.size,
      y: position.y + Math.sin(direction - Math.PI / 2) * electron.size,
    };
    let backSide = {
      x: position.x + Math.cos(direction + Math.PI) * electron.size * (electron.getVelocity() * 1.5 + 1),
      y: position.y + Math.sin(direction + Math.PI) * electron.size * (electron.getVelocity() * 1.5 + 1),
    };

    // ctx.fillStyle = "#fff";
    // ctx.fillStyle = electron.reverseDirection ?
    //   combineColors(electron.synapse.to.color, electron.synapse.from.color, 1 - electron.progress) :
    //   combineColors(electron.synapse.to.color, electron.synapse.from.color, electron.progress);
    ctx.fillStyle = electron.synapse.gradient;
    ctx.beginPath();
    ctx.moveTo(upSide.x, upSide.y);
    ctx.arcTo(
      upSide.x + Math.cos(direction) * electron.size,
      upSide.y + Math.sin(direction) * electron.size,
      fontSide.x,
      fontSide.y,
      electron.size
    );
    ctx.arcTo(
      downSide.x + Math.cos(direction) * electron.size,
      downSide.y + Math.sin(direction) * electron.size,
      downSide.x,
      downSide.y,
      electron.size
    );
    // ctx.lineTo(downSide.x, downSide.y);
    ctx.bezierCurveTo(
      downSide.x - Math.cos(direction) * electron.size,
      downSide.y - Math.sin(direction) * electron.size,
      backSide.x + Math.cos(direction) * electron.size,
      backSide.y + Math.sin(direction) * electron.size,
      backSide.x, backSide.y
    );
    ctx.bezierCurveTo(
      backSide.x + Math.cos(direction) * electron.size,
      backSide.y + Math.sin(direction) * electron.size,
      upSide.x - Math.cos(direction) * electron.size,
      upSide.y - Math.sin(direction) * electron.size,
      upSide.x, upSide.y
    );
    ctx.fill();
  }

  for(let neuron of brain.neurons){
    ctx.fillStyle = neuron.color;
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, neuron.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}

function distance(neuron1, neuron2){
  return Math.sqrt(Math.pow(neuron1.x - neuron2.x, 2) + Math.pow(neuron1.y - neuron2.y, 2));
}

function between(pos1, pos2, percentage){
  return {
    x: pos1.x * (1 - percentage) + pos2.x * percentage,
    y: pos1.y * (1 - percentage) + pos2.y * percentage,
  };
}

function easeInOutQuad (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }
function easeInOutQuadDeriv (t) { return t<.5 ? 4*t : 4*(1-t) }

var savedBrain = {"neurons":[{"x":376,"y":445,"color":"#FFCAC2","size":26.455622748419316,"baseSize":21,"sizeVelocity":6.560907665073449,"id":0},{"x":387,"y":584,"color":"#82FFEB","size":24.63851824824756,"baseSize":24,"sizeVelocity":-2.73313331133454,"id":1},{"x":441,"y":649,"color":"#FFCAC2","size":22.10982235873398,"baseSize":22,"sizeVelocity":0.22775200611691285,"id":2},{"x":524,"y":665,"color":"#116699","size":26.814863586319206,"baseSize":24,"sizeVelocity":37.977812675096075,"id":3},{"x":642,"y":623,"color":"#116699","size":20.08654820091062,"baseSize":21,"sizeVelocity":-12.827048645953411,"id":4},{"x":686,"y":724,"color":"#82FFEB","size":20.016742053261442,"baseSize":20,"sizeVelocity":0.0816523558105102,"id":5},{"x":730,"y":794,"color":"#CC5456","size":20.99999983379364,"baseSize":21,"sizeVelocity":0.000014465027558586292,"id":6},{"x":833,"y":810,"color":"#82FFEB","size":23.00000003897314,"baseSize":23,"sizeVelocity":1.9585827370123003e-8,"id":7},{"x":948,"y":779,"color":"#549FCC","size":22.888969982354897,"baseSize":23,"sizeVelocity":-2.4216046270564453,"id":8},{"x":1065,"y":756,"color":"#82FFEB","size":23.002116601443756,"baseSize":23,"sizeVelocity":-0.012222358504237613,"id":9},{"x":1134,"y":839,"color":"#116699","size":24.91775033773531,"baseSize":22,"sizeVelocity":-20.248881556227456,"id":10},{"x":1197,"y":935,"color":"#CC5456","size":25.68181462080287,"baseSize":21,"sizeVelocity":16.214859976865018,"id":11},{"x":1268,"y":913,"color":"#82FFEB","size":21.15163905871484,"baseSize":21,"sizeVelocity":-3.4051276023479984,"id":12},{"x":1261,"y":803,"color":"#82FFEB","size":24.026734268412127,"baseSize":24,"sizeVelocity":-0.5264671334414075,"id":13},{"x":1260,"y":726,"color":"#549FCC","size":19.999999951124813,"baseSize":20,"sizeVelocity":4.4393558077772617e-7,"id":14},{"x":1328,"y":660,"color":"#FFCAC2","size":20.985409195571535,"baseSize":21,"sizeVelocity":0.20667601898597915,"id":15},{"x":1401,"y":555,"color":"#FFCAC2","size":23.996879238800393,"baseSize":24,"sizeVelocity":0.03262522354000523,"id":16},{"x":1492,"y":490,"color":"#FFCAC2","size":20.101088044991066,"baseSize":20,"sizeVelocity":0.3956683086869978,"id":17},{"x":1516,"y":375,"color":"#549FCC","size":23.068504866629347,"baseSize":23,"sizeVelocity":-1.045489165274042,"id":18},{"x":1487,"y":256,"color":"#FFCAC2","size":19.238057635757833,"baseSize":20,"sizeVelocity":7.571514094354629,"id":19},{"x":1395,"y":156,"color":"#549FCC","size":22.28095071888947,"baseSize":24,"sizeVelocity":3.4498972793266307,"id":20},{"x":1250,"y":86,"color":"#82FFEB","size":25.150801750834244,"baseSize":20,"sizeVelocity":0.2009795501056679,"id":21},{"x":1319,"y":114,"color":"#FFCAC2","size":22.15186467503173,"baseSize":21,"sizeVelocity":-23.18749403729649,"id":22},{"x":1120,"y":56,"color":"#549FCC","size":23.77334754813871,"baseSize":24,"sizeVelocity":14.734162408963423,"id":23},{"x":986,"y":48,"color":"#CC5456","size":22.206245853906413,"baseSize":23,"sizeVelocity":10.66941649710156,"id":24},{"x":850,"y":48,"color":"#116699","size":21.41422172755512,"baseSize":21,"sizeVelocity":-3.55969816381217,"id":25},{"x":394,"y":318,"color":"#CC5456","size":21.99999931130018,"baseSize":22,"sizeVelocity":0.0000027478084264593752,"id":26},{"x":437,"y":203,"color":"#116699","size":19.99997289474867,"baseSize":20,"sizeVelocity":0.00007357819779470998,"id":27},{"x":515,"y":126,"color":"#116699","size":20.00000024960325,"baseSize":20,"sizeVelocity":-7.843427462267571e-7,"id":28},{"x":617,"y":80,"color":"#116699","size":26.19844915249819,"baseSize":21,"sizeVelocity":0.16864663583996137,"id":29},{"x":708,"y":56,"color":"#549FCC","size":23.070576716850855,"baseSize":23,"sizeVelocity":0.7437897635525182,"id":30},{"x":1156,"y":712,"color":"#116699","size":18.31500907341345,"baseSize":20,"sizeVelocity":4.303014621663821,"id":31},{"x":791,"y":700,"color":"#549FCC","size":26.141270218388534,"baseSize":22,"sizeVelocity":27.338688200702997,"id":32},{"x":753,"y":596,"color":"#116699","size":23.0713603080354,"baseSize":23,"sizeVelocity":0.7346451797049292,"id":33},{"x":674,"y":526,"color":"#82FFEB","size":29.562506697067068,"baseSize":24,"sizeVelocity":-3.5068210595186837,"id":34},{"x":564,"y":552,"color":"#116699","size":22.94021501233854,"baseSize":23,"sizeVelocity":-1.9343820243065486,"id":35},{"x":477,"y":547,"color":"#FFCAC2","size":22.91336179300218,"baseSize":23,"sizeVelocity":1.6505039940548523,"id":36},{"x":498,"y":421,"color":"#549FCC","size":21.769978843018915,"baseSize":22,"sizeVelocity":-1.3787275043969265,"id":37},{"x":509,"y":285,"color":"#116699","size":20.999087237029855,"baseSize":21,"sizeVelocity":0.025546306548394095,"id":38},{"x":585,"y":168,"color":"#CC5456","size":21.928542123755726,"baseSize":22,"sizeVelocity":0.8407180504301199,"id":39},{"x":695,"y":148,"color":"#CC5456","size":21.700223815785687,"baseSize":21,"sizeVelocity":3.3907268663507457,"id":40},{"x":815,"y":139,"color":"#CC5456","size":24.425965073743537,"baseSize":24,"sizeVelocity":3.771347080961098,"id":41},{"x":981,"y":140,"color":"#116699","size":21.99967831049685,"baseSize":22,"sizeVelocity":0.0046146482914818905,"id":42},{"x":900,"y":116,"color":"#82FFEB","size":21.466538447075052,"baseSize":23,"sizeVelocity":-9.284195958835303,"id":43},{"x":891,"y":227,"color":"#CC5456","size":23.096908182972808,"baseSize":23,"sizeVelocity":-0.5046139226065987,"id":44},{"x":760,"y":234,"color":"#CC5456","size":21.62863547056678,"baseSize":21,"sizeVelocity":8.933379098171006,"id":45},{"x":641,"y":251,"color":"#FFCAC2","size":22.94905797859566,"baseSize":23,"sizeVelocity":-0.026726982555308115,"id":46},{"x":610,"y":367,"color":"#FFCAC2","size":21.994156434366143,"baseSize":22,"sizeVelocity":-0.6478103629854453,"id":47},{"x":614,"y":462,"color":"#116699","size":21.889152655598288,"baseSize":22,"sizeVelocity":-2.422088416701105,"id":48},{"x":717,"y":430,"color":"#82FFEB","size":28.303216304517186,"baseSize":24,"sizeVelocity":-13.746490574042463,"id":49},{"x":716,"y":324,"color":"#116699","size":22.633360259755612,"baseSize":24,"sizeVelocity":-16.449278773932093,"id":50},{"x":824,"y":333,"color":"#FFCAC2","size":22.477560978200238,"baseSize":22,"sizeVelocity":4.866006568132217,"id":51},{"x":806,"y":467,"color":"#82FFEB","size":21.13150355946805,"baseSize":21,"sizeVelocity":-0.4315034979340709,"id":52},{"x":871,"y":586,"color":"#CC5456","size":20.000489906072872,"baseSize":20,"sizeVelocity":0.0006382945958895101,"id":53},{"x":915,"y":680,"color":"#82FFEB","size":20.9563013591019,"baseSize":21,"sizeVelocity":0.17261589221711038,"id":54},{"x":1021,"y":660,"color":"#CC5456","size":26.7748895778653,"baseSize":24,"sizeVelocity":-12.42104219268522,"id":55},{"x":1156,"y":601,"color":"#CC5456","size":22.000155303970732,"baseSize":22,"sizeVelocity":0.0029544442668613677,"id":56},{"x":1251,"y":614,"color":"#116699","size":20.999999390459774,"baseSize":21,"sizeVelocity":0.0000022977665667642354,"id":57},{"x":1291,"y":518,"color":"#82FFEB","size":19.99999998632102,"baseSize":20,"sizeVelocity":6.637475787565636e-8,"id":58},{"x":1384,"y":442,"color":"#FFCAC2","size":23.003957613774777,"baseSize":23,"sizeVelocity":7.6111281515961435,"id":59},{"x":1371,"y":302,"color":"#116699","size":21.90647396951751,"baseSize":22,"sizeVelocity":0.25768504097756995,"id":60},{"x":1286,"y":212,"color":"#549FCC","size":24.841253905156886,"baseSize":24,"sizeVelocity":2.6448037868948138,"id":61},{"x":1171,"y":181,"color":"#FFCAC2","size":21.32341453846905,"baseSize":21,"sizeVelocity":-21.208143558808096,"id":62},{"x":1070,"y":138,"color":"#FFCAC2","size":28.382681981628963,"baseSize":24,"sizeVelocity":10.162686796838527,"id":63},{"x":1044,"y":248,"color":"#116699","size":23.0021711266217,"baseSize":23,"sizeVelocity":-0.011020157925986495,"id":64},{"x":953,"y":289,"color":"#CC5456","size":18.690648998855295,"baseSize":20,"sizeVelocity":15.526954416074561,"id":65},{"x":919,"y":408,"color":"#549FCC","size":24.77952541656673,"baseSize":23,"sizeVelocity":-20.855836999764772,"id":66},{"x":913,"y":495,"color":"#FFCAC2","size":20.9938752230798,"baseSize":21,"sizeVelocity":0.029961867319710924,"id":67},{"x":975,"y":564,"color":"#FFCAC2","size":20.999159794750497,"baseSize":21,"sizeVelocity":-0.004820991371114947,"id":68},{"x":1022,"y":429,"color":"#CC5456","size":20.548716891707805,"baseSize":23,"sizeVelocity":-0.403926466124024,"id":69},{"x":1043,"y":328,"color":"#116699","size":21.89625289447462,"baseSize":22,"sizeVelocity":8.153323712514343,"id":70},{"x":1149,"y":285,"color":"#CC5456","size":24.017405847096217,"baseSize":24,"sizeVelocity":-0.052820487436742565,"id":71},{"x":1061,"y":554,"color":"#FFCAC2","size":24.825354881091645,"baseSize":24,"sizeVelocity":-0.1413493035242927,"id":72},{"x":1125,"y":481,"color":"#CC5456","size":20.949771135605836,"baseSize":21,"sizeVelocity":0.03760070824713778,"id":73},{"x":1216,"y":467,"color":"#82FFEB","size":20.70573332178859,"baseSize":21,"sizeVelocity":0.052403770640170926,"id":74},{"x":1290,"y":396,"color":"#116699","size":21.998250624685628,"baseSize":22,"sizeVelocity":-0.05081713457391027,"id":75},{"x":1240,"y":301,"color":"#116699","size":22.999990941337543,"baseSize":23,"sizeVelocity":-0.0014195555085098096,"id":76},{"x":1148,"y":384,"color":"#116699","size":20.0393699006523,"baseSize":20,"sizeVelocity":0.9775956960240738,"id":77},{"x":1343,"y":747,"color":"#CC5456","size":22.017937925004883,"baseSize":22,"sizeVelocity":-0.05879662715346789,"id":78},{"x":1369,"y":937,"color":"#116699","size":20.99997519885429,"baseSize":21,"sizeVelocity":-0.00006499920326246528,"id":79},{"x":1380,"y":836,"color":"#82FFEB","size":19.721983707771994,"baseSize":20,"sizeVelocity":-0.9063763022541759,"id":80},{"x":1419,"y":698,"color":"#FFCAC2","size":20.108908758823972,"baseSize":22,"sizeVelocity":-2.51506948367178,"id":81},{"x":1467,"y":590,"color":"#CC5456","size":24.000000000149345,"baseSize":24,"sizeVelocity":1.6805301465865905e-10,"id":82},{"x":1494,"y":745,"color":"#FFCAC2","size":19.889083429471288,"baseSize":20,"sizeVelocity":-2.4213853855926697,"id":83},{"x":1546,"y":637,"color":"#FFCAC2","size":19.849911473431963,"baseSize":20,"sizeVelocity":1.4538014887845294,"id":84},{"x":1616,"y":550,"color":"#82FFEB","size":19.99594201548369,"baseSize":20,"sizeVelocity":0.033215946826409354,"id":85},{"x":1633,"y":442,"color":"#549FCC","size":25.476764474697237,"baseSize":22,"sizeVelocity":-6.261381506069824,"id":86},{"x":1579,"y":331,"color":"#549FCC","size":21.358899623040003,"baseSize":21,"sizeVelocity":-11.225191914557769,"id":87},{"x":1525,"y":208,"color":"#549FCC","size":20.672317345403123,"baseSize":20,"sizeVelocity":6.969458512451043,"id":88},{"x":1428,"y":337,"color":"#CC5456","size":21.132853539884497,"baseSize":23,"sizeVelocity":-27.567790273458094,"id":89}],"synapses":[{"from":1,"to":0,"id":0},{"from":2,"to":1,"id":1},{"from":3,"to":2,"id":2},{"from":4,"to":3,"id":3},{"from":5,"to":4,"id":4},{"from":6,"to":5,"id":5},{"from":7,"to":6,"id":6},{"from":8,"to":7,"id":7},{"from":9,"to":8,"id":8},{"from":10,"to":9,"id":9},{"from":11,"to":10,"id":10},{"from":12,"to":11,"id":11},{"from":13,"to":10,"id":12},{"from":13,"to":11,"id":13},{"from":13,"to":12,"id":14},{"from":14,"to":13,"id":15},{"from":15,"to":14,"id":16},{"from":16,"to":15,"id":17},{"from":17,"to":16,"id":18},{"from":18,"to":17,"id":19},{"from":19,"to":18,"id":20},{"from":20,"to":19,"id":21},{"from":22,"to":20,"id":22},{"from":22,"to":21,"id":23},{"from":23,"to":21,"id":24},{"from":24,"to":23,"id":25},{"from":25,"to":24,"id":26},{"from":26,"to":0,"id":27},{"from":27,"to":26,"id":28},{"from":28,"to":27,"id":29},{"from":29,"to":28,"id":30},{"from":30,"to":25,"id":31},{"from":30,"to":29,"id":32},{"from":31,"to":9,"id":33},{"from":31,"to":10,"id":34},{"from":31,"to":13,"id":35},{"from":31,"to":14,"id":36},{"from":32,"to":5,"id":37},{"from":32,"to":6,"id":38},{"from":32,"to":7,"id":39},{"from":33,"to":4,"id":40},{"from":33,"to":5,"id":41},{"from":33,"to":32,"id":42},{"from":34,"to":4,"id":43},{"from":34,"to":33,"id":44},{"from":35,"to":3,"id":45},{"from":35,"to":4,"id":46},{"from":35,"to":34,"id":47},{"from":36,"to":0,"id":48},{"from":36,"to":1,"id":49},{"from":36,"to":2,"id":50},{"from":36,"to":3,"id":51},{"from":36,"to":35,"id":52},{"from":37,"to":0,"id":53},{"from":37,"to":26,"id":54},{"from":37,"to":35,"id":55},{"from":37,"to":36,"id":56},{"from":38,"to":26,"id":57},{"from":38,"to":27,"id":58},{"from":38,"to":37,"id":59},{"from":39,"to":28,"id":60},{"from":39,"to":29,"id":61},{"from":39,"to":38,"id":62},{"from":40,"to":29,"id":63},{"from":40,"to":30,"id":64},{"from":40,"to":39,"id":65},{"from":41,"to":25,"id":66},{"from":41,"to":30,"id":67},{"from":41,"to":40,"id":68},{"from":42,"to":24,"id":69},{"from":43,"to":24,"id":70},{"from":43,"to":25,"id":71},{"from":43,"to":41,"id":72},{"from":43,"to":42,"id":73},{"from":44,"to":41,"id":74},{"from":44,"to":42,"id":75},{"from":44,"to":43,"id":76},{"from":45,"to":40,"id":77},{"from":45,"to":41,"id":78},{"from":45,"to":44,"id":79},{"from":46,"to":38,"id":80},{"from":46,"to":39,"id":81},{"from":46,"to":40,"id":82},{"from":46,"to":45,"id":83},{"from":47,"to":37,"id":84},{"from":47,"to":38,"id":85},{"from":47,"to":46,"id":86},{"from":48,"to":34,"id":87},{"from":48,"to":35,"id":88},{"from":48,"to":37,"id":89},{"from":48,"to":47,"id":90},{"from":49,"to":34,"id":91},{"from":49,"to":47,"id":92},{"from":49,"to":48,"id":93},{"from":50,"to":45,"id":94},{"from":50,"to":46,"id":95},{"from":50,"to":47,"id":96},{"from":50,"to":49,"id":97},{"from":51,"to":44,"id":98},{"from":51,"to":45,"id":99},{"from":51,"to":49,"id":100},{"from":51,"to":50,"id":101},{"from":52,"to":33,"id":102},{"from":52,"to":34,"id":103},{"from":52,"to":49,"id":104},{"from":52,"to":51,"id":105},{"from":53,"to":32,"id":106},{"from":53,"to":33,"id":107},{"from":53,"to":52,"id":108},{"from":54,"to":8,"id":109},{"from":54,"to":32,"id":110},{"from":54,"to":53,"id":111},{"from":55,"to":8,"id":112},{"from":55,"to":9,"id":113},{"from":55,"to":31,"id":114},{"from":55,"to":54,"id":115},{"from":56,"to":31,"id":116},{"from":56,"to":55,"id":117},{"from":57,"to":14,"id":118},{"from":57,"to":15,"id":119},{"from":57,"to":31,"id":120},{"from":57,"to":56,"id":121},{"from":58,"to":15,"id":122},{"from":58,"to":16,"id":123},{"from":58,"to":57,"id":124},{"from":59,"to":16,"id":125},{"from":59,"to":17,"id":126},{"from":59,"to":18,"id":127},{"from":59,"to":58,"id":128},{"from":60,"to":19,"id":129},{"from":60,"to":20,"id":130},{"from":60,"to":59,"id":131},{"from":61,"to":20,"id":132},{"from":61,"to":21,"id":133},{"from":61,"to":22,"id":134},{"from":61,"to":60,"id":135},{"from":62,"to":21,"id":136},{"from":62,"to":23,"id":137},{"from":62,"to":61,"id":138},{"from":63,"to":23,"id":139},{"from":63,"to":24,"id":140},{"from":63,"to":42,"id":141},{"from":63,"to":62,"id":142},{"from":64,"to":42,"id":143},{"from":64,"to":62,"id":144},{"from":64,"to":63,"id":145},{"from":65,"to":44,"id":146},{"from":65,"to":51,"id":147},{"from":65,"to":64,"id":148},{"from":66,"to":51,"id":149},{"from":66,"to":52,"id":150},{"from":66,"to":65,"id":151},{"from":67,"to":52,"id":152},{"from":67,"to":53,"id":153},{"from":67,"to":66,"id":154},{"from":68,"to":53,"id":155},{"from":68,"to":54,"id":156},{"from":68,"to":55,"id":157},{"from":68,"to":67,"id":158},{"from":69,"to":66,"id":159},{"from":69,"to":67,"id":160},{"from":69,"to":68,"id":161},{"from":70,"to":64,"id":162},{"from":70,"to":65,"id":163},{"from":70,"to":66,"id":164},{"from":70,"to":69,"id":165},{"from":71,"to":62,"id":166},{"from":71,"to":64,"id":167},{"from":71,"to":70,"id":168},{"from":72,"to":55,"id":169},{"from":72,"to":56,"id":170},{"from":72,"to":68,"id":171},{"from":72,"to":69,"id":172},{"from":73,"to":56,"id":173},{"from":73,"to":69,"id":174},{"from":73,"to":72,"id":175},{"from":74,"to":56,"id":176},{"from":74,"to":58,"id":177},{"from":74,"to":73,"id":178},{"from":75,"to":58,"id":179},{"from":75,"to":59,"id":180},{"from":75,"to":60,"id":181},{"from":75,"to":74,"id":182},{"from":76,"to":60,"id":183},{"from":76,"to":61,"id":184},{"from":76,"to":62,"id":185},{"from":76,"to":71,"id":186},{"from":76,"to":75,"id":187},{"from":77,"to":69,"id":188},{"from":77,"to":70,"id":189},{"from":77,"to":71,"id":190},{"from":77,"to":73,"id":191},{"from":77,"to":74,"id":192},{"from":77,"to":75,"id":193},{"from":77,"to":76,"id":194},{"from":78,"to":13,"id":195},{"from":78,"to":14,"id":196},{"from":78,"to":15,"id":197},{"from":79,"to":12,"id":198},{"from":80,"to":12,"id":199},{"from":80,"to":13,"id":200},{"from":80,"to":78,"id":201},{"from":80,"to":79,"id":202},{"from":81,"to":15,"id":203},{"from":81,"to":16,"id":204},{"from":81,"to":78,"id":205},{"from":81,"to":80,"id":206},{"from":82,"to":16,"id":207},{"from":82,"to":17,"id":208},{"from":82,"to":81,"id":209},{"from":83,"to":80,"id":210},{"from":83,"to":81,"id":211},{"from":84,"to":81,"id":212},{"from":84,"to":82,"id":213},{"from":84,"to":83,"id":214},{"from":85,"to":17,"id":215},{"from":85,"to":84,"id":216},{"from":86,"to":17,"id":217},{"from":86,"to":18,"id":218},{"from":86,"to":85,"id":219},{"from":87,"to":18,"id":220},{"from":87,"to":19,"id":221},{"from":87,"to":86,"id":222},{"from":88,"to":19,"id":223},{"from":88,"to":20,"id":224},{"from":88,"to":87,"id":225},{"from":89,"to":18,"id":226},{"from":89,"to":19,"id":227},{"from":89,"to":59,"id":228},{"from":89,"to":60,"id":229}]};

let brain = new Brain(savedBrain);
window.requestAnimationFrame(anim);