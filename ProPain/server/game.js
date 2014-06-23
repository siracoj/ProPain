//Place holder file for server operations

var util = require("util"),
    io = require("socket.io"),
    PlayerData = require("./playerdata").PlayerData;

var socket,
    players;

function init() {
    players = [];
    
    //Socket configuration
    socket = io.listen(8000);
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    
    setEventHandlers();
};

//Socket connection events
var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
}

function onNewPlayer(data){
    //create player server data
    var newPlayer = new PlayerData(data.x, data.y);
    newPlayer.id = this.id;
    
    //send player to other clients
    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()}); //emits player data to all clients
    
    //get existing players for the new client
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});  //emits player data to this client
    }
    players.push(newPlayer);
};

function onMovePlayer(data){
    
};

init();