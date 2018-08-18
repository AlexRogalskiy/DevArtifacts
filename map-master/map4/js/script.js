jQuery(document).ready(function () {
    var map;
    var centerPosition = new google.maps.LatLng(43.647858,-79.377358); 


    var style = [{
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "road",
        "elementType": "geometry",
            "stylers": [{
            "visibility": "on"
        }, {
            "color": "#ffffff"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
            "stylers": [{
            "visibility": "on"
        }, {
            "color": "#fee379"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
            "stylers": [{
            "visibility": "on"
        }, {
            "color": "#fee379"
        }]
    }, {
        "featureType": "landscape",
            "stylers": [{
            "visibility": "on"
        }, {
            "color": "#f3f4f4"
        }]
    }, {
        "featureType": "water",
            "stylers": [{
            "visibility": "on"
        }, {
            "color": "#7fc8ed"
        }]
    }, {
        "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
            "visibility": "on"
        }, {
            "color": "#83cead"
        }]
    },{
        "featureType": "road",
        "elementType": "labels",
            "stylers": [{
            "visibility": "on"
        }]
    },{
        "featureType": "administrative",
        "elementType": "labels",
            "stylers": [{
            "visibility": "on"
        }]
    }]

    var options = {
        zoom: 16,
        center: centerPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($('#map')[0], options);
    map.setOptions({
        styles: style
    });
    
    var image = {
      url: 'http://www.carpages.ca/images/showroom/mapIcon.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 64)
    };
    var marker = new google.maps.Marker({
        position: centerPosition,
        map: map,
        icon: image
    });
});