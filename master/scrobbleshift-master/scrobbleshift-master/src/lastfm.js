var Lastfm = function(lastfmNode, sessionKey) {

    var session = lastfmNode.session({key: sessionKey});
        that = this;

    that.getScrobbles = function(user, from, to, callback) {

        var scrobbles;

        lastfmNode.request('user.getRecentTracks', {
            user: user,
            limit: 200,
            from: from,
            to: to,
            handlers: {
                success: function(data) {

                    scrobbles = data.recenttracks.track;

                    if (! scrobbles) {
                        scrobbles = [];
                    }

                    scrobbles = scrobbles instanceof Array ? scrobbles : [scrobbles];

                    callback(null, scrobbles);
                },
                error: function(error) {
                    callback(error);
                }
            }
        });
    };

    that.scrobble = function(scrobble) {
        lastfmNode.update('scrobble', session, scrobble);
    };

    that.updateNowPlaying = function(scrobble, durationInSeconds) {
        lastfmNode.update('nowplaying', session,
            {
                artist: scrobble.artist,
                track: scrobble.track,
                album: scrobble.album,
                duration: durationInSeconds
            }
        );
    };
}

module.exports.create = function(lastFmNodeInstance, sessionKey) {
    return new Lastfm(lastFmNodeInstance, sessionKey);
};
