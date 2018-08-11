const redCirc = new mojs.Shape({
  left:0,  // After event listener
  top: 0,  // After event listener
  fill:           'none',
  stroke:         'red',
  radius: 15,
  strokeWidth:    10,
 
  
  duration:       100
})
.then({
  strokeWidth:    0,
  //stroke:         {'red':'transparent',easing:'cubic.out'},
  scale:          { to: 2, easing: 'sin.in' },
  duration: 500
});

const sparks = new mojs.Burst({
   left:0,  // After event listener
  top: 0,  // After event listener
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
  left: 0, top: 0,  // After event listener
  count:          8,
  radius:         { 50: 100 },
  angle:{0: 720,easing:'quad.out'},
  children: {
    shape:        'line',
    stroke:     {'red':'transparent'},
    scale:        1,
    scaleX:       {  1:0},
    
   pathScale:    'rand(.5, 1.25)',
    degreeShift:  'rand(-90, 90)',
    radius:       'rand(20, 40)',
    duration:     200,
    delay:        'rand(0, 150)',
    isForce3d:    true
  }
});

const triangles = new mojs.Burst({
  radius: { 0 : 1000,easing: 'cubic.out'},
  angle:  {1080 : 0,easing: 'quad.out'}, // Start 360 to show spin, change to 1080 for effect
  left: 0,        top: 0,  // After event listener
  count: 20,
  children : {
    shape: 'polygon',
    points: 3,
    angle: { 360: 0},
    radius: { 10 : 100 },
    fill: ['red','yellow','blue','green'],
    duration: 3000
  }
});

const pentagons = new mojs.Burst({
  radius: { 0 : 1000,easing: 'cubic.out'},
  angle: {0 : 720,easing: 'quad.out'},
  left: 0,        top: 0,  // After event listener
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
  left: 0,        top: 0,  // After event listener
  count: 20,
  children : {
    shape: 'rect',
    radiusX: { 1 : 1000 },
    radiusY:50, // error here   
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