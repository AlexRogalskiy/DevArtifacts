var scheduler     = require('node-schedule'),        // https://github.com/mattpat/node-schedule
    LastfmNode    = require('lastfm').LastFmNode,    // https://github.com/jammus/lastfm-node
    DateUtils     = require('date-utils'),           // https://github.com/JerrySievert/node-date-utils
    Lastfm        = require('./src/lastfm'),
    ScrobbleShift = require('./src/scrobbleshift');

var config = {
        api_key:    process.env.API_KEY,
        secret:     process.env.API_SECRET,
        sk:         process.env.API_SESSION_KEY,
        username:   process.env.USERNAME,
        years:      process.env.YEARS || 1
    };

var lastfmNode = new LastfmNode({api_key: config.api_key, secret: config.secret});

for(var i = 1; i <= config.years; i++) {

    // eg. process.env.API_SESSION_KEY_YEAR_1
    var sk = process.env['API_SESSION_KEY_YEAR_' + i],
        lastfm = Lastfm.create(lastfmNode, sk),
        scrobbleShift = ScrobbleShift.create(scheduler, lastfm, config.username, i);

    // Stagger start times
    var startTime = new Date().addMinutes(i - 1);
    scheduler.scheduleJob(startTime, scrobbleShift.start);
}