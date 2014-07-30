var CharState = function(game){
    this.game = game;
};

CharState.prototype.preload = function() {
    this.load.image('hank','assets/gfx/Hank.png');
    this.load.image('dale','assets/gfx/dale.png');
    this.load.image('background', 'assets/gfx/background.jpg');
};

CharState.prototype.create = function(){
    this.background = this.game.add.sprite(-10,0,'background');
    this.dale = this.game.add.button(300,300,'hank',this.hankClick, this);
    this.hank = this.game.add.button(500,300,'dale',this.daleClick, this);
    this.dale.anchor.setTo(0.5,0.5);
    this.hank.anchor.setTo(0.5,0.5);

};

CharState.prototype.hankClick = function(){
    this.game.character = 'HANK';
    this.game.state.start('GameState');
};
CharState.prototype.daleClick = function(){
    this.game.character = 'DALE';
    this.game.state.start('GameState');
};

