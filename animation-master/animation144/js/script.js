

var stage,
    scene,
    camera,
    renderer,
    system,
    lights,
    spheres,
    loadManager,
    loader,
    textures,
    particleTex;

// E V E N T S
window.addEventListener('resize', resizeHandler);

var globeTexture = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/46992/stone-texture-08.png";
var particleTexture = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/46992/disc.png";

var numSpheres = 9;
var thickness = 0.1;
var radius = 6;
var scaleBase = 0.4;
var sphereMaterials = [];
var brown = 0x996633;
var green = 0x1e9488;


function init() {

    stage = document.querySelector('[data-js="stage"]');
    groups = [];
    spheres = [];
    textures = [];

    initLoader();
    initTextures();

    initScene();
    initCamera();
    initRenderer();
    initLight();
    initSystem();
    initSpheres(numSpheres);
    animateSpheres(spheres);
    initGlobe();
}

// ______________ L O A D   M A N A G E R
var initLoader = function(){
    loadManager = new THREE.LoadingManager();
    loader = new THREE.TextureLoader( loadManager );
    loadManager.onLoad = function() {
        initParticles();
        render();
    };

}

var texturize = function(){
    for ( var i = 0; i < sphereMaterials.length; i++ ){
        sphereMaterials[i].bumpMap = textures[0];
        sphereMaterials[i].bumpScale = 0.08;
        sphereMaterials[i].map = textures[0];
    }
}

// ______________ TEXTURE
var initTextures = function(){
  
  loader.load( globeTexture, function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 6, 6 );
    textures.push(texture);
    texturize();
  });
  
  loader.load( particleTexture, function (texture) {
    particleTex = texture;
  });
}


// ______________ S C E N E
var initScene = function(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x030a00, 55, 76);
}

// ______________ C A M E R A
var initCamera = function(){
    camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.0001, 1000 );
    camera.lookAt( scene.position );
    camera.position.set( 0, 0, 100 );
    scene.add( camera );
}

// ______________ R E N D E R E R
var initRenderer = function(){
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    stage.appendChild(renderer.domElement);
}

// ______________ L I G H T
var initLight = function(){
    lights = new THREE.Group();

    var directionalLight = new THREE.DirectionalLight( 0xffe6b1, 1 );
    directionalLight.position.set( -100, 100, 0 );
    lights.add( directionalLight );

    scene.add(lights);

    var hemilight = new THREE.HemisphereLight( 0x141414, 0x050505, 4 );
    scene.add( hemilight );
   
}

// ______________ S Y S T E M
var initSystem = function(){
    system = new THREE.Group();
    system.position.set( 0, 0, 0 );
    system.scale.set( 0.6, 0.6, 0.6 );
    system.rotation.set( -Math.PI*0.1, -Math.PI*0.62, 0 );
    scene.add( system );
}

var createSphere = function( val, nth ){
    var color = green;
    if(nth % 2 != 0) color = brown;

    var group = new THREE.Group();

    var sphereGeoOuter = new THREE.SphereGeometry( (radius + val), 30, 30, 0, Math.PI, 0, Math.PI );
    var sphereGeoInner = new THREE.SphereGeometry( (radius + val - thickness), 30, 30, 0, Math.PI, 0, Math.PI );
    var ringGeo = new THREE.RingGeometry( (radius + val), (radius + val - thickness), 60 );
    var sphereGeo = new THREE.Geometry();

    var sphereOuter = new THREE.Mesh( sphereGeoOuter );
    var sphereInner = new THREE.Mesh( sphereGeoInner );
    var ring = new THREE.Mesh( ringGeo );

    sphereOuter.updateMatrix();
    sphereGeo.merge(sphereOuter.geometry, sphereOuter.matrix);
    sphereInner.updateMatrix();
    sphereGeo.merge(sphereInner.geometry, sphereInner.matrix);
    ring.updateMatrix();
    sphereGeo.merge(ring.geometry, ring.matrix);

    var sphereMaterial = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0xffffff,
        shininess: 20,
        side: THREE.DoubleSide
    });
    sphereMaterials.push( sphereMaterial );

    var sphere = new THREE.Mesh( sphereGeo, sphereMaterial );
    sphere.castShadows = true;
    sphere.receiveShadows = true;

    spheres.push(sphere)
    group.add( sphere );
    groups.push( group );
    system.add( group );
}

var initSpheres = function(num){
    for( var i = 0; i < num; i++ ){
        var scale = 1 + (i * scaleBase);
        createSphere(scale, i);
        system.add(spheres[i]);
    }
}

var animateSpheres = function(array){

    var tl = new TimelineMax({
        repeat: -1
    }).timeScale(0.4);

    for( var i = 0; i < array.length; i++ ){
        tl.to(array[i].rotation, 4, {
            x: -Math.PI*2,
            ease: Power3.easeInOut,
            delay: i*0.15
        }, 0);
        tl.to(array[i].rotation, 4, {
            x: 0,
            ease: Power3.easeInOut,
            delay: i*0.15
        }, 4);

        TweenMax.to(array[i].rotation, 15, {
            z: Math.PI*4,
            ease: Power1.easeInOut,
            repeat: -1,
            yoyo: true,
            delay: -1*i*0.5
        });
    }

}

var updateMaterials = function(){
    for(var i = 0; i < sphereMaterialsOuter.length; i++){
        sphereMaterialsOuter[i].needsUpdate = true;
    }
    for(var j = 0; j < sphereMaterialsInner.length; j++){
        sphereMaterialsInner[j].needsUpdate = true;
    }
}


// ______________   S P H E R E D O M
var initGlobe = function(){
    let globe = new THREE.Mesh(
      new THREE.SphereGeometry( 400, 32, 32 ),
      new THREE.MeshLambertMaterial({
        color: 0x030a00,
        side: THREE.BackSide
      })
    );
  scene.add(globe);
}


// ______________ P A R T I C L E S
var initParticles = function(){
    var particlesNum = 800;
    var spread = 30;
    var positions = new Float32Array(particlesNum*3);
    var colors = new Float32Array(particlesNum*3);
    var sizes = new Float32Array(particlesNum);
    var vertex;
    var color = new THREE.Color();
  
    var min = -spread, max = spread;
    for (var i = 0; i < particlesNum; i++) {
      vertex = new THREE.Vector3(
        Math.random() * ((max - min)) + min,
        Math.random() * ((max - min)) + min,
        Math.random() * ((max - min)) + min
      );
      vertex.toArray(positions, i*3);
      color.setHex(0xc1bc35);
      color.toArray(colors, i*3);
      sizes[i] = 1 * Math.random();
    }
  
    var bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.addAttribute('position', new THREE.BufferAttribute( positions, 3));
    bufferGeometry.addAttribute('customColor', new THREE.BufferAttribute( colors, 3));
    bufferGeometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: {value: new THREE.Color(0xffffff)},
        texture: {value: particleTex}
      },
      vertexShader: document.getElementById('vertex_shader_particles').textContent,
      fragmentShader: document.getElementById('fragment_shader_particles').textContent,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      depthTest: false
    });
    let particles = new THREE.Points(bufferGeometry, particleMaterial);
    scene.add(particles);
  
    TweenMax.to(particles.rotation, 300, {
      x: Math.PI*2,
      y: Math.PI*8,
      z: Math.PI*12,
      repeat: -1,
      ease: Power0.easeNone
    })
}


// ______________ R E N D E R
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}





// ______________ R E S I Z E   F U N C T I O N
function resizeHandler() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

init();
