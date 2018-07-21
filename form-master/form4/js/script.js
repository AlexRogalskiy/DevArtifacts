$(function(){
  
  var autocomplete;
  var geocoder;
  var input = document.getElementById('location');
  var options = {
    componentRestrictions: {'country':'us'},
    types: ['(regions)'] // (cities)
  };

  autocomplete = new google.maps.places.Autocomplete(input,options);

  $('#go').click(function(){
    var location = autocomplete.getPlace();
    geocoder = new google.maps.Geocoder();
    console.log(location['geometry'])
    lat = location['geometry']['location'].lat();
    lng = location['geometry']['location'].lng();
    var latlng = new google.maps.LatLng(lat,lng);
    
    // http://stackoverflow.com/a/5341468
    geocoder.geocode({'latLng': latlng}, function(results) {
      for(i=0; i < results.length; i++){
          for(var j=0;j < results[i].address_components.length; j++){
              for(var k=0; k < results[i].address_components[j].types.length; k++){
                  if(results[i].address_components[j].types[k] == "postal_code"){
                      zipcode = results[i].address_components[j].short_name;
                      $('span.zip').html(zipcode);		
                  }
              }
          }
      }
    });
    
  });
  
  
});