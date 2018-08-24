var c = document.querySelector('canvas')

var ctx = c.getContext('2d')

var fontName = 'CircularSp'
var fontUrl = 'url( https://s3-us-west-2.amazonaws.com/s.cdpn.io/23596/CircularSpUIv3T-Bold.woff2 )'

var f = new FontFace(fontName, fontUrl);

f.load().then(function() {
  ctx.font = '72px CircularSpUIv3T-Bold';
  console.log('font loaded')
  updateCover()
});

var face = new Image()
// face.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/23596/face.png'

var faceLoaded = false

face.onload = function () {
  faceLoaded = true
  console.log('face loaded')
  URL.revokeObjectURL(face.src)
  updateCover()
}

var f1 = document.querySelector('.f1')

f1.addEventListener('change', fileChange)

function fileChange (e) {
  face.src = URL.createObjectURL(e.target.files[0]);
}

var z1 = document.querySelector('.z1')
var z2 = document.querySelector('.z2')
var z3 = document.querySelector('.z3')

var c1 = document.querySelector('.c1')
var c2 = document.querySelector('.c2')
var c3 = document.querySelector('.c3')

var textpos = { l: 72, t: 485 }
var lh = 76

function updateCover () {
  
  // clear
  ctx.clearRect(0, 0, 720, 720)
  
  // gradient
  var gradient = ctx.createLinearGradient(720, 0, 0, 720);
  
  gradient.addColorStop(0,   c1.value);
  gradient.addColorStop(0.6, c2.value)
  gradient.addColorStop(1,   c3.value);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 720, 720);
  
  // face
  ctx.globalCompositeOperation = 'multiply'
  ctx.globalAlpha = 0.5
  
  if (faceLoaded) {
    ctx.drawImage(face, 0, 0, 720, 720)
  }
  
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  
  // text
  ctx.fillStyle = 'white'
  
  ctx.fillText(z1.value, textpos.l, textpos.t);
  ctx.fillText(z2.value, textpos.l, textpos.t + lh);
  ctx.fillText(z3.value, textpos.l, textpos.t + (lh * 2));
  
}

z1.addEventListener('input', updateCover)
z2.addEventListener('input', updateCover)
z3.addEventListener('input', updateCover)

z1.value = 'Spotify'
z2.value = 'Cover Style'
z3.value = 'Creator V 1.0'

c1.addEventListener('input', updateCover)
c2.addEventListener('input', updateCover)
c3.addEventListener('input', updateCover)

c1.value = '#f36c0b'
c2.value = '#0cc7a8'
c3.value = '#ad29c9'

updateCover()

// var saveButton = document.querySelector('.save')
// saveButton.addEventListener('click', save)

function save () {
  var image = c
    .toDataURL("image/png")
  window.location.href = image
}