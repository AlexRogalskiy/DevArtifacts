var a = document.getElementById('Pickup');
var b = document.getElementById('Dropoff');
var options = {
  types: ['geocode'], // '(cities)' or '(regions)' or 'establishment'
  componentRestrictions: {country: 'uk'} //Uk only
};

// For Reference Purpose
// https://developers.google.com/maps/documentation/javascript/reference#AutocompletionRequest

var autocomplete1 = new google.maps.places.Autocomplete(a, options);
var autocomplete2 = new google.maps.places.Autocomplete(b, options);

$('#GetQuote').on('click', function(){

  var pick = $.trim($('#Pickup').val()),
      drop = $.trim($('#Dropoff').val());
debugger;

  if(pick.length > 1 && drop.length > 1) {

    $('.result').removeClass('error').html('Please wait while we are processing your request.');
    $('.loading').fadeIn(500);
    var pickup = $('#Pickup').val().replace(/ /g,'+');
    var dropoff = $('#Dropoff').val().replace(/ /g,'+');
    
    var directionsService = new google.maps.DirectionsService();

    var request = {
      origin      : pickup, // a city, full address, landmark etc
      destination : dropoff,
      travelMode  : google.maps.DirectionsTravelMode.DRIVING,
      durationInTraffic : true,
      avoidHighways  : false,
      avoidTolls  : false
    };

    directionsService.route(request, function(response, status) {
      debugger;
      if ( status == google.maps.DirectionsStatus.OK ) {
        var distance = parseFloat(response.routes[0].legs[0].distance.value * 0.000621371192).toFixed(2);
        console.log( distance ); // the distance in metres
        var duration = response.routes[0].legs[0].duration.text,
            pricePerMile = 1.5,
            vehicleTypeValue = $('#VehicelType').val(),
            appliedVehiclePercentage = ((distance * pricePerMile) * vehicleTypeValue),
            calculatedPrice = ((distance * pricePerMile) + appliedVehiclePercentage).toFixed(2),
            quote = "Distance: " + distance + " in miles | Price: <strong>£" + calculatedPrice + "</strong> | Driving Duration: " + duration
        setTimeout(function(){
          $('.result').removeClass('error').html(quote);
          $('.loading').hide();
        },3000)
      }
      else {
        // oops, there's no route between these two locations
        // every time this happens, a kitten dies
        // so please, ensure your address is formatted properly
      }
    });
    
    //var distanceService = new google.maps.DistanceMatrixService();
    /*
    distanceService.getDistanceMatrix({
      origins: [pickup, dropoff],
      destinations: [pickup, dropoff],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false
    },
    function (response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        console.log('Error:', status);
      } else {
        debugger;
        var d = parseInt(response.rows[0].elements[0].distance.text.replace(' km','')); //in km
        d *= 0.62137; //in miles
        
        var distance = d.toFixed(1),
            duration = response.rows[0].elements[0].duration.text,
            pricePerMile = 1.5,
            vehicleTypeValue = $('#VehicelType').val(),
            appliedVehiclePercentage = ((distance * pricePerMile) * vehicleTypeValue),
            calculatedPrice = ((distance * pricePerMile) + appliedVehiclePercentage).toFixed(2),
            quote = "Distance: " + distance + " in miles | Price: <strong>£" + calculatedPrice + "</strong> | Driving Duration: " + duration
        setTimeout(function(){
          $('.result').removeClass('error').html(quote);
          $('.loading').hide();
        },3000)
      }
    });*/
  } else {
    $('.result').addClass('error').html('Please enter Pickup &amp; Dropoff locations to continue.');
  }

});