var randomX,
    randomY,
    canvas,
    ctx;

var strokeColor = 'rgb(200,200,200)';

function initConnections() {
  canvas = document.getElementById('connections');
  ctx = canvas.getContext('2d');
  
  resizeCanvas();
  
  // Draw random point in canvas
  originPoint();
  
  getTitles();
}

function resizeCanvas() {
  
    canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
  
  var devicePixelRatio = window.devicePixelRatio || 1,
      backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1,
      ratio = devicePixelRatio / backingStoreRatio;
  
  if (devicePixelRatio !== backingStoreRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    
    ctx.scale(ratio, ratio);
    
  }
}

function originPoint() {
  randomX = Math.random() * canvas.width;
  randomY = Math.random() * canvas.height;
  
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.arc(randomX, randomY, 20, 0, 2*Math.PI);
  ctx.stroke();
}

function getTitles() {
    var titles = document.getElementsByTagName('h1');
  var tOffsets = {};
  var tSizes = {};
  
  for (var i = 0; i < titles.length; i++) {
    tOffsets[i] = { 'top': titles[i].offsetTop, 'left': titles[i].offsetLeft };
    
    tSizes[i] = { 'width': titles[i].offsetWidth, 'height': titles[i].offsetHeight };
  }
  
  // Draw containers around title elements
  for (t in tSizes) {
    
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(tOffsets[t].left, tOffsets[t].top, tSizes[t].width, tSizes[t].height);
    ctx.stroke();
    
  }
  
  drawTitlePoints(tOffsets, tSizes);
}

function drawTitlePoints(tOff, tSizes) {
  for (t in tOff) {
    
    tOff[t].left = tOff[t].left + Math.random() * tSizes[t].width;
    tOff[t].top += 20;
    
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.arc(tOff[t].left, tOff[t].top, 5, 0, 2*Math.PI);
    ctx.stroke();
    
  }
  
  drawConnections(tOff);
}

function drawConnections(tOff) {
  for (t in tOff) {
    
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(tOff[t].left, tOff[t].top);
    ctx.lineTo(randomX, randomY);
    ctx.stroke();
    
  }
}


window.onload = function() {
  initConnections();
}