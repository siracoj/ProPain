//Place holder file for server operations

var util = require("util"),
    io = require("socket.io"),
    express = require('express'),
    UUID = require('node-uuid'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    PlayerData = require("./playerdata").PlayerData;

var socket,
    players;



   //Tell the server to listen for incoming connections
    server.listen(80)

        //Log something so we know that it succeeded.
    console.log('\t :: Express :: Listening on port 80' );

        //By default, we forward the / path to index.html automatically.
    app.get( '/', function( req, res ){
        console.log('trying to load %s', __dirname + '/GamePage.html');
        res.sendfile( '/GamePage.html' , { root:__dirname });
    });


        //This handler will listen for requests on /*, any file from the root of our server.
        //See expressjs documentation for more info on routing.

    app.get( '/*' , function( req, res, next ) {

            //This is the current file they have requested
        var file = req.params[0];

            //For debugging, we can track what files are requested.
        if(verbose) console.log('\t :: Express :: file requested : ' + file);

            //Send the requesting client the file.
        res.sendfile( __dirname + '/' + file );

    }); //app.get *

function init() {
    players = [];
    
    //Socket configuration
    socket = io.listen(server);
    socket.set("transports", ["websocket"]);
    
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
