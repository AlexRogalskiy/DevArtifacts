var latitude, longitude; // assign empty latitude and longitude

function getWeather(latitude, longitude) {
  $.ajax({
    url:
    "https://fcc-weather-api.glitch.me/api/current?lat=" +
    latitude +
    "&lon=" +
    longitude,
    type: "GET",
    dataType: "json",
    cache: false,
    success: function (data) {
      // for Celsius and Fahrenheit conversion
      var changeTemp = true;
      var celsius = data.main.temp.toFixed(1);
      var maxCelsius = data.main.temp_max.toFixed(0);
      var minCelsius = data.main.temp_min.toFixed(0);
      var fahrenheit = (celsius * 9 / 5 + 32).toFixed(1);
      var maxFahrenheit = (maxCelsius * 9 / 5 + 32).toFixed(0);
      var minFahrenheit = (minCelsius * 9 / 5 + 32).toFixed(0);

      // current conditions
      $("#temp").html(celsius + "&#8451;");
      $("#max-temp").html(maxCelsius + "&#8451;");
      $("#min-temp").html(minCelsius + "&#8451;");
      $("#place").html(data.name);
      $("#humidity").html(data.main.humidity + "&#37;");
      $("#weather-main").html(data.weather[0].main);
      $("#weather-description").html(data.weather[0].description);
      $("#weather-icon").html("<img src=" + data.weather[0].icon + ">");

      // Planet Earth returns no country, remove comma and space
      if (data.sys.country === undefined) {
        $("#country").html(data.sys.country);
      } else {
        $("#country").html(", " + data.sys.country);
      }

      // change background image based on current weather
      if (data.weather[0].main == "Clouds") {
        $("body").css(
        "background-image",
        "url(https://static.pexels.com/photos/158827/field-corn-air-frisch-158827.jpeg)");

      } else if (data.weather[0].main == "Mist") {
        $("body").css(
        "background-image",
        "url(https://static.pexels.com/photos/163391/sunrise-sun-skies-nature-163391.jpeg)");

      } else if (data.weather[0].main == "Clear") {
        $("body").css(
        "background-image",
        "url(https://static.pexels.com/photos/403071/pexels-photo-403071.jpeg)");

      } else if (data.weather[0].main == "Rain") {
        $("body").css(
        "background-image",
        "url(https://static.pexels.com/photos/69927/rain-floor-water-wet-69927.jpeg)");

      } else if (data.weather[0].main == "Thunderstorm") {
        $("body").css(
        "background-image",
        "url(https://static.pexels.com/photos/510047/pexels-photo-510047.jpeg)");

      } else if (data.weather[0].main == "Haze") {
        $("body").css(
        "background-image",
        "url(https://upload.wikimedia.org/wikipedia/commons/8/84/SG_haze-skyline.JPG)");

      } else {
        $("body").css(
        "background-image",
        "url(https://static.pexels.com/photos/208998/pexels-photo-208998.jpeg)");

      }

      // toggle temperature between Celsius and Fahrenheit
      $("#toggle-switch").click(function () {
        if (changeTemp === true) {
          $("#temp").html(fahrenheit + "&#8457;");
          $("#max-temp").html(maxFahrenheit + "&#8457;");
          $("#min-temp").html(minFahrenheit + "&#8457;");
          changeTemp = false;
        } else {
          $("#temp").html(celsius + "&#8451;");
          $("#max-temp").html(maxCelsius + "&#8451;");
          $("#min-temp").html(minCelsius + "&#8451;");
          changeTemp = true;
        }
      });

    } });

}

// get user's latitude and longitude, and display weather information
function showPosition(position) {
  // assign latitude and longitude to user's current
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  getWeather(latitude, longitude); // run this function once
}

// error handling
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      getWeather(0, 0); // Planet Earth
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      getWeather(0, 0);
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      getWeather(0, 0);
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      getWeather(0, 0);
      break;}

}

// code inside will only run, once the page DOM is ready
$(document).ready(function () {
  // get user's current geolocation data
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
});