var circles = [];
var rate = 3200;

function setup() {
  createCanvas(1600, 1600);
  stroke(0);
  noFill();
  colorMode(HSB, 360, 100, 100, 100);
  
  for (var i = -40 ; i < 1920; i+=40) {
    for(var j= -40; j< 1920; j+=40) {
      var positionCi = createVector(j,i);
      circles.push(positionCi);
    }
  }  
}

function draw() {

  var time = millis() % 10000;
  var hue = map(time, 0, 10000, 0, 360);
      
  background(hue, 60, 100);

  
  for (var i = 0; i < circles.length; i++) {  

      var x = circles[i].x;
      var y = circles[i].y;
    
      var row = floor (i / (1920));
      var column = (i % (1920));

    	x += (row % 2 === 0) ? sin(millis() / rate) * 40 : sin(millis() / rate) * -40;
    	y += (column % 2 === 0) ? cos(millis() / rate) * 40 : cos(millis() / rate) * -40;
    
      var d = 35;      
      strokeWeight((sin(i*50)+1)*10+3);
      ellipse(x,y,d+(cos(i/3)),d+(cos(i/3)));
  }
}
