var canvas = new fabric.Canvas('c');
var video1El = document.getElementById('video1');
var video2El = document.getElementById('video2');
var webcamEl = document.getElementById('webcam');

var video1 = new fabric.Image(video1El, {
  left: 200,
  top: 300,
  angle: -15,
  originX: 'center',
  originY: 'center'
});

var video2 = new fabric.Image(video2El, {
  left: 1000,
  top: 350,
  angle: 15,
  originX: 'center',
  originY: 'center'
});

var webcam = new fabric.Image(webcamEl, {
  left: 539,
  top: 328,
  angle: 94.5,
  originX: 'center',
  originY: 'center'
});

canvas.add(video1);
video1.getElement().play();

canvas.add(video2);
video2.getElement().play();

// adding webcam video element
getUserMedia({video: true}, function getWebcamAllowed(localMediaStream) {
  var video = document.getElementById('webcam');
  video.src = window.URL.createObjectURL(localMediaStream);

  canvas.add(webcam);
  webcam.moveTo(0); // move webcam element to back of zIndex stack
  webcam.getElement().play();
}, function getWebcamNotAllowed(e) {
  // block will be hit if user selects "no" for browser "allow webcam access" prompt
});

// making navigator.getUserMedia cross-browser compatible
function getUserMedia() {
  var userMediaFunc = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (userMediaFunc) userMediaFunc.apply(navigator, arguments);
}

fabric.util.requestAnimFrame(function render() {
  canvas.renderAll();
  fabric.util.requestAnimFrame(render);
});
