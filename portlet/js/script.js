var direction = ["N", "N/E", "E", "S/E", "S", "S/W", "W", "N/W"];

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    warning.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var my_url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat.toString() + "&lon=" + lon.toString() + "&appid=a40ce530731244de33d92fe9a28c3b01";
  $.getJSON(my_url, function(json) {
    $("#location").html(json.name);
    $("#country").html(json.sys.country);
    $("#temperature").html(Math.round(json.main.temp - 273.15));
    $("#temperature2").html(Math.round((json.main.temp - 273.15) * (9 / 5) + 32));
    $("#icon").html("<img src='https://openweathermap.org/img/w/" + json.weather[0].icon + ".png' />");
    $("#description").html(json.weather[0].description);
    $("#speed").html(json.wind.speed);
    if(json.wind.speed > 1) {
      $("#plural").html("s"); //plural
    }
    if(typeof Math.round(json.wind.deg / 45) === "Number") {
      $("#dir").html(direction[Math.round(json.wind.deg / 45)]);
    }
    if(typeof json.wind.deg !== "undefined") {
      $("#deg").html("(" + json.wind.deg + "&deg;)");
    }
    if(json.weather[0].main === "rain") {
      $("body").css("background-image", "url('https://res.cloudinary.com/justusft/image/upload/v1480724958/rain-122691_1920_nhnkpi.jpg')");
    }
    if(json.main.temp - 273.15 < 10) {
      $("body").css("background-image", "url('https://res.cloudinary.com/justusft/image/upload/v1480726419/forest-547363_1280_r7ccsw.jpg')");
    }
    else if(json.main.temp - 273.15 > 30) {
      $("body").css("background-image", "url('https://res.cloudinary.com/justusft/image/upload/v1480724954/desert-1270345_1920_kubiaz.jpg')");
    }
  });
}
$(document).ready(function() {
  if (window.location.href.substr(0, 5) === "https") {
    alert("NOTE!\nYou are currently using an https connection.\nThis applet does not work with https connection.")
  }
  getLocation()
});