var ScrobbleShift = require('../src/scrobbleshift.js'),
    scrobbleShift,
    scheduler = {
        scheduleJob: function() {}
    },
    lastfm = {
        getScrobbles: function() {},
        scrobble: function() {},
        updateNowPlaying: function() {}
    };

describe("A ScrobbleShift module", function() {

    afterEach(function() {
        if (typeof scrobbleShift === "object") {
            scrobbleShift.stop();
        }
    });

    it('should getScrobbles when created', function() {
        spyOn(lastfm, 'getScrobbles');
        scrobbleShift = ScrobbleShift.create(scheduler, lastfm, 'username', 1);
        scrobbleShift.start();
        expect(lastfm.getScrobbles).toHaveBeenCalled();
    });

    it('should getScrobbles from the specified number of years ago, bounded by an hour, for the specified user', function() {
        spyOn(lastfm, 'getScrobbles');
        scrobbleShift = ScrobbleShift.create(scheduler, lastfm, 'username', 1);
        scrobbleShift.start();
        expect(lastfm.getScrobbles).toHaveBeenCalledWith('username', jasmine.any(Number), jasmine.any(Number), jasmine.any(Function));

        var now = Math.floor(+new Date()/1000),
            secondsInAnHour = 60 * 60,
            secondsInAYear = 365 * 24 * secondsInAnHour,
            arguments = lastfm.getScrobbles.mostRecentCall.args,
            timeBetweenNowAndLowerBound = now - arguments[1],
            timeBetweenUpperAndLowerBound = arguments[2] - arguments[1];

        expect(timeBetweenNowAndLowerBound >= secondsInAYear).toBe(true);
        expect(timeBetweenUpperAndLowerBound == secondsInAnHour).toBe(true);
    });

    describe('when scrobbles are returned', function() {

        var scrobbles = [],
            now,
            lastYear;

        beforeEach(function() {

            spyOn(lastfm, 'getScrobbles').andCallFake(function(username, lower, upper, callback) {
                callback(null, scrobbles);
            });

            scrobbleShift = ScrobbleShift.create(scheduler, lastfm, 'username', 1);

            now = Math.floor(+new Date()/1000),
            lastYear = now - (365 * 24 * 60 * 60);
        });

        afterEach(function() {
            scrobbles = [];
        });

        it('schedules a scrobble at the right time', function() {

            scrobbles = [
                {
                    artist: {'#text': 'artistName'},
                    name: 'trackName',
                    album: {'#text': 'albumName'},
                    date: {uts: lastYear + 1}
                }
            ];

            spyOn(scheduler, 'scheduleJob').andCallThrough();
            scrobbleShift.start();

            expect(scheduler.scheduleJob).toHaveBeenCalledWith(jasmine.any(Date), jasmine.any(Function));

            var scheduledTime = +scheduler.scheduleJob.mostRecentCall.args[0];
            expect(scheduledTime - (now * 1000)).toBe(1000);
        });

        it('schedules multiple scrobbles', function() {

            scrobbles = [
                {
                    artist: {'#text': 'artistName'},
                    name: 'trackName',
                    album: {'#text': 'albumName'},
                    date: {uts: lastYear + 2}
                },
                {
                    artist: {'#text': 'artistName'},
                    name: 'trackName',
                    album: {'#text': 'albumName'},
                    date: {uts: lastYear + 1}
                }
            ];

            spyOn(scheduler, 'scheduleJob').andCallThrough();
            scrobbleShift.start();

            expect(scheduler.scheduleJob.callCount).toBe(2);
        });

        describe('when its time to scrobble', function() {

            var callbacks;

            beforeEach(function() {

                callbacks = [];

                spyOn(scheduler, 'scheduleJob').andCallFake(function(date, c) {
                    callbacks.push(c);
                });

                spyOn(lastfm, 'scrobble');
                spyOn(lastfm, 'updateNowPlaying');
            });

            it('sends the next scrobble to lastfm', function() {

                scrobbles = [
                    {
                        artist: {'#text': 'artistName'},
                        name: 'trackName',
                        album: {'#text': 'albumName'},
                        date: {uts: lastYear + 1}
                    }
                ];

                scrobbleShift.start();

                callbacks[0]();
                expect(lastfm.scrobble).toHaveBeenCalled();

                var scrobble = lastfm.scrobble.mostRecentCall.args[0];
                expect(scrobble.artist).toBe('artistName');
                expect(scrobble.track).toBe('trackName');
                expect(scrobble.album).toBe('albumName');
                expect(scrobble.timestamp).toBe(now + 1);

            });

            describe('when there is another scrobble queued', function() {

                it('sends now playing if the scrobble happens within 10 minutes of the previous', function() {

                    scrobbles = [
                        {
                            artist: {'#text': 'nextArtistName'},
                            name: 'nextTrackName',
                            album: {'#text': 'nextAlbumName'},
                            date: {uts: lastYear + 180}
                        },
                        {
                            artist: {'#text': 'artistName'},
                            name: 'trackName',
                            album: {'#text': 'albumName'},
                            date: {uts: lastYear + 1}
                        }
                    ];

                    scrobbleShift.start();
                    callbacks[1]();

                    expect(lastfm.updateNowPlaying).toHaveBeenCalled();

                    var np = lastfm.updateNowPlaying.mostRecentCall.args,
                        nowPlayingDuration = np[1];

                    expect(np[0].artist).toBe('nextArtistName');
                    expect(np[0].track).toBe('nextTrackName');
                    expect(np[0].album).toBe('nextAlbumName');

                    /* Seconds between tracks */
                    expect(nowPlayingDuration).toBe(179);

                });

                it('doesnt send now playing if the scrobble happens after 10 minutes', function() {

                    scrobbles = [
                        {
                            artist: {'#text': 'nextArtistName'},
                            name: 'nextTrackName',
                            album: {'#text': 'nextAlbumName'},
                            date: {uts: lastYear + 601}
                        },
                        {
                            artist: {'#text': 'artistName'},
                            name: 'trackName',
                            album: {'#text': 'albumName'},
                            date: {uts: lastYear + 1}
                        }
                    ];

                    scrobbleShift.start();
                    callbacks[1]();

                    expect(lastfm.updateNowPlaying).not.toHaveBeenCalled();
                });

            });

        });

    });

});