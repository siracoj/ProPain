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

var GameData = function() {
    var player1,
        player2,
        id;
};


   //Tell the server to listen for incoming connections
    server.listen(80)

        //Log something so we know that it succeeded.
    console.log('\t :: Express :: Listening on port 80' );

    app.use(express.static(__dirname));
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

function onRemoteDead(data){
    try{
        this.broadcast.emit("dead", {game: data.game});
    }catch(err){
    }
    var i;
   for(i=0; i<players.length; i++){
        if(players[i].id === this.id){
            games.splice(players[i],1);
            players.splice(i,1);
        }
    }

};
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
    var i;
   for(i=0; i<players.length; i++){
        if(players[i].id === this.id){
            try{
                this.broadcast.emit("remove", {game: players[i].game});
            }catch(err){}
            games.splice(players[i],1);
        }
    }

};
function removeGame(id, disconnected){
   var i;
   for(i=0; i<players.length; i++){
        if(players[i].id === this.id){
            if(disconnected){ 
                try{
                    this.broadcast.emit("remove", {game: players[i].game});
                }catch(err){}
            }
            games.splice(players[i],1);
            players.splice(i,1);
        }
    }
};

function onNewPlayer(data){
    var index;
    //create player server data
    util.log("Player data arriving");
    var newPlayer = new PlayerData(data.x, data.y);
    newPlayer.id = this.id;
    newPlayer.character = data.character;
    //send player to other clients   
    
    

    if(data.gameRequest == 'create'){
        var newGame = new GameData();
        newGame.id = games.length;
        newPlayer.game = newGame.id;
        this.emit("gameid", {game: newGame.id});    
        newGame.player1 = newPlayer;
        players.push(newPlayer);
        games.push(newGame);
        return;
    }else{
        for(index = 0; index < games.length; index++){
            if(games[index].player2 == null){
                newPlayer.game = index;
                players.push(newPlayer);
                games[index].player2 = newPlayer;
                this.emit("gameid", {game: index});    
                
                var otherPlayer = games[index].player1;
                try{
                    //emits player data to this client
                    this.emit("new player", {id: otherPlayer.id, game: index, character: otherPlayer.character, x: otherPlayer.getX(), y: otherPlayer.getY()}); 
                }catch(err){
                    util.log("Failed to send existing player");
                    util.log(err);
                }
                util.log("Existing player sent with ID: "+otherPlayer.id);
                updatePlayers(newPlayer, this, index); 
                return;
            }
        }
        this.emit("no games");
     }
};
function updatePlayers(newPlayer, client, gameid){
    try{
        client.broadcast.emit("new player", {id: newPlayer.id, game: gameid, character: newPlayer.character, x: newPlayer.getX(), y: newPlayer.getY()}); //emits player data to all clients
        util.log("Broadcast of player data successfull");
    }catch(err){
        util.log("Could not Broadcast player data: "+ err.message);
    }
};
function onMoveRight(data){
    try{
        this.broadcast.emit("moveRight",{id: this.id, health: data.health});
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
        this.broadcast.emit("moveLeft",{id: data.id, health: data.health});
        this.emit("moveLeft",{id: data.id});
    }catch(err){
        util.log(err);
    }
};
function onMoveStop(data){
    try{
        this.broadcast.emit("moveStop",{id: data.id, health: data.health, x: data.x, y: data.y});
        this.emit("moveStop",{id: data.id});
    }catch(err){
        util.log(err);
    }
};

init();
