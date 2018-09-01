var LastFmNode = require('lastfm').LastFmNode;
var fs = require('fs');

if (process.argv.length < 4) {
    console.log("Usage: setup.js <api_key> <secret>");
} else {

    var api_key = process.argv[2];
    var secret = process.argv[3];

    var lastfm = new LastFmNode({
        api_key: api_key,
        secret: secret
    });

    var request = lastfm.request("auth.getToken", {
        handlers: {
            success: function(data) {

                var token = data.token;
                console.log("Log in as the user you wish to Scrobble to. Then go to this URL and authorize the app:");
                console.log("http://www.last.fm/api/auth/?api_key=%s&token=%s", api_key, token);
                console.log("Afterwards please check this terminal again…");

                function checkToken() {
                    lastfm.request("auth.getSession", {
                        token: token,
                        handlers: {

                            success: function(data) {
                                var sk = data.session.key;
                                console.log("We got a session key:", sk);
                            },

                            error: function(error) {
                                setTimeout(checkToken, 2000);
                            }

                        }
                    });
                }

                setTimeout(checkToken, 2000);

            },
            error: function(error) {
                console.log("Error: " + error.message);
            }
        }
    });
}