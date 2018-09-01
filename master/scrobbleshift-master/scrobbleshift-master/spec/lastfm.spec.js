var Lastfm = require('../src/lastfm.js'),
    lastfm,
    lastfmNodeInstance = {
        session: function() { return {}; },
        request: function() {},
        update:  function() {},
    };

describe("A Lastfm module", function() {

    it('should create a session when started', function() {

        spyOn(lastfmNodeInstance, 'session');
        Lastfm.create(lastfmNodeInstance, "key");
        expect(lastfmNodeInstance.session).toHaveBeenCalledWith({key: "key"});
    });

    describe('when requesting scrobbles', function() {

        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy();
            lastfm = Lastfm.create(lastfmNodeInstance, "key");
        });

        it('asks for scrobbles within the specified time range', function() {

            var options;

            spyOn(lastfmNodeInstance, 'request').andCallFake(function(method, methodOptions) {
                options = methodOptions
            });

            lastfm.getScrobbles("username", 0, 1, callback);

            expect(lastfmNodeInstance.request).toHaveBeenCalledWith('user.getRecentTracks', jasmine.any(Object));
            expect(options.user).toBe("username");
            expect(options.from).toBe(0);
            expect(options.to).toBe(1);
        });

        it('returns an array of scrobbles', function() {

            spyOn(lastfmNodeInstance, 'request').andCallFake(function(method, methodOptions) {
                var successHandler = methodOptions.handlers.success;
                successHandler({
                    recenttracks: {
                        track: [
                            {"some": "track"}
                        ]
                    }
                });
            });

            lastfm.getScrobbles("username", 0, 1, callback);
            expect(callback).toHaveBeenCalledWith(null, [{"some": "track"}]);
        });

        it('returns an array of scrobbles even when the Last.fm API doesnt', function() {

            spyOn(lastfmNodeInstance, 'request').andCallFake(function(method, methodOptions) {
                var successHandler = methodOptions.handlers.success;
                successHandler({
                    recenttracks: {
                        track: {"some": "track"}
                    }
                });
            });

            lastfm.getScrobbles("username", 0, 1, callback);
            expect(callback).toHaveBeenCalledWith(null, [{"some": "track"}]);
        });

        it('returns an empty array when there are no recent tracks', function() {

            spyOn(lastfmNodeInstance, 'request').andCallFake(function(method, methodOptions) {
                var successHandler = methodOptions.handlers.success;
                successHandler({
                    recenttracks: {}
                });
            });

            lastfm.getScrobbles("username", 0, 1, callback);
            expect(callback).toHaveBeenCalledWith(null, []);
        });

    });

    it('can scrobble the provided track', function() {

        spyOn(lastfmNodeInstance, 'update');
        lastfm = Lastfm.create(lastfmNodeInstance, "key");

        lastfm.scrobble({"scrobble": "track"});

        expect(lastfmNodeInstance.update).toHaveBeenCalledWith('scrobble', jasmine.any(Object), {"scrobble":"track"});
    });

    it('can update now playing with the provided track', function() {

        spyOn(lastfmNodeInstance, 'update');
        lastfm = Lastfm.create(lastfmNodeInstance, "key");

        lastfm.updateNowPlaying({artist: "artistName", track: "trackName", album: "albumName"}, 10);

        expect(lastfmNodeInstance.update).toHaveBeenCalledWith('nowplaying', jasmine.any(Object),
            {
                artist: "artistName",
                track: "trackName",
                album: "albumName",
                duration: 10
            }
        );
    });

});