var scene, camera, renderer, cubeGrid;
var cubes = [];
var cubeNumber = 1;
var cubeColumns = 50;
var cubeRows = 20;

function init() {

    // Set the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();

    // Inject the scene into the DOM
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Build a basic cube
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({color: 0xBADA55});

    // Add cubes to the scene
    for (var column = 1; column < cubeColumns; column++) {
        for (var row = 1; row < cubeRows; row++) {
            addCube(geometry, material, column, row);
        };
    };

    // Update camera position
    camera.position.z = 18;
    camera.position.y = -5;

    // Add a light ot the scene
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    // Browser resize
    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });
}

function addCube(geometry, material, column, row) {

    // Update the cube position
    var cube = new THREE.Mesh(geometry, material);
    var spacing = 0;

    // Update the cube position
    cube.position.x = (column - spacing - cubeColumns / 2) + (spacing * column);
    cube.position.y = (row - spacing - cubeRows / 2) + (spacing * row);
    
    // Rotate the cube slightly, adding some randomness
    cube.rotation.x = cubeNumber * 0.1;
    cube.rotation.z = cubeNumber * 0.1;

    // Name the cubes and add them to an array for use later
    var cubeName = 'cube-' + cubeNumber;
    cube.name = cubeName;
    cubes.push(cubeName);

    // Add the cube to the scene
    scene.add(cube);
    cubeNumber++;
}

function render() {

    // Set up the render loop
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    // Build out cubes
    for (var c = 0; c < cubes.length; c++) { 
        move(cubes[c]);
    };
}

function move(cubeName) {
    currentCube = scene.getObjectByName(cubeName);
    currentCube.rotation.x += 0.01;
    currentCube.rotation.y += 0.01;
    currentCube.rotation.z += 0.01;
    currentCube.position.z += 0.001;
}

init();
render();