var width  = window.innerWidth,
    height = window.innerHeight;

var scene = new THREE.Scene();

var barHeight = 30;
var lookAtPoint = new THREE.Vector3(0, 0, barHeight);

var cameraStartX = 50,
    cameraStartY = -50,
    cameraStartZ = barHeight;
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

camera.position.set(cameraStartX, cameraStartY, cameraStartZ);
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt( lookAtPoint );

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height);
renderer.setClearColor( 0x000000, 1 );

var geometry = new THREE.PlaneGeometry(60, 60, 255, 255);

var material = new THREE.MeshNormalMaterial({
    color: 0xdddddd,
    wireframe: true,
    wireframe_linewidth: 2
});


var plane = new THREE.Mesh(geometry, material);
plane.geometry.__dirtyVertices = true;
scene.add(plane);

var controls = new THREE.TrackballControls(camera, renderer.domElement);

document.getElementById("webgl").appendChild(renderer.domElement);

var userInControl = false;
renderer.domElement.addEventListener("mousedown", function() {
    userInControl = true;
});

render();

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}



var player = document.createElement('audio'),
    audio = document.createElement('audio'),
    AudioContext = window.AudioContext || window.webkitAudioContext,
    context = new AudioContext(),
    analyser = context.createAnalyser(),
    source = context.createMediaElementSource(audio),
    animationFrame = null;

audio.crossOrigin = "anonymous";
analyser.fftSize = 2048;
source.connect(analyser);

var startTime = Date.now();
function renderFrame(audio, analyser) {
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // Update our vis
    updateMesh(frequencyData);

    // Update our camera position
    if(!userInControl) {
        var elapsedTime = Date.now() - startTime;
        camera.position.x = cameraStartX * Math.cos( 0.0001 * elapsedTime );
        camera.position.y = cameraStartY * Math.sin( 0.0001 * elapsedTime );
        camera.lookAt( lookAtPoint );
    }

    animationFrame = requestAnimationFrame(function () {
        renderFrame(audio, analyser);
    });
}

var audioInput = document.getElementById("audiofile");
audioInput.addEventListener('change', function(event) {
    if(event.target.files[0]) {
        // No error checking of file here, could be added
        playAudio(URL.createObjectURL(event.target.files[0]));
    }
}, false);

function playAudio(url) {
    audio.autoplay = player.autoplay = true;
    audio.src = player.src = url;
    audio.play();
    player.play();
    playPauseButton.innerHTML = "&#9646;&#9646;";

    // Reset the camera
    userInControl = false;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(cameraStartX, cameraStartY, cameraStartZ);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt( lookAtPoint );
    controls = new THREE.TrackballControls(camera, renderer.domElement);

    cancelAnimationFrame(animationFrame);
    renderFrame(audio, analyser);
}




// Go diagonally through a numCells x numCells grid, as in:
// 1, 2, 4...
// 3, 5, 7...
// 6, 8, 9...
// ...
var cellSize = 8;
var numCells = 256 / cellSize;
var averageThem = false;
function updateMesh(data) {
    var count = 0;

    // Loop through the "pillars"
    for(var i = 0; i < numCells * 2; i++) {
        var x = i;
        for(var j = 0; j <= i; j++) {
            var y = j;
            if(x < numCells && y < numCells) {

                var z = 0;
                if(data[count])
                    z = data[count] / 256 * barHeight;

                // Loop through the actual indexes
                for(var ai = 0; ai < cellSize; ai++) {
                    for(var aj = 0; aj < cellSize; aj++) {
                        var index = x * cellSize + ai + (y * cellSize + aj) * 256;

                        if(geometry.vertices[index]) {
                            var vert = geometry.vertices[index];

                            if(averageThem) {
                                // Average the vertex z with the surrounding pillars'
                                // zs weighted by the distance to each pillar
                                var avgCount = 0;
                                var weightedZ = 0;
                                for(var q = -1; q < 2; q++) {
                                    for(var r = -1; r < 2; r++) {
                                        if(data[count + numCells * r + q]) {
                                            var additionalZ = 0;
                                            if(q === -1)
                                                additionalZ += 1 - ai / cellSize;
                                            else if(q === 1)
                                                additionalZ += ai / cellSize;

                                            if(r === -1)
                                                additionalZ += 1 - aj / cellSize;
                                            else if(r === 1)
                                                additionalZ += aj / cellSize;

                                            if(q != 0 && r != 0)
                                                additionalZ /= 2;

                                            weightedZ += additionalZ * data[count + numCells * r + q] / 256 * barHeight;
                                            avgCount++;
                                        }
                                    }
                                }
                                if(avgCount > 0)
                                    weightedZ /= avgCount;
                                vert.z = weightedZ;

                                /* Alternative way to try and average them: * /
                                    var avgCount = 0;
                                    var weightedZ = 0;
                                    for(var q = -1; q < 2; q++) {
                                        for(var r = -1; r < 2; r++) {
                                            if(data[count + numCells * r + q]) {
                                                var distance = cellSize - Math.sqrt( Math.pow( ai - cellSize / 2, 2) + Math.pow( aj - cellSize / 2, 2) );

                                                weightedZ += distance / (cellSize * 2) * data[count + numCells * r + q] / 256 * barHeight;
                                                avgCount++;
                                            }
                                        }
                                    }
                                    if(avgCount > 0)
                                        weightedZ /= avgCount;
                                    vert.z = weightedZ;
                                    */
                            } else {
                                // No averaging, just move pillars up and down
                                vert.z = z;
                            }


                            // Make a wall around the edges
                            if(vert.x === 30 || vert.x === -30 || vert.y === 30 || vert.y == -30)
                                vert.z = 0;
                        }
                    }
                }

                count++;
            }
            x--;
        }
    }

    plane.geometry.verticesNeedUpdate = true;
}

var playPauseButton = document.querySelector(".playPauseButton");
playPauseButton.onclick = function() {
    if(audio.paused) {
        player.play();
        audio.play();
        playPauseButton.innerHTML = "&#9646;&#9646;";
    } else {
        player.pause();
        audio.pause();
        playPauseButton.innerHTML = "&#9654;";
    }
}

window.onresize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}


// var averageThemElem = document.getElementById("averageThem");
// averageThemElem.onchange = function() {
//     averageThem = this.value;
// }