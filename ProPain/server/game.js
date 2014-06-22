//Place holder file for server operations

var util = require("util"),
    io = require("socket.io");

var socket,
    players;

function init() {
    players = [];
    
    //Socket configuration
    socket = io.listen(80);
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    
    
};

init();