(function(){
  
  // rotation via mousemove
  var cont = document.querySelector('.dna');
  document.addEventListener('mousemove', updRotation, false);
  function updRotation(e){
    cont.style.webkitTransform = 'rotateY(' + e.x / 5 + 'deg) rotateZ(-' + e.y / 5 + 'deg)';   
    cont.style.transform = 'rotateY(' + e.x / 5 + 'deg) rotateZ(-' + e.y / 5 + 'deg)';   
  }

  // light fx via Photon.js
  light = new Photon.Light();
    shadeAmount = .6;
    tintAmount = .7;
    coverflowFaces = [];
    cubeFaces = [];
    diamondFaces = [];
    dna = new Photon.FaceGroup($('.dna')[0], $('.dna .protein'), 1.5, .2, true);
  dna.render(light, true);
  
})();