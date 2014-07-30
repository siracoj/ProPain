//Place holder file for server operations

var util = require("util"),
    UUID = require('node-uuid'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require("socket.io")(server),
    PlayerData = require("./playerdata").PlayerData;

var socket,
    players,
    games;



   //Tell the server to listen for incoming connections
    server.listen(80)

        //Log something so we know that it succeeded.
    console.log('\t :: Express :: Listening on port 80' );

    app.use(express.static(__dirname));
        //By default, we forward the / path to index.html automatically.
    app.get( '/', function( req, res ){
        console.log('trying to load %s', __dirname + '/GamePage.html');
        res.sendfile( '/FrontPage.html' , { root:__dirname });
    });


        //This handler will listen for requests on /*, any file from the root of our server.
        //See expressjs documentation for more info on routing.

    app.get( '/*' , function( req, res, next ) {

            //This is the current file they have requested
        var file = req.params[0];

            //For debugging, we can track what files are requested.
      console.log('\t :: Express :: file requested : ' + file);

            //Send the requesting client the file.
        res.sendfile( __dirname + '/' + file );

    }); //app.get *

function init() {
    players = [];
    games = [];
    //Socket configuration
    
    setEventHandlers();
};

//Socket connection events
var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
   
};

function onSocketConnection(client) {
    util.log("New Player connected: "+client.id);
    client.on("new player", onNewPlayer);
    client.on("moveLeft", onMoveLeft);
    client.on("moveRight", onMoveRight);
    client.on("moveStop", onMoveStop);
    client.on("jump", onJump);
    client.on("jumpStop", onJumpStop);
    client.on("attack", onAttack);
    client.on("throw", onProjectile);
    client.on("disconnect", onClientDisconnect);
    client.on("dead", onRemoteDead);
};

function onRemoteDead(){
    try{
        this.broadcast.emit("dead");
    }catch(err){
    }
}
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
    this.broadcast.emit("dead");
    var i;
    for(i=0; i<players.length; i++){
        if(players[i].id == this.id){
            players.splice(i,1);
        }
    }
}

function onNewPlayer(data){
    //create player server data
    util.log("Player data arriving");
    var newPlayer = new PlayerData(data.x, data.y);
    newPlayer.id = this.id;
    //util.log("Player "+newPlayer.id+" is at position: "+newPlayer.getX()+","+newPlayer.getY());
    //send player to other clients
    try{
        this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()}); //emits player data to all clients
        util.log("Broadcast of player data successfull");
    }catch(err){
        util.log("Could not Broadcast player data: "+ err.message);
    }
    
    //get existing players for the new client
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        try{
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});  //emits player data to this client
        }catch(err){
           util.log("Failed to send existing player");
           util.log(err);
        }
        util.log("Existing player sent with ID: "+existingPlayer.id);
    }
    players.push(newPlayer);
};

function onMoveRight(data){
    try{
        this.broadcast.emit("moveRight",{id: this.id});
        this.emit("moveRight",{id: this.id});
    }catch(err){
        util.log(err);
    }
};
function onJump(data){
    try{
        this.broadcast.emit("jump",{id: data.id});
        this.emit("jump",{id: data.id});
    }catch(err){
        util.log(err);
    }
};
function onJumpStop(data){
    try{
        this.broadcast.emit("jumpStop",{id: data.id});
        this.emit("jumpStop",{id: data.id});
    }catch(err){
        util.log(err);
    }
};
function onAttack(data){
    try{
        this.broadcast.emit("attack",{id: data.id});
        this.emit("attack",{id: data.id});
    }catch(err){
        util.log(err);
    }
};
function onProjectile(data){
    try{
        this.broadcast.emit("throw",{id: data.id});
        this.emit("throw",{id: data.id});
    }catch(err){
        util.log(err);
    }
};

function onMoveLeft(data){
    try{
        this.broadcast.emit("moveLeft",{id: data.id});
        this.emit("moveLeft",{id: data.id});
    }catch(err){
        util.log(err);
    }
};
function onMoveStop(data){
    try{
        this.broadcast.emit("moveStop",{id: data.id});
        this.emit("moveStop",{id: data.id});
    }catch(err){
        util.log(err);
    }
};

init();
