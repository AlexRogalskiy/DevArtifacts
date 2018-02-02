(function() {
  var placesAutocomplete = places({
    container: document.querySelector('#address')
  });

  var $address = document.querySelector('#address-value')
  placesAutocomplete.on('change', function(e) {
    console.log(e);
    if($address) {
      $address.textContent = e.suggestion.value;
    }
  });

  placesAutocomplete.on('clear', function() {
    if($address) {
      $address.textContent = 'none';
    }
  });
})();