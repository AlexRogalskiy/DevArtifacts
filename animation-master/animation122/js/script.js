Nebula = {};
var local = Nebula;

local.wHalfX = window.innerWidth / 2;
local.wHalfY = window.innerHeight / 2;
local.mouseX = 0;
local.mouseY = 0;
local.materials = [];
local.matColors = [];
local.geometries = [];
local.particleSystems = [];
local.particleRotations = [];

local.init = function() 
{ 
  new Date().getTime(); 

  local.container = document.createElement( 'div' );
  document.body.appendChild( local.container );
  
  local.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 2, 4000 );
  local.camera.position.z = 2100;
  
  local.scene = new THREE.Scene();
  local.scene.fog = new THREE.FogExp2( 0x000000, 0.0006 ); 
  
  local.spinValues = {x:0,y:0,z:0,camDist:local.camera.position.z};
    
  local.setSpinning();
  
  var i=0;
  var limit = 15;
  for (i=0;i<limit;++i)
    {
      local.generateParticleSystem(Math.random()*1000+200*i, 250+Math.random()*10*(i*i+1), Math.random()*10+2);
    }
 
  
  
  local.renderer = new THREE.WebGLRenderer( { clearAlpha: 1,antialias:true} );
  local.renderer.setSize( window.innerWidth, window.innerHeight );
  local.renderer.autoClear = false;
  local.container.appendChild( local.renderer.domElement );
  
  //composer2 = new THREE.EffectComposer( local.renderer, renderTarget );
  
  
  local.render();
  
  
  $(document).on('mousemove', local.onDocumentMouseMove);
  $(document).on('mousewheel', local.onDocumentMouseWheel);
  $(window).on('resize', local.onWindowResize);
};

local.generateParticleGeometry = function(nodes, range) {
  var geometry = new THREE.Geometry();
  if (nodes === undefined) nodes = 100;
  nodes = Math.floor(nodes);
  if (range === undefined) range = 500;
  var r = 500;
  for ( i = 0; i < nodes; i ++ ) {

      var vertex = new THREE.Vector3();  
      var theta = Math.random()*2*Math.PI;
      var phi = Math.random()*Math.PI;       
    
    
    
    var initX = range * Math.sin(theta)*Math.cos(phi);// 
    var initY = range * Math.sin(theta)*Math.sin(phi);// 
    var initZ = Math.cos(theta)*range;

    vertex.x = initX;//Math.sin(i) * i;
    vertex.y = initY;// Math.cos(i) * i;//Math.random()*100;
    vertex.z = initZ;//Math.random()*1000;

    geometry.vertices.push( vertex );
    
     var tartheta = theta + 1*Math.PI/180;//Math.random()*2*Math.PI;
      var tarphi = phi + 1*Math.PI/180;////Math.random()*Math.PI;
    
    var tarX = range*4 * Math.sin(tartheta)*Math.cos(tarphi);
    var speedX = Math.abs(vertex.x - tarX)/100;
   
    var tarY = range*4 * Math.sin(tartheta)*Math.sin(tarphi); 
    var speedY = Math.abs(vertex.y - tarY)/100;
    var tarZ = Math.cos(tartheta)*range*4;
    var speedZ = Math.abs(vertex.z - tarZ)/100; 
    TweenMax.to(vertex,speedX,{
      x:tarX,
      ease:Quad.easeInOut,
      delay:i/500,//Math.random(),
      yoyo:true,
      repeat:-1
    });
    
    TweenMax.to(vertex,speedY,{
      y:tarY,
      ease:Quad.easeInOut,
    delay:i/500,//Math.random(),
    yoyo:true,
    repeat:-1
    });
    
    TweenMax.to(vertex,speedZ,{
      z:tarZ,//Math.random()*100,
      ease:Quad.easeInOut,
      delay:i/500,//Math.random(),
      yoyo:true,
      repeat:-1
    });

    }
  local.geometries.push(geometry);
  return geometry;
};

local.generateParticleMaterial = function(pSize) {
  var material = new THREE.ParticleSystemMaterial({
    color: '#'+Math.floor(Math.random()*16777215).toString(16),
    size: pSize, 
    // Cross domain image issue, needs to be hosted locally in order to provide texture.
    
    //map: THREE.ImageUtils.loadTexture(
    //  "https://i.imgur.com/5Ofb1jd.png"
    //),
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  local.materials.push(material);
  local.matColors.push({h:Math.random(),s:Math.random(),l:Math.random()+0.2});
  var num = local.matColors.length-1;
  console.log(local.matColors);
  TweenMax.to(local.matColors[num],Math.random(),{h:Math.random(),s:Math.random(),l:Math.random()+0.2,onUpdate:local.updateMaterialColor,onUpdateParams:[num], repeat:-1, yoyo:true}); 
  return material;
};


local.generateLineGeometry = function(nodes, range) {
  var geometry = new THREE.Geometry();
  if (nodes === undefined) nodes = 100;
  nodes = Math.floor(nodes);
  if (range === undefined) range = 500;
  var r = 500;
  var divs = Math.random()*600 + 20;
  for ( i = 0; i < nodes; i ++ ) {

      var vertex = new THREE.Vector3();  
      var theta = i/range*2*Math.PI +Math.random()/4;
      var phi = i/divs*Math.PI +Math.random()/4;         
    
    
    
    var initX = range * Math.sin(theta)*Math.cos(phi);//  
    var initY = range * Math.sin(theta)*Math.sin(phi);//    
    var initZ = Math.cos(theta)*range;

    vertex.x = initX;//Math.sin(i) * i;
    vertex.y = initY;// Math.cos(i) * i;//Math.random()*100;
    vertex.z = initZ;//Math.random()*1000;

    geometry.vertices.push( vertex );
    
     var tartheta = theta + 2*Math.PI/180;//Math.random()*2*Math.PI;
      var tarphi = phi + 2*Math.PI/180;////Math.random()*Math.PI;
    
    var tarX = range * Math.sin(tartheta)*Math.cos(tarphi);
    var speedX = Math.abs(vertex.x - tarX)/100;
   
    var tarY = range * Math.sin(tartheta)*Math.sin(tarphi);
    var speedY = Math.abs(vertex.y - tarY)/100;
    var tarZ = Math.cos(tartheta)*range;
    var speedZ = Math.abs(vertex.z - tarZ)/100;
    TweenMax.to(vertex,speedX,{
      x:tarX,
      ease:Linear.easeNone,
      delay:i/5000,//Math.random(),
      yoyo:true,
      repeat:-1,
      onUpdate:local.updateLineGeometry,
      onUpdateParams:[geometry]
    });
    
    TweenMax.to(vertex,speedY,{
      y:tarY,
      ease:Linear.easeNone,
    delay:i/5000,//Math.random(),
    yoyo:true,
    repeat:-1
    });
    
    TweenMax.to(vertex,speedZ,{
      z:tarZ,//Math.random()*100,
      ease:Linear.easeNone,
      delay:i/5000,//Math.random(),
      yoyo:true,
      repeat:-1
    });

    }
  local.geometries.push(geometry);
  return geometry;
};

local.updateLineGeometry = function(geometry) {
  geometry.verticesNeedUpdate = true;
geometry.elementsNeedUpdate = true;
geometry.morphTargetsNeedUpdate = true;
geometry.uvsNeedUpdate = true;
geometry.normalsNeedUpdate = true;
geometry.colorsNeedUpdate = true;
geometry.tangentsNeedUpdate = true;
}

local.generateLineMaterial = function() {
  var material = new THREE.LineBasicMaterial({
    color: '#'+Math.floor(Math.random()*16777215).toString(16), 
    // Cross domain image issue, needs to be hosted locally in order to provide texture.
    
    //map: THREE.ImageUtils.loadTexture(
    //  "https://i.imgur.com/5Ofb1jd.png"
    //),
    linecap: 'round',
    linejoin: 'round',
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  local.materials.push(material);
  local.matColors.push({h:Math.random(),s:Math.random(),l:Math.random()});
  var num = local.matColors.length-1;
  console.log(local.matColors);
  TweenMax.to(local.matColors[num],Math.random(),{h:Math.random(),s:Math.random(),l:Math.random(),onUpdate:local.updateMaterialColor,onUpdateParams:[num], repeat:-1, yoyo:true});
  return material;
};


local.updateMaterialColor = function(item)
{
  color = local.matColors[item];//item];
  var h = color.h;//( 360 * ( color.h ) % 360 ) / 360;
  local.materials[item].color.setHSL( h, color.s, color.l );


};





local.generateParticleSystem = function(nodes,range,pSize)
{
  local.particleRotations.push({x:Math.round(Math.random()*2-1),y:Math.round(Math.random()*2-1)});
  var mat;
  var geom;
  var particles;
  if(Math.random() > 0.65) 
    {
      mat = local.generateParticleMaterial(pSize);
      geom = local.generateParticleGeometry(nodes,range);
      particles = new THREE.ParticleSystem( geom, mat );  
    }
  else
    {
      mat = local.generateLineMaterial();
      geom = local.generateLineGeometry(nodes,range);
      geom.verticesNeedUpate = true;
      particles = new THREE.Line( geom, mat );
    }
  
  particles.sortParticles = true;
    //spinParticles();
  local.scene.add(particles);
  local.particleSystems.push(particles);
 // TweenMax.to(particles.rotation,1,{z:Math.random()*4-2,repeat:-1, yoyo:true, ease:Quad.easeInOut});
};


local.render = function() {

    var time = Date.now() * 0.00005;
    
    local.camera.position.x += ( local.mouseX - local.camera.position.x ) * 0.05;
    local.camera.position.y += ( -local.mouseY - local.camera.position.y ) * 0.05;

    local.camera.lookAt( local.scene.position );

    //local.h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
    
    //mesh.position.z = -500 - ((time*1000) % 1000);
    //local.material.color.setHSV( local.h, 0.75, 0.8 );
    //renderer.clear() 
    local.renderer.render( local.scene, local.camera );
    local.renderer.clear(false,true,false);
    //local.renderer.render(scene2,camera);*/
};

local.onDocumentMouseWheel = function(evt) 
{
  var d = evt.originalEvent.wheelDelta;
  TweenMax.to(local.spinValues,1,{camDist:'-='+d});
};

local.onDocumentMouseMove = function( evt ) {

    
  
    local.mouseX = (evt.clientX - local.wHalfX)*0.5;
    local.mouseY = (evt.clientY - local.wHalfY)*0.5;
    var i=0;
    var limit = local.particleSystems.length;
    for (i=0;i<limit;++i)
    {
      //console.log(i);
      var xSign = 1;//(i+1) * local.particleRotations[i].x; 
      var ySign = 1;//(i+1) * local.particleRotations[i].y;
       TweenMax.to(local.particleSystems[i].rotation,1,{y:xSign * local.mouseX/180*Math.PI,x:ySign * local.mouseY/180*Math.PI});
    }
   
    //local.render();
   //animateVertices();

        //geometry.vertices.push( vertex );
       // TweenLite.from(vertex,2,{x:0,delay:2});
};

local.setSpinning = function()
{
  TweenMax.to(local.spinValues,10,{
    x:'+='+(Math.random()*6-3),
    y:'+='+(Math.random()*6-3),
    z:'+='+(Math.random()*6-3),
    camDist:(Math.random()*3000+500),
    onUpdate:local.onSpinSpheres,
    onComplete: local.setSpinning,
    ease:Quad.easeInOut,
  })
}

local.onSpinSpheres = function()
{
   var i=0;
    var limit = local.particleSystems.length;
    for (i=0;i<limit;++i)
    {
      //console.log(i);
      var xSign = 1;//(i+1) * local.particleRotations[i].x; 
      var ySign = 1;//(i+1) * local.particleRotations[i].y;
      local.particleSystems[i].rotation.x = local.spinValues.x;
      local.particleSystems[i].rotation.y = local.spinValues.y;
      local.particleSystems[i].rotation.z = local.spinValues.z;
      local.camera.position.z = local.spinValues.camDist;
      // TweenMax.set(local.particleSystems[i].rotation,{y:xSign * local.mouseX/180*Math.PI,x:ySign * local.mouseY/180*Math.PI});
    }
}

local.onWindowResize = function(event) {
  local.wHalfX = window.innerWidth / 2;
  local.wHalfY = window.innerHeight / 2;

  local.camera.aspect = window.innerWidth / window.innerHeight;
  local.camera.updateProjectionMatrix();
  local.renderer.setSize( window.innerWidth, window.innerHeight );
  //local.render();  
};

local.animate = function()
{
  requestAnimationFrame( local.animate );
  local.render();
};

$( document ).ready(function() {
  local.init();
  local.animate();
});