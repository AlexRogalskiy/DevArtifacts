Barracuda = {

    batteryLevel: 0,
    coords: {},
    timestamp: 0,
    interval: 30000, //ms

    /**
     * Application initialization
     */
    initialize: function () {
        console.log("[Barracuda] started!");
        window.setInterval(Barracuda.loop, Barracuda.interval);
    },

    /**
     * Runs every interval
     */
    loop: function () {
        console.log('[Barracuda] Loop started!');
        navigator.geolocation.getCurrentPosition(Barracuda.getLocationData, null, {timeout: Barracuda.interval, enableHighAccuracy: true});

        var packet = {
            coords: Barracuda.coords,
            id: Barracuda.timestamp,
            battery: Barracuda.batteryLevel
        };
        Barracuda.Sender.send(packet);
    },

    /**
     * Callback on new location data
     * @params {{coords: Object, timestamp: Date}}
     */
    getLocationData: function (position) {
        if(position.coords) {
            Barracuda.coords = position.coords;
            Barracuda.timestamp = position.timestamp;
            console.log('[Barracuda] Coordinates ' + JSON.stringify(Barracuda.coords));
        } else {
            console.log('[Barracuda] Error ' + position.code + ': ' + position.message);
        }
    },

    /**
     * Callback on battery level change
     * @params {{level: number, isPlugged: boolean}}
     */
    getBatteryData: function (info) {
        Barracuda.batteryLevel = info.level;
    }
};


Barracuda.Sender = {

    url: 'https://api-eu.clusterpoint.com/741/barracuda/.json',
    username: 'root@javabean.ru',
    password: '24801x',

    /**
     * Sends the payload to the cloud backend
     * @param payload JSON object to send
     * @returns {string} Result
     */
    send: function(payload) {
        /*var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api-eu.clusterpoint.com/741/barracuda/.json');
        xhr.setRequestHeader('Authorization', 'Basic cm9vdEBqYXZhYmVhbi5ydToyNDgwMXg=');
        xhr.send(JSON.stringify(payload));*/
        
        console.log('[Barracuda] Sending ' + JSON.stringify(payload));
       
        cordovaHTTP.post('https://api-eu.clusterpoint.com/741/barracuda/.json',
        payload,
        { Authorization: 'Basic cm9vdEBqYXZhYmVhbi5ydToyNDgwMXg=' },
        function(response) {
            console.log('[Barracuda] Success: ' + JSON.stringify(response));
        }, function(response) {
            console.error('[Barracuda] Error: ' + JSON.stringify(response));
        });

    }

};