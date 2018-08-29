/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');

var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
//        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

// var splashCard = new UI.Card({
//     title: 'Barracuda',
//     subtitle: 'Let me serve you',
//     body: 'Press any button.'
// });
var splashCard = new UI.Window();

var textfield = new UI.Text({
    position: new Vector2(10, 115),
    size: new Vector2(144, 30),
    font: 'gothic-36-bold',
    text: 'BARRACUDA ASSISTANT',
    textAlign: 'left'
  });

splashCard.add(textfield);

var pic = new UI.Image({
  position: new Vector2(30, 20),
  size: new Vector2(84, 84),
  image:'images/SplashScreen.png',
  compositing:'normal'
});
splashCard.add(pic);

splashCard.show();

splashCard.on('click', 'up', function (e) {
    var URL = 'https://api-eu.clusterpoint.com/741/barracuda/_search.json';
    // Download data
    ajax({
            url: URL,
            method: 'post',
            type: 'json',
            data: {
                "query": "~911",
                "docs": 3
            },
            headers: {
                Authorization: "Basic " + Base64.encode('root@javabean.ru' + ":" + '24801x'),
            }
        },
        function (json) {
            var arr = [];
            for (var key in json.documents) {
                arr.push(key);
            }

            var menu = new UI.Menu({
                sections: [{
                    items: [
                    {
                      title:'long: ' + json.documents[arr[0]].lat,
                      subtitle:'lat: '+ json.documents[arr[0]].long
//                         subtitle: new Date(json.documents[arr[0]].id)
                    },
                    {
                      title:'long: '+ json.documents[arr[1]].lat,
                      subtitle:'lat: '+ json.documents[arr[1]].long
//                         subtitle: new Date(json.documents[arr[1]].id)
                    },
                    {
                      title:'long: '+ json.documents[arr[2]].lat,
                      subtitle:'lat: '+json.documents[arr[2]].long
//                         subtitle: new Date(json.documents[arr[2]].id)
                    }],
                  
            }]
            });
            menu.on('select', function (e) {
                console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
                console.log('The item is titled "' + e.item.title + '"');
            });
            menu.show();
            //splashCard.hide();
        },
        function (error) {
            console.log('Ajax failed: ' + JSON.stringify(error));
        }
    );

});

splashCard.on('click', 'select', function (e) {
    var URL = 'https://api-eu.clusterpoint.com/741/barracuda/911/.json';
    // Download data
    ajax({
            url: URL,
            method: 'put',
            type: 'json',
            data: {
                "funcId": "alarm",
                "timestamp": new Date().getTime()
            },
            headers: {
                Authorization: "Basic " + Base64.encode('root@javabean.ru' + ":" + '24801x'),
            }
        },
        function (json) {
            var wind = new UI.Window({fullscreen: true});
            var textfield = new UI.Text({
                position: new Vector2(0, 65),
                size: new Vector2(144, 30),
                font: 'gothic-24-bold',
                text: 'Scanning...',
                textAlign: 'center'
            });
            wind.add(textfield);
            Vibe.vibrate('short');
            wind.show();
        },
        function (error) {
            console.log('Ajax failed: ' + error);
        }
    );
});

splashCard.on('click', 'down', function (e) {
    var card = new UI.Card();
    card.title('About');
    card.subtitle('AngelHack rocks');
    card.body('We did this app through a course of this weekend');
    card.show();
});