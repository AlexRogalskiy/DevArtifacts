

var scene, camera, renderer;

init();
render();

function init() {

    // S C E N E
    scene = new THREE.Scene();


    // C A M E R A
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 10000 );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );


    // R E N D E R E R
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.querySelector('[data-js="stage"]').appendChild(renderer.domElement);


}










/////////////////////////////////////
// O R B I T E R
/////////////////////////////////////

// geometry for orbiter
var orbitGeometry = new THREE.IcosahedronGeometry(0.07, 1);

// color for each orbiter/light
var colors = [ 0xff0000, 0x00ff00, 0x0000ff ];


for ( i = 0; i < 3; i++ ) {

    // setting different color to each orbiter
    var orbitMaterial = new THREE.MeshBasicMaterial({
        color: colors[i]
    });

    // wraps one orbiter and one light
    // provides rotation
    wrapper = new THREE.Object3D( 3, 0, 0 );
    wrapper.rotation.order = 'ZXY';
    wrapper.rotation.set( 0, 0, 0 - i );
    scene.add( wrapper );

    // glowing light
    light = new THREE.PointLight( colors[i], 2, 1 );
    light.position.set(0, 1, 1);
    wrapper.add( light );

    // orbiter
    orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.position.set( light.position.x, light.position.y, light.position.z );
    wrapper.add( orbit );

    // animation for each wrapper
    TweenMax.to( wrapper.rotation, 2, {
        ease: Power0.easeNone,
        x: Math.PI * 2,
        repeat: -1,
        delay: i * -0.7
    });

}







/////////////////////////////////////
// S P H E R E
/////////////////////////////////////


var sphere,
    sunlight;

function createSphere() {

    sphereGeometry = new THREE.IcosahedronGeometry(1, 1);
    sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x323232,
      shading: THREE.FlatShading,
      shininess: 0
    });

    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add( sphere );


    TweenMax.to( sphere.rotation, 60, {
        ease: Power0.easeNone,
        x: Math.PI * 2,
        y: Math.PI * 2,
        repeat: -1
    });


    // add light to make the sphere visible
    sunLight = new THREE.PointLight( 0xffffff, 0.7, 20 );
    sunLight.position.set(10, 6, 7);

    scene.add( sunLight );

}

createSphere();








/////////////////////////////////////
// R E S I Z E   E V E N T
/////////////////////////////////////

 window.addEventListener('resize', resizeHandler);









 /////////////////////////////////////
 // R E N D E R E R
 /////////////////////////////////////

function render() {

    requestAnimationFrame(render);
    renderer.render(scene, camera);

}




/////////////////////////////////////
// R E S I Z E   H A N D L E R
/////////////////////////////////////

function resizeHandler() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
