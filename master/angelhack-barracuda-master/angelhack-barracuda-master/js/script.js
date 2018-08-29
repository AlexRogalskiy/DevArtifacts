BarracudaWeb = {

    map: null,
    positions: [],
    currentPos: new google.maps.LatLng(50.0484247, 19.9597454),
    zoom: 25,
    limit: 20,
    interval: 60000,
    battery: 99,

    initialize: function() {
        BarracudaWeb.map = new google.maps.Map(document.getElementById('map'), {
            zoom: BarracudaWeb.zoom,
            center: BarracudaWeb.currentPos
        });
        BarracudaWeb.map.setZoom(BarracudaWeb.zoom);
        BarracudaWeb.search();
        setInterval(BarracudaWeb.search, BarracudaWeb.interval);
    },

    update: function() {
        //polyline
        var latLngs = [];
        BarracudaWeb.positions.forEach(function(pos) {
            if(pos.lat > 0 && pos.long > 0)
                latLngs.push(new google.maps.LatLng(pos.lat, pos.long));
        });
        var path = new google.maps.Polyline({
            path: latLngs,
            geodesic: true,
            strokeColor: '#F00000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        path.setMap(BarracudaWeb.map);
        
        //current marker with bubble
        var currentPos = latLngs[latLngs.length-1];
        var currentTime = BarracudaWeb.positions[BarracudaWeb.positions.length-1].timestamp;
        var title = '<p style="text-align: center; font-size: 22px; font-weight: bold;"><img src="img/icon.png"> Device 1</p><p><b>Last seen:</b> ' + new Date(currentTime).toUTCString() + '<br><b>Position:</b> ' + currentPos.lat() + ', ' + currentPos.lng() + '</p>';
        var infowindow = new google.maps.InfoWindow({
            content: title
        });
        var marker = new google.maps.Marker({
            position: currentPos,
            map: BarracudaWeb.map,
            animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(BarracudaWeb.map, marker);
        });
        BarracudaWeb.map.panTo(currentPos);
        
        //battery
        $('.progress-bar').css('width', BarracudaWeb.battery + '%').text(BarracudaWeb.battery + '%');
    },

    collect: function(data) {
        BarracudaWeb.positions = [];
        for (var pos in data.documents) {
            BarracudaWeb.positions.push({
                lat: parseFloat(data.documents[pos].lat),
                long: parseFloat(data.documents[pos].long),
                timestamp: parseInt(data.documents[pos].id)
            });
        }
        if(data.battery) {
            BarracudaWeb.battery = parseInt(data.battery);
        }
        BarracudaWeb.update();
    },

    search: function() {
        console.log('Searching...');
        BarracudaWeb.send({query: '~911', docs: BarracudaWeb.limit}, '_search', BarracudaWeb.collect);
    },
    
    alarm: function() {
        console.log('Ringing...');
        BarracudaWeb.send({id: '911', funcId: 'alarm', timestamp: new Date().getTime()}, '_partial_replace', BarracudaWeb.alarmed);
    },
    
    alarmed: function() {
        console.log('Alarmed!');
        $('#ring').popover('show');
        setTimeout(function() {
            $('#ring').popover('hide');
        }, 2000);
    },

    send: function(payload, method, cb) {
        $.ajax({
            method: 'POST',
            url: 'https://api-eu.clusterpoint.com/741/barracuda/' + method + '.json',
            headers: {'Authorization': 'Basic cm9vdEBqYXZhYmVhbi5ydToyNDgwMXg='},
            data: JSON.stringify(payload),
            dataType: 'json'
        }).done(cb);
    }
};

$('#start').click(function() {
    $('#start').fadeOut();
    $('#main').fadeIn();
    $('#ring').click(BarracudaWeb.alarm).popover({
        placement: 'bottom',
        content: 'Sent the signal to the device!'
    });
    BarracudaWeb.initialize();
});