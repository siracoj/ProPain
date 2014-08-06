var WaitState = function(game){this.game = game};

WaitState.prototype.preload = function(){

};

WaitState.prototype.create = function(){
    this.background = this.game.add.sprite(0,0,'fence');
    this.title = this.add.sprite(400,200, 'waitforplay');
    this.title.anchor.setTo(0.5, 0.5);
    this.searching = this.game.add.audio('searching');
    this.searching.play();
    this.waitBar = this.game.add.tileSprite(0,500,800,29,'tankbar');
    this.waitBar.autoScroll(-200,0);
    this.menubutton = this.game.add.button(400,350,'menubutton',this.menuClick, this);
    this.menubutton.anchor.setTo(0.5,0.5);
    try{
        socket.emit("new player", {gameRequest: this.game.gameRequest, character: this.game.character, x: game.width/2 , y: game.height-100});
        console.log("Player sent");
    }catch(err){
        console.log("PLayer could not be sent");
        console.log(err.message);
    }
    
};

WaitState.prototype.update = function(){
    if(otherPlayerReady){
       this.game.state.start("GameState"); 
    }else if(noGames){
       this.title.destroy()
       this.title = this.add.sprite(400,200,'nogames');
       this.title.anchor.setTo(0.5, 0.5);
       
    }
};

WaitState.prototype.menuClick = function(){
    //this.game.state.start("MenuState",true,false);
    window.location.replace(window.location.pathname);
};

