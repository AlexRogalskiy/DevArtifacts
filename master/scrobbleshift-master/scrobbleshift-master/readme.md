Scrobble Shift
=============

Shift your Last.fm scrobbles in time, to a new account.

Take the scrobbles of any user from [0-7] years ago, and scrobble them to a new account, as if they were being played today, right now. Tracks are scrobbled exactly [0-7] years after they were first played, whilst "now playing" is simulated based on gaps between scrobbles (a gap of less than ten minutes is assumed to be continuous playback).

See http://last.fm/user/fofr and http://last.fm/user/fofr-plus-one for examples.

Why?
---------------------

* Rediscover songs you’ve forgotten
* Play a time shifted Last.fm radio station
* See how your tastes have changed
* Remember what you were doing this time last year

Setup
---------------------

* Clone and run npm install
* Create a Last.fm API account at http://last.fm/api
* Sign up a Last.fm user account to scrobble to at http://last.fm/join
* Configure node environment variables, see: config.default.env
    * I’m using Heroku and Foreman locally, see: https://devcenter.heroku.com/articles/config-vars#local-setup
    * The app needs at least one session key config variable, setup.js is a helper for this. Run:

    `node setup.js API_KEY API_SECRET`

Tests
---------------------

Tests are written for jasmine-node. Run:

    jasmine-node spec/