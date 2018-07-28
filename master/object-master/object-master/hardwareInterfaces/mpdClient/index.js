/**
 * Created by Carsten on 12/06/15.
 *
 * Copyright (c) 2015 Carsten Strunk
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * MPD Client
 *
 * This hardware interface can communicate with a mpd server. All commands specified in the
 * Command Reference http://www.musicpd.org/doc/protocol/command_reference.html can be used.
 *
 *
 * Example mpd status output:
 *    volume: 49
 *    repeat: 0
 *    random: 0
 *    single: 0
 *    consume: 0
 *    playlist: 14
 *    playlistlength: 1
 *    mixrampdb: 0.000000
 *    state: stop
 *    song: 0
 *    songid: 1
 *
 */
//Enable this hardware interface
exports.enabled = false;

if (exports.enabled) {
    var fs = require('fs');
    var mpd = require('mpd');
    var _ = require('lodash');
    var server = require(__dirname + '/../../libraries/HybridObjectsHardwareInterfaces');

    var mpdServers = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf8"));
    var cmd = mpd.cmd;


    /**
     * @desc setup() runs once, adds and clears the IO points
     **/
    function setup() {
        server.developerOn();

        for (var key in mpdServers) {
            var mpdServer = mpdServers[key];
            mpdServer.ready = false;

            mpdServer.client = mpd.connect({ port: mpdServer.port, host: mpdServer.host });

            mpdServer.client.on('error', function (err) {
                console.log("MPD " + mpdServer.id + " " + err);
            });


            //Create listeners for mpd events
            mpdServer.client.on('ready', function () {
                mpdServer.ready = true;
            });

            //volume has changed
            mpdServer.client.on('system-mixer', function () {
                mpdServer.client.sendCommand(cmd("status", []), function (err, msg) {
                    if (err) console.log("Error: " + err);
                    else {
                        var status = mpd.parseKeyValueMessage(msg);
                        server.writeIOToServer(key, "volume", status.volume / 100, "f");
                    }

                });

            });


            //playing status has changed
            mpdServer.client.on('system-player', function () {
                mpdServer.client.sendCommand(cmd("status", []), function (err, msg) {
                    if (err) console.log("Error executing mpd command: " + err);
                    else {
                        var status = mpd.parseKeyValueMessage(msg);
                        if (status.state == "stop") {
                            server.writeIOToServer(key, "status", 0, "f");
                        } else if (status.state == "play") {
                            server.writeIOToServer(key, "status", 1, "f");
                        } else if (status.state == "pause") {
                            server.writeIOToServer(key, "status", 0.5, "f");
                        }
                    }

                });

            });

        }
    }


    exports.receive = function () {
        setup();
    };

    exports.send = function (objName, ioName, value, mode, type) {
        if (server.getDebug()) console.log("Incoming: " + objName + "   " + ioName + "   " + value);
        if (mpdServers.hasOwnProperty(objName)) {
            if (ioName == "volume") {
                mpdServers[objName].client.sendCommand("setvol " + _.floor(value * 100), function (err, msg) {
                    if (err) console.log("Error executing mpd command: " + err);
                });
            } else if (ioName == "status") {
                if (value < 0.33) {
                    if (mpdServers[objName].ready) {
                        mpdServers[objName].client.sendCommand(cmd("stop", []), function (err, msg) {
                            if (err) console.log("Error executing mpd command: " + err);
                        });
                    }
                } else if (value < 0.66) {
                    if (mpdServers[objName].ready) {
                        mpdServers[objName].client.sendCommand(cmd("pause", []), function (err, msg) {
                            if (err) console.log("Error executing mpd command: " + err);
                        });
                    }
                } else {
                    if (mpdServers[objName].ready) {
                        mpdServers[objName].client.sendCommand(cmd("play", []), function (err, msg) {
                            if (err) console.log("Error executing mpd command: " + err);
                        });
                    }
                }
            }

        }

    };

    exports.init = function () {
        if (server.getDebug()) console.log("mpd init()");
        for (var key in mpdServers) {
            server.addIO(key, "volume", "default", "mpdClient");
            server.addIO(key, "status", "default", "mpdClient");
        }
        server.clearIO("mpdClient");
    };
}


