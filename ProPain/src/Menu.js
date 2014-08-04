var MenuState = function(game){
    this.game = game;
};

MenuState.prototype.preload = function() {

};

MenuState.prototype.create = function(){
    this.create = this.game.add.button(400,200,'create',this.createClick, this,'createover','create','createdown','create');
    this.join = this.game.add.button(400,400,'join',this.joinClick, this,'joinover','join','joindown','join');
    this.create.anchor.setTo(0.5,0.5);
    this.join.anchor.setTo(0.5,0.5);
};

MenuState.prototype.createClick = function(){
    this.game.state.start('CharState');

};
MenuState.prototype.joinClick = function(){
    this.game.state.start('CharState');
};

