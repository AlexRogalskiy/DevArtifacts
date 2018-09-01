var DateUtils = require('date-utils');          // https://github.com/JerrySievert/node-date-utils

var ScrobbleShift = function(scheduler, lastfm, username, yearsAgo) {

    var toScrobble = [],
        that = this,
        interval;

    that.start = function() {
        getScrobblesFromThisHourOnThisDayInTheYear();
        interval = setInterval(function() {
            getScrobblesFromThisHourOnThisDayInTheYear();
        }, 3600000);
    }

    that.stop = function() {
        clearInterval(interval);
    }

    function getScrobblesFromThisHourOnThisDayInTheYear() {

        var now = new Date();
        var thisTimelastYear = now.clone().addYears(-yearsAgo);
        var lowerBound = Math.floor(+thisTimelastYear/1000);
        var upperBound = Math.floor(+thisTimelastYear.clone().addHours(1) / 1000);

        lastfm.getScrobbles(username, lowerBound, upperBound, function(error, scrobbles) {
            if ( ! error) {
                scheduleScrobbles(scrobbles);
            } else {
                console.log("Error: " + error.message);
            }
        });
    }

    function scheduleScrobbles(scrobbles) {

        // console.log(tracks.length);

        for(var i = 0, l = scrobbles.length; i < l; i++) {

            var scrobble = scrobbles[i];

            // Ignore now playing tracks (which always get included).
            if (scrobble['@attr']) {
                continue;
            }

            var shiftedScrobbleDate = new Date(scrobble.date.uts * 1000).addYears(yearsAgo);
            var shiftedScrobble = {
                    artist: scrobble.artist['#text'],
                    track: scrobble.name,
                    album: scrobble.album['#text'],
                    timestamp: +shiftedScrobbleDate / 1000,
                    time: shiftedScrobbleDate.toString()
                };

            toScrobble.push(shiftedScrobble);
            scheduler.scheduleJob(shiftedScrobbleDate, scrobbleNext);
        }

        //console.log(toScrobble);
    }

    function scrobbleNext() {
        var scrobble = toScrobble.pop();

        lastfm.scrobble(scrobble);
        nowPlayingNext();
    }

    function nowPlayingNext() {

        var l = toScrobble.length;

        if (l == 0) {
            return;
        }

        var nextScrobble = toScrobble[l - 1];

        var whenNextTrackWillScrobble = new Date(nextScrobble.timestamp * 1000);
        var now = new Date();

        if (now.getMinutesBetween(whenNextTrackWillScrobble) >= 10) {
            return;
        }

        lastfm.updateNowPlaying(nextScrobble, now.getSecondsBetween(whenNextTrackWillScrobble));
    }
}

module.exports.create = function(scheduler, lastfm, username, yearsAgo) {
    return new ScrobbleShift(scheduler, lastfm, username, yearsAgo);
};
