function rotateHands(element, deg){
  element.style.webkitTransform = 'rotate('+deg+'deg)';
  element.style.mozTransform    = 'rotate('+deg+'deg)';
  element.style.msTransform     = 'rotate('+deg+'deg)';
  element.style.oTransform      = 'rotate('+deg+'deg)';
  element.style.transform       = 'rotate('+deg+'deg)';
}

function updateTime(){
  var currentTime = new Date();
  var hrs = currentTime.getHours();
  if(hrs>12){
    hrs = hrs-12;
  }
  rotateHands(document.getElementById('secondHand'), currentTime.getSeconds()*6 );
  rotateHands(document.getElementById('minuteHand'), currentTime.getMinutes()*6 );
  rotateHands(document.getElementById('hourHand'), (hrs*30)+(currentTime.getMinutes()*6)/12);
}

updateTime();
window.setInterval(updateTime, 1000);
