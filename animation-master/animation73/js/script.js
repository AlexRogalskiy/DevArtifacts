var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};

var canvasWidth = 300,
    canvasHeight = canvasWidth,
    length = 8,
    margin = 10,
    strokeWidth = 2,
    columns = getNoOfCols(canvasWidth, length, margin),
    rows = getNoOfRows(canvasHeight, strokeWidth, margin);

function setup() {
  createCanvas(canvasWidth,canvasHeight);
}

function getNoOfCols(w, length, m) {
  var totalLength = 0,
      noOfCols = 0;
  
  m = m || 0;
  
  while(totalLength < w) {
    totalLength += m+length;
    noOfCols++;
  }
  
  return noOfCols;
}

function getNoOfRows(h, sw, m) {
  return getNoOfCols(h, sw, m);
}

function draw() {
  background(34)
  for(var i = 0; i < rows-1; i++) {
      for(var j = 0; j < columns-1; j++) {
        var currentOffset = {
          x: ((j*length)) + ((j+1)*margin),
          y: ((i+1)*margin) + (i*strokeWidth) + strokeWidth
        };
        
        var centerPoint = {
          x: (currentOffset.x + (currentOffset.x + length))/2,
          y: (currentOffset.y + (currentOffset.y + length))/2
        };
        
        var delta = {
          x: (currentOffset.x + (length/2) - (margin/2)) - mouseX,
          y: currentOffset.y - mouseY
        };
        
        var theta = Math.atan2(delta.y, delta.x),
            deltaThreshold = 40,
            mainColor = color(colors.a2);
        
        strokeWeight(strokeWidth);
        stroke(mainColor);
        
        if(Math.abs(delta.x) < deltaThreshold && Math.abs(delta.y) < deltaThreshold) {
          var amt = (Math.abs(delta.x) + Math.abs(delta.y)) / 2;
          var amtMapped = map(amt, 0, deltaThreshold, -50, 255);
          stroke(79, 255, 144, amtMapped)
        }
        
        push();
        // translate(centerPoint.x, centerPoint.y);
        translate(currentOffset.x, currentOffset.y);
        rotate(theta);
        
        line(0, 0, 0 + length, 0);
        pop();
        
        fill(255);
        noStroke();
        ellipse(mouseX, mouseY, 8, 8)
      }
    }
}