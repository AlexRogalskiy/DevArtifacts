// MATH FOLKS: abandon all hope ye who enter here.
// Looooots of 'eh this might be kinda right?' maths-ish guesswork ahead.
// Sorry friends.

var bridge = document.getElementById('bridgePath'),
    clip = document.getElementById("bridgeClipPath"),
    towers = document.getElementsByClassName('tower'),
    ropes = document.getElementById('ropes'),
    bridgePath = bridge.getAttribute('d').split(' '),
    startDragX,
    startDragY,
    multiplier = 1,
    dragXOffset = 0,
    dragYOffset = 0;

var leftTower = new Tower(towers[0].getAttribute('d'));
var rightTower = new Tower(towers[1].getAttribute('d'));

var bridgeCurves = {
  leftCurve: new Curve(bridgePath.slice(1, 4)),
  midCurve : new Curve(bridgePath.slice(4, 7)),
  rightCurve : new Curve(bridgePath.slice(7,10))
}

function Tower(def) {
  var defArray = def.split(' ');
  this.startPosition = {
    x: defArray[0].split(',')[0].replace('M',''),
    y: defArray[0].split(',')[1]
  }
  this.length = defArray[1].split(',')[1];
}

Tower.prototype.buildPath = function(){
  return "M"+this.startPosition.x+","+this.startPosition.y+" L"+this.startPosition.x+","+this.length;
}

function Curve(curveArray) {
  var startControl = curveArray[0].split(','),
      endControl = curveArray[1].split(','),
      endPoint = curveArray[2].split(',');
  this.startCtrlX = parseInt(startControl[0].replace('C',''));
  this.startCtrlY = parseInt(startControl[1]);
  this.endCtrlX = parseInt(endControl[0]);
  this.endCtrlY = parseInt(endControl[1]);
  this.endPtX = parseInt(endPoint[0]);
  this.endPtY = parseInt(endPoint[1]);
}
Curve.prototype.toString = function(){
  return (
    "C"
    + this.startCtrlX + ","
    + this.startCtrlY + "," + " "
    + this.endCtrlX + ","
    + this.endCtrlY + "," + " "
    + this.endPtX + ","
    + this.endPtY + " "
  );
}

bridgeCurves.leftCurve.setBounds = function() {
  this.lockStartCtrlBound = this.endCtrlX - this.startCtrlX;
  this.lockEndCtrlBound = this.endPtX - this.endCtrlX;
  this.endPtMaxBound = (this.endPtX + bridgeCurves.midCurve.endPtX)/2.3;
  this.minHeight = this.endPtY;
}

bridgeCurves.leftCurve.applyForce = function(forceX, forceY) {
  
  this.endPtY -= forceY; 
  
  // Technically this is applying a bound not the force,
  // but if the end point would be placed too far inward
  // then it makes sense to skip everything entirely, so let's
  // bail early if possible.
  if ((this.endPtX - forceX) >= this.endPtMaxBound) {
    this.endPtX = this.endPtMaxBound;
    this.applyBoundaries();
    return;
  }

  this.startCtrlX -= forceX;
  this.endCtrlX -= forceX;
  this.endPtX -= forceX;
  this.applyBoundaries();
}

bridgeCurves.leftCurve.applyBoundaries = function(){
  
  // First thing's first, don't let the first control handle go out of bounds!
  this.startCtrlX = Math.max(this.startCtrlX, 0);
  
  // ... We also don't want the second control handle going anywhere crazy
  this.endCtrlX = Math.max(this.endCtrlX, 0);
  
  // Finally, make sure the end point of the curve stays in bounds. 
  this.endPtX = Math.max(this.endPtX, 0);
  
  // The next part is a bit trickier.
  // If the second control handle hasn't hit its starting point, 
  // we don't want to move the first control handle.
  // This is applicable when moving inward only, basically it 
  // lets the second handle get ahead of the first one.
  if (this.endCtrlX <= this.lockStartCtrlBound) {
    this.startCtrlX = 0;
  }
  
  // Similarly, if the end point of the curve hasn't
  // at least passed where the second control handle started,
  // don't move that control handle just yet.
  if (this.endPtX <= this.lockEndCtrlBound) {
    this.endCtrlX = 0;
  }
  if (this.endPtY >= this.minHeight) {
    this.endPtY = this.minHeight;
  }
}

bridgeCurves.midCurve.setBounds = function() {
  this.startCtrlMinBound = bridgeCurves.leftCurve.endPtX;
  this.endCtrlMaxBound = this.endPtX;
  this.midPointBound = (bridgeCurves.leftCurve.endPtX + this.endPtX)/2;
  this.minYBound = this.startCtrlY * .4;
  this.maxYBound = this.startCtrlY;
  this.minHeight = this.endPtY;
  this.initialEndPointX = this.endPtX;
}

bridgeCurves.midCurve.applyForce = function(forceX, forceY) {
  this.startCtrlX -= forceX;
  this.endCtrlX += forceX;
  if (this.endPtX <= this.initialEndPointX) {
    this.startCtrlY += forceX/2; 
  this.endCtrlY += forceX/2;
  }
  this.endPtY -= forceY;
  this.applyBoundaries();
}

bridgeCurves.midCurve.applyBoundaries = function() {
  if (this.startCtrlY < this.minYBound) {
    this.startCtrlY = this.minYBound;
    this.endCtrlY = this.minYBound;
  }
  if (this.startCtrlY > this.maxYBound) {
    this.startCtrlY = this.maxYBound;
    this.endCtrlY = this.maxYBound;
  }
  if (this.startCtrlX >= this.midPointBound) {
    this.startCtrlX = this.midPointBound;
  }
  if (this.endCtrlX <= this.midPointBound) {
    this.endCtrlX = this.midPointBound;
  }
  this.startCtrlX = Math.max(this.startCtrlX, this.startCtrlMinBound);
  this.endCtrlX = Math.min(this.endCtrlX, this.endCtrlMaxBound);
  if (this.endPtY > this.minHeight) {
    this.endPtY = this.minHeight;
  }
}

bridgeCurves.rightCurve.setBounds = function() {
  this.startPtMinBound = this.endPtX - bridgeCurves.leftCurve.endPtMaxBound;
  this.endCtrlLockBound = this.endCtrlX;
  this.lockStartCtrlBound = this.endPtX - ( this.startCtrlX - bridgeCurves.midCurve.endPtX );
  this.lockEndCtrlBound = this.endPtX - (this.endCtrlX - this.startCtrlX);

}

bridgeCurves.rightCurve.applyForce = function(forceX) {

  if ( (bridgeCurves.midCurve.endPtX + forceX) <= this.startPtMinBound) {
    bridgeCurves.midCurve.endPtX = this.startPtMinBound;
    return;
  }
  bridgeCurves.midCurve.endPtX += forceX;
  this.startCtrlX += forceX;
  this.endCtrlX += forceX;
  this.applyBoundaries();
}

bridgeCurves.rightCurve.applyBoundaries = function(){
  // Right off the bat this gets a litle goofy because the *start* point for this curve
  // is really the *end* point for the middle curve. 
  // That said, let's go ahead and prevent if from going too far inward.
  bridgeCurves.midCurve.endPtX = Math.max(bridgeCurves.midCurve.endPtX, this.startPtMinBound);
  
  // Then let's stop it from flying off the page outward
  if (bridgeCurves.midCurve.endPtX >= this.endPtX) {
    bridgeCurves.midCurve.endPtX = this.endPtX;
  }
  
  // Then we'll prevent the end control handle of the curve from 
  // going out of bounds
  this.endCtrlX = Math.min(this.endCtrlX, this.endPtX);
  
  // Lastly, the start handle needs to stay in there too.
  this.startCtrlX = Math.min(this.startCtrlX, this.endPtX);
  
  // Now we're back to the tricky bit... 

  if (this.startCtrlX >= this.lockEndCtrlBound) {
    this.endCtrlX = this.endPtX;
  }
  if (bridgeCurves.midCurve.endPtX >= this.lockStartCtrlBound) {
    this.startCtrlX = this.endPtX;
  }
}

function buildBridgePath(bridgeCurves) {
  var leftString = bridgeCurves.leftCurve.toString(),
      midString = bridgeCurves.midCurve.toString(),
      rightString = bridgeCurves.rightCurve.toString();
  return "M0,100" + leftString + midString + rightString + "L0, 100";
}

function drawBridge(){ //lol
  bridge.setAttribute('d', buildBridgePath(bridgeCurves));
  bridgeClipPath.setAttribute('d', buildBridgePath(bridgeCurves));
  towers[0].setAttribute('d', leftTower.buildPath());
  towers[1].setAttribute('d', rightTower.buildPath());
  
}

function startDrag(e) {
  multiplier = (e.target.getAttribute('id') == 'rightTower') ? -1 : 1;
  e.preventDefault();
  startDragX = e.pageX;
  startDragY = e.pageY;
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
}

function drag(e) {
  dragXOffset = startDragX - e.pageX;
  dragYOffset = startDragY - e.pageY;
  startDragX = e.pageX;
  startDragY = e.pageY;
  applyDragToBridge();
  attachTowersToBridge();
  requestAnimationFrame(drawBridge);
}

function attachTowersToBridge() {
  leftTower.startPosition.x = bridgeCurves.leftCurve.endPtX;
  leftTower.length = bridgeCurves.leftCurve.endPtY - 10;
  rightTower.startPosition.x = bridgeCurves.midCurve.endPtX;
  rightTower.length = leftTower.length;
}
function endDrag() {
  dragXOffset = 0;
  dragYOffset = 0;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
}

function applyDragToBridge(){
  bridgeCurves.leftCurve.applyForce(dragXOffset*multiplier, dragYOffset);
  bridgeCurves.midCurve.applyForce(dragXOffset*multiplier, dragYOffset);
  bridgeCurves.rightCurve.applyForce(dragXOffset*multiplier);
}

function init() {
  bridgeCurves.leftCurve.setBounds();
  bridgeCurves.midCurve.setBounds();
  bridgeCurves.rightCurve.setBounds();
  eachTower(function(){
    this.addEventListener('mousedown', startDrag);
  });
}

function eachTower(callback) {
  for (var i=0; i<towers.length; i++){
    callback.bind(towers[i])(); //apparently this worked? Literally was guessing on syntax.
  }
}

init();