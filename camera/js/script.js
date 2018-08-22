var viewfinder = document.getElementById('viewfinder');
var capturedImage = document.getElementById('capturedImage');

var camProps = {};  
var camDeviceIndex = 0;
var videoSources = [];
var videoTrack;

//checks if browser supports camera
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
  //enumerate available media devices
  navigator.mediaDevices.enumerateDevices().then(function(devices){
    //map only video devices to videoSources
    videoSources = devices.filter(function(a){ return a.kind == "videoinput" });
    
    //video constraits, using first video device (usually rear cam)
    camProps.video = {
      width: 640,
      height: 480,
      deviceId: videoSources[camDeviceIndex].deviceId
    };
    
    videoStart();
  });  
}

function videoStart(){
  //stop current track if there is one
  if(videoTrack)
    videoTrack.stop();
  
  //initiates mediadevice (camera)
  navigator.mediaDevices.getUserMedia(camProps).then(function(stream){
      //exposes videoTrack outside
      videoTrack = stream.getVideoTracks()[0];
      //video element will use video stream
      viewfinder.srcObject = stream;
      viewfinder.play();
    });
}

document.getElementById('capture').addEventListener('click', function(){
  //draw current stream image to the overlaying canvas
  capturedImage.width = viewfinder.videoWidth;
  capturedImage.height = viewfinder.videoHeight;
  capturedImage.getContext('2d').drawImage(viewfinder, 0, 0, viewfinder.videoWidth, viewfinder.videoHeight);
  
  //show the canvas with captured image
  capturedImage.classList.remove('hide');
  
  //show the redo button, hide capture button
  document.getElementById('redo').classList.remove('hide');
  this.classList.add('hide');
});

document.getElementById('redo').addEventListener('click', function(){
  //hide the captured image
  capturedImage.classList.add('hide');
  
  //un-hide the 'capture' button, hide redo button
  document.getElementById('capture').classList.remove('hide');
  this.classList.add('hide');
});

document.getElementById('switchCamera').addEventListener('click', function(){
  //increment camDeviceIndex, back to 0 if end of last device
  camDeviceIndex = (camDeviceIndex+1) % videoSources.length;
  
  //change video track constraint
  camProps.video.deviceId = videoSources[camDeviceIndex].deviceId;
  
  //restart camera
  videoStart();
});