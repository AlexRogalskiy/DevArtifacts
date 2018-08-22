class Perceptron{
  constructor(){
    this.weights = new Array(3);
    for(let i = 0, n = 3; i < n; i++){
      this.weights[i] = (Math.random() * 2 ) - 1;
    }
  }
  
  feed(inputs){
    let sum = 0;
    for(let i = 0, len = this.weights.length; i < len; i++){
      sum += inputs[i] * this.weights[i];
    }
      
    return this.activate(sum);
  }
  
  activate(sum){
    return (sum > 0)? 1 : -1;
  }
  
  train(inputs, desired){
    const c = 2;
    let guess = this.feed(inputs);
    let error = desired - guess;
    
    for(let i = 0, len = this.weights.length; i < len; i++){
      this.weights[i] += parseInt(c * error * inputs[i]);
    }
  }
}

class Trainer{
  constructor(x, y, a){
    this.inputs = new Array(3);
    this.inputs[0] = x;
    this.inputs[1] = y;
    this.inputs[2] = 1;
    this.answer = a;
  }
}

const NUM_POINTS = 5000;
const COLOR_POS = '#212121';
const COLOR_NEG = '#bdbdbd';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ptron = new Perceptron();
var trainers = new Array(NUM_POINTS); //array of n trainers
var currentTrainer = 0;

function init(){
  let width = window.innerWidth;
  let height= window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle='#eeeeee';
  ctx.fillRect(0, 0, width, height);
  
  for(let i = 0, len = trainers.length; i < len; i++){
    let x = Math.floor(Math.random() * width),
        y = Math.floor(Math.random() * height);
    let answer = (y > (height/width)*x)? 1 : -1;
    trainers[i] = new Trainer(x, y, answer);
  }
}

function draw(){
  ptron.train(
    trainers[currentTrainer].inputs, trainers[currentTrainer].answer
  );

  for(let i = 0; i < currentTrainer; i++){
    ctx.beginPath();
    ctx.arc(
       trainers[i].inputs[0], trainers[i].inputs[1], 4, 0, 2 * Math.PI,
      false
    );
    ctx.fillStyle = (ptron.feed(trainers[i].inputs) > 0)?                        COLOR_POS: COLOR_NEG;
    ctx.fill();
  }
  
  currentTrainer++;
  if(currentTrainer < NUM_POINTS)
    requestAnimationFrame(draw);
  else
    console.log(ptron);
}
 
init();
draw();