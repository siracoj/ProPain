var MenuState = function(game){
    this.game = game;
};

MenuState.prototype.preload = function() {

};

MenuState.prototype.create = function(){
    this.background = this.game.add.sprite(0,0,'menubackground');
    this.create = this.game.add.button(150,500,'create',this.createClick, this,'createover','create','createdown','create');
    this.join = this.game.add.button(650,500,'join',this.joinClick, this,'joinover','join','joindown','join');
    this.create.anchor.setTo(0.5,0.5);
    this.join.anchor.setTo(0.5,0.5);
};

MenuState.prototype.createClick = function(){
    this.game.gameRequest = 'create';
    this.game.state.start('CharState');

};
MenuState.prototype.joinClick = function(){
    this.game.gameRequest = 'join';
    this.game.state.start('CharState');
};

