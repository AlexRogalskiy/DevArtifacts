var params = window.location.search.substring(1).split('=');
if(params[0] == 'harlem' && params[1] == 'shake') {
  var harlemShake = false;
  var obj = document.getElementById('track'); obj.addEventListener('timeupdate', checkTime, false)
  obj.play();
  $('.new').hide();
}
if(params[0] == 'shake' && params[1] == 'terrible') {
  $('body').addClass('shake shake-hard shake-constant');
}



function checkTime() {
  var cur = obj.currentTime;
  var timeRemaining = obj.duration - obj.currentTime;
  if (cur > 15 && !harlemShake) {
    $('.shake').addClass('shake-constant');
    $('.preview-desc, h4').addClass('shake shake-hard shake-constant');
    harlemShake = true;
  }
   if (cur > 30) {
    $('.shake').removeClass('shake-constant');
     $('#track').animate({volume: 0}, 5000);
    harlemShake = true;
   }
}