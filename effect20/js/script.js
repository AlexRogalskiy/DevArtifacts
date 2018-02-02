function updateTime(){
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  document.getElementById('hoursBoxDigit').innerText = hours;
  document.getElementById('hoursBox').style.width =window.innerWidth + 'px';
  var hoursBoxWidth = parseInt(document.getElementById('hoursBox').style.width, 10);

  document.getElementById('minutesBoxDigit').innerText = minutes;
  document.getElementById('minutesBox').style.width = (minutes/60)*hoursBoxWidth + 'px';
  var minutesBoxWidth = parseInt(document.getElementById('minutesBox').style.width, 10);

  document.getElementById('secondsBoxDigit').innerText = seconds;
  document.getElementById('secondsBox').style.width = (seconds/60)*minutesBoxWidth +'px';
  var secondsBoxWidth = document.getElementById('secondsBox').style.width;
  console.log(hoursBoxWidth);
}

updateTime();
window.setInterval(updateTime, 1000);
