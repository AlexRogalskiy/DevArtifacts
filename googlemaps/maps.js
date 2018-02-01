window.onload = loadMap;
      function loadMap() {
        var latLong = new google.maps.LatLng(44.798609, -91.504912);

        var mapOptions = {
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: latLong
        };

        var map = new google.maps.Map(document.getElementById("map_canvas"),
              mapOptions);
        mogiesLatLong = new google.maps.LatLng(44.802293, -91.509376);
        var marker = new google.maps.Marker({
          position: mogiesLatLong,
          map: map,
          title: "Mogie's Pub & Restaurant"
        });
        var mogiesDescription = "<h4>Mogie's Pub & Restaurant</h4>" +
          "<p>Excellent local restaurant with top of the line burgers " +
          "and sandwiches.</p>";
        var infoPopup = new google.maps.InfoWindow({
          content: mogiesDescription
        });
        google.maps.event.addListener(marker, "click", function() {
          infoPopup.open(map,marker);
        });
      }