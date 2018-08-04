TweenLite.set('#compass', {transformOrigin:"50% 50%"})

Draggable.create("#compass", {
  type: "rotation", 
  throwProps:true,
  onThrowUpdate:spinHearts});

function spinHearts(){
TweenMax.to('#hearts',.25,{
  rotation:'-=30',
  transformOrigin:'50% 50%',
  ease:Linear.easeInOut,
  onComplete:spinBack})
}

function spinBack() {
TweenMax.to('#hearts',3.5,{
  rotation:0,
  transformOrigin:'50% 50%',
  ease:Power3.easeInOut})
}

