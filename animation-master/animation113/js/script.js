
const backgroundColor = 0x222831;

/*////////////////////////////////////////*/

var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();

/*////////////////////////////////////////*/

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(backgroundColor, 30, 300);

//var camera = new THREE.PerspectiveCamera(9, window.innerWidth / window.innerHeight, 0.1, 1000 );

var frustumSize = 3;
var aspect = window.innerWidth / window.innerHeight;
camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 );
camera.position.y = 400;

scene.add( camera );
camera.position.set(10, 10, 10);
camera.lookAt(new THREE.Vector3(0,0,0));

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( backgroundColor );

window.addEventListener( 'resize', function () {
  // camera.aspect = window.innerWidth / window.innerHeight;
  
  

  var aspect = window.innerWidth / window.innerHeight;

  camera.left   = - frustumSize * aspect / 2;
  camera.right  =   frustumSize * aspect / 2;
  camera.top    =   frustumSize / 2;
  camera.bottom = - frustumSize / 2;
  
  camera.updateProjectionMatrix();
  
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

document.body.appendChild( renderer.domElement);

function renderScene(){ renderer.render( scene, camera ); }
renderCalls.push(renderScene);



/* ////////////////////////////////////////////////////////////////////////// */


function alphaMap(){
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      width = canvas.width = 128,
      height = canvas.height = 128;

  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#000';
  ctx.fillRect(1, 1, width - 2, height - 2);

  //let sprite = 
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load(canvas.toDataURL());
  return texture;
}

var tex = alphaMap();
tex.magFilter = THREE.NearestFilter;
tex.wrapS = THREE.ClampToEdgeWrapping;
tex.wrapT = THREE.ClampToEdgeWrapping;
tex.anisotropy = 2;

var geo = new THREE.BoxGeometry(1,1,1);
var mat = new THREE.MeshBasicMaterial({ 
  depthTest: false,
  depthWrite: false,
  transparent: true,
  alphaMap: tex,
  opacity: 0.95,
  side: THREE.DoubleSide
});

var cube = new THREE.Mesh(geo, mat);

cube.material.color.set('#E23E57');//setHSL(0, 1.0, 0.6);
cube.material.color.offsetHSL(0.02, 0.02, 0);

var cubes = new THREE.Group();

for (var i = 0, total = 8; i < total; i++) {
  var clone = cube.clone();
  clone.material = clone.material.clone();
  clone.material.color.offsetHSL( 
    0.15 * (i / total), 
    0, 
    0.15 * (i / total)
  );
  clone.scale.set(
    1 - 0.9 * (i/total), 
    1, // + 0.6 * (i/total), 
    1 - 0.9 * (i/total)
  );
  cubes.add(clone);
}

scene.add(cubes);

/* ////////////////////////////////////////////////////////////////////////// */


var tl = new TimelineMax({
  repeat: -1,
  delay: 0.9,
  repeatDelay: 0.2,
  yoyo: true
});

tl.timeScale(0.8);

cubes.children.forEach((cube,i,arr)=>{

  tl.addLabel(
    'cube'+i, 
    0.75 * Power2.easeOut.getRatio( 1 - i / arr.length )
  );

  tl.to(
    cube.rotation, 
    5, 
    {
      z: Math.PI * 2,
      x: Math.PI * -2,
      ease:  Expo.easeInOut, 
    }, 
    'cube'+i);

  tl.to(
    cube.scale, 
    1.25, 
    {
      y: 1 - 0.9 * (i/arr.length), 
      ease: Expo.easeInOut, 
    }, 
    'cube'+i);

  tl.to(
    cube.scale, 
    1.25, 
    {
      y: 1, 
      ease: Expo.easeInOut, 
    }, 
    3 + ( 0.75 * Power2.easeIn.getRatio( i / arr.length ))
  );

});


tl.to(
  tex.offset, 
  1.25, 
  {
    x: 1,
    y: 1,
    ease: Power2.easeIn
  },2.25);


tl.to(
  cubes.rotation, 
  5.75, 
  {
    x: Math.PI * 2,
    z: Math.PI * -2,
    ease: Expo.easeInOut,
  }, 
  0.25);



/* ////////////////////////////////////////////////////////////////////////// */


var group = new THREE.Group();
group.add(cubes);
scene.add(group);


var twoPI = Math.PI * 2;
var quarterAngle = Math.PI/4;

var drag = {
  
  x: 0, y: 0, dragging: false,
  
  setPosition(e,start){
    if ( !e ) { return; }
    e.preventDefault();
    var event = e.touches ? e.touches[0] : e ;
    this.x = event.pageX;
    this.y = event.pageY;
    if ( start ) {
      this.startX = this.x;
      this.startY = this.y;
    }
  },
  
  move(e) {
    if ( this.dragging ) { this.setPosition(e); this.onUpdate(); }
  },
  
  start(e) {
    this.dragging = true;
    this.setPosition(e, true);
    this.onStart();
    this.onUpdate();
  },
  
  end(e){
    if ( this.dragging ) {
      this.dragging = false;
      this.setPosition(e);
      this.onUpdate();
      this.onEnd();
    }
  },
  
  onUpdate: function(){
    this.el.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
  },
  onStart: function(){},
  onEnd: function(){},
  
  register(el) {
    
    this.el = el || this.el;
    
    if ( this.el ) {
      this.el.addEventListener('mousedown',this.start.bind(this));
      document.addEventListener('mousemove',this.move.bind(this));
      document.addEventListener('mouseup',this.end.bind(this)); 
      this.end();
    }
  }
};

drag.register(document.body);
drag.onStart = function(){
  this._startRotation = group.rotation.y || 0;
  TweenLite.to(tl, 1.5, { timeScale: 0.2, ease: Power4.easeOut });
}

drag.onUpdate = function(x, y){
  var r = (this.x - this.startX) / window.innerWidth;
  group.rotation.y = this._startRotation + (r * twoPI);
};

drag.onEnd = function() { 
  var resetTL = new TimelineLite();
  // Round to the nearest 45degs
  resetTL.to(group.rotation, 0.8, { 
    y: Math.round( group.rotation.y / quarterAngle ) * quarterAngle,
    ease: Power3.easeInOut
  }, 0);
  resetTL.to(tl, 0.8, { timeScale: 0.8, ease: Power3.easeIn }, 0.5);
};