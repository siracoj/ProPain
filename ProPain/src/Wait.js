var WaitState = function(game){this.game = game};

WaitState.prototype.preload = function(){

};

WaitState.prototype.create = function(){
    this.title = this.add.sprite(400,200, 'waitforplay');
    this.title.anchor.setTo(0.5, 0.5);
    this.waitBar = this.game.add.tileSprite(0,400,800,29,'tankbar');
    this.waitBar.autoScroll(-200,0);
    try{
        socket.emit("new player", {character: this.game.character, x: game.width/2 , y: game.height-100});
        console.log("Player sent");
    }catch(err){
        console.log("PLayer could not be sent");
        console.log(err.message);
    }

};

WaitState.prototype.update = function(){
    if(otherPlayerReady){
       this.game.state.start("GameState"); 
    }
};
