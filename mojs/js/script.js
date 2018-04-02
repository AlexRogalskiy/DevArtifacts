const redCirc = new mojs.Shape({
  left:0, 
  top: 0, 
  fill:           'none',
  stroke:         'red',
  radius: 15,
  strokeWidth:    10,
 
  
  duration:       100
})
.then({
  strokeWidth:    0,
  scale:          { 1: 2, easing: 'sin.in' },
  duration: 500
});

const sparks = new mojs.Burst({
   left:0,  
  top: 0,  
  radius: {0:30, easing:'cubic.out'},
  angle:{0: 90,easing:'quad.out'},
  children:{
    shape: 'cross',
    stroke: 'white',
    points: 12,
    radius:10,
    fill:'none',
    angle:{0:360},
    duration:300
    
  }
 
  
});

const redSparks = new mojs.Burst({
  left: 0, top: 0, 
  count:8,
  radius: { 150: 350 },
  angle: {0:90 ,easing:'cubic.out'},
  children: {
    shape: 'line',
    stroke: {'red':'transparent'},
    strokeWidth: 5,
    scaleX: {  0.5:0},
    degreeShift:  'rand(-90, 90)',
    radius:       'rand(20, 300)',
    duration:     200,
    delay:        'rand(0, 150)',
 
  }
});

const triangles = new mojs.Burst({
  radius: { 0 : 1000,easing: 'cubic.out'},
  angle:  {1080 : 0,easing: 'quad.out'},
  left: 0,        top: 0,  
  count: 20,
  children : {
    shape: 'polygon',
    points: 3,
    radius: { 10 : 100 },
    fill: ['red','yellow','blue','green'],
    duration: 3000
  }
});

const pentagons = new mojs.Burst({
  radius: { 0 : 1000,easing: 'cubic.out'},
  angle: {0 : 720,easing: 'quad.out'},
  left: 0,        top: 0,  
  count: 20,
  children : {
    shape: 'polygon',
    radius: { 1 : 300 },
    points: 5,
    fill: ['purple','pink','yellow','green'], 
    delay:500,
    duration: 3000
  }
});

const lines = new mojs.Burst({
  radius: { 0 : 1000,easing: 'cubic.out'},
  angle: {0 : 1440,easing: 'cubic.out'},
  left: 0,        top: 0,
  count: 50, 
  children : {
    shape: 'line',
    radius: { 1 : 100,easing:'elastic.out' },
    fill: 'none',
    stroke: ['red','orange'],
    delay:         'stagger(10)',
    duration: 1000
  }
});

const redSquares = new mojs.Burst({
  radius: { 0 : 1000,easing: 'cubic.out'},
  angle: {360 : 0,easing: 'quad.out'},
  left: 0,        top: 0, 
  count: 20,
  children : {
    shape: 'rect',
    radiusX: { 1 : 1000 },
    radiusY:50,
    points: 5,
    fill: 'none',
    stroke: {'red':'orange'}, 
    strokeWidth:{5:15},
    delay:1000,
    duration: 3000
  }
});



document.addEventListener( 'click', function (e) {
  
   redCirc
    .tune({ x: e.pageX, y: e.pageY,  })
    .replay();
  
     sparks
    .tune({ x: e.pageX, y: e.pageY  })
    .replay();

    redSparks
    .tune({ x: e.pageX, y: e.pageY  })
    .replay()
    .generate();
  
      triangles
    .tune({ x: e.pageX, y: e.pageY,})
    .replay()
  
     pentagons
    .tune({ x: e.pageX, y: e.pageY,})
    .replay()
  
   lines
    .tune({ x: e.pageX, y: e.pageY,})
    .replay()
  
  redSquares
    .tune({ x: e.pageX, y: e.pageY,})
    .replay()
    

});