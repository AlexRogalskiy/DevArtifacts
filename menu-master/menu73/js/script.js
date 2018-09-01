const downloadButton = document.getElementById('download');

downloadButton.addEventListener('click', downloadSVG);

function downloadSVG() {
  const svg = document.getElementById('my-svg');
  download('my-svg.svg', svg.outerHTML);
}



function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}













const imageInput = document.getElementById('image_upload');
imageInput.addEventListener('change', updateImageDisplay);
const photoSymbol = document.getElementById('photo');

function updateImageDisplay() {
  const file = imageInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file); 
  reader.onloadend = function() {
    photoSymbol.children[0].setAttribute('xlink:href', reader.result);
  }
}


setTimeout(function() {
 var actions =  document.getElementsByClassName('action');
 for(var i = 0; i < actions.length; i++) {
   let elem = actions[i];
   elem.addEventListener('click', function(e) {
     const isActive = elem.classList.toggle('active');
     toggleEffect(elem, isActive);
   });
 }
}, 200);

const photo = document.getElementById('photoUse');
function toggleEffect(elem, isActive) {
  let filter = elem.getAttribute('data-filter');
  if(filter) {
    if(isActive) {
      photo.setAttribute('filter', 'url(' + filter + ')');
    } else {
      photo.setAttribute('filter', null);
    }
  }
}

