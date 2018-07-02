var frames = document.getElementsByClassName('hero-frame'),
    smFrames = document.getElementsByClassName('hero-frame h-f-sm'),
    current;

function forLoop (o,fn) {
  var i, len;
  for (i=0,len=o.length;i<len;i++){
    fn(o[i]);
  }
}

function rollOver () {
  var currentColor = this.style.backgroundColor,
      elm = this,
      changeBackEvent;
  elm.removeEventListener('mouseover',rollOver,false);
  elm.style.backgroundColor = 'pink';
  elm.style.webkitTransform = 'scale(0.97)';
  elm.style.mozTransform = 'scale(0.97)';
  elm.style.msTransform = 'scale(0.97)';
  elm.style.oTransform = 'scale(0.97)';
  elm.style.transform = 'scale(0.97)';
  
  function changeBack () {
    elm.style.backgroundColor = currentColor;
    elm.style.webkitTransform = 'scale(1)';
    
    elm.addEventListener('mouseover',rollOver,false);
  }
  
  //elm.addEventListener('mouseout',changeBack,false);
  setTimeout(changeBack,1500);
}


forLoop(frames, function (x) {
  x.addEventListener('mouseover',rollOver,false);
});