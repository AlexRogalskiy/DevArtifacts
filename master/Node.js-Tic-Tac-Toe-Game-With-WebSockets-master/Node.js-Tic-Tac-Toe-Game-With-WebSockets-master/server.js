const game = require("./board");
const express = require('express');
let app = express();
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile('public' + "/" + "index.html");
});
let server = app.listen(8080, function () {
    console.log("Tic-Tac-Toe server listening on http:\\127.0.0.1:8080");
});
const io = require('socket.io').listen(server).sockets;
let connections = 0;
let start = 0;
let p1;
let p2;
let board = null;
io.on('connection', function (socket) {
    if (connections < 2) {
        connections++;
        if (connections == 1) {
            p1 = "x";
            p2 = "o";
        }
        else if (connections == 2) {
            io.emit("status", "Both players have joined the game. Press start when Ready!");
        }
    }
    else {
        console.log("Limited!");
        socket.disconnect();
    }
    socket.on('start', function () {
        if (start == 1) {
            socket.emit("handshake", p2);
            start++;
            board = new game.Board(p1, p2);
            io.emit("go", { "plays": board.getPlays(), "err": "" });
        }
        else if (start == 0) {
            socket.emit("handshake", p1);
            socket.emit("status", "Waiting for the second player...");
            start++;
        }
    });
    socket.on("disconnect", function () {
        connections--;
        start = 0;
        board = null;
        io.emit("win", "The other player left the game...");
    });
    socket.on('push', function (data) {
        if (board != null) {
            let ans = board.push(data.sign, data.x, data.y);
            if (ans >= 2) {
                io.emit("go", { "plays": board.getPlays(), "err": "Wrong input!" });
            }
            else {
                let plays;
                if (ans == 0) {
                    plays = "x";
                }
                else if (ans == 1) {
                    plays = "o";
                }
                io.emit("draw", { "x": data.x, "y": data.y, "sign": data.sign });
                let win = board.win(data.sign);
                if (win == 1) {
                    io.emit("win", "Player " + data.sign + " wins!");
                    board = null;
                    start = 0;
                }
                else if (win == 2) {
                    io.emit("win", "No winner!");
                    board = null;
                    start = 0;
                }
                else {
                    io.emit("go", { "plays": plays, "err": "" });
                }
            }
        }
    });
});
