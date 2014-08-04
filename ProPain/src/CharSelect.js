var CharState = function(game){
    this.game = game;
};

CharState.prototype.preload = function() {
    this.load.image('hank','assets/gfx/Hank.png');
    this.load.image('dale','assets/gfx/dale.png');
    this.load.image('background', 'assets/gfx/background.jpg');
    this.load.audio('sfxImHank','assets/gfx/audio/Hank - Hank Hill.mp3');
    this.game.load.audio('sfxDaleSwornEnemy','assets/gfx/audio/Dale - Sworn Enemy.mp3');
    
};

CharState.prototype.create = function(){
    this.background = this.game.add.sprite(-10,0,'background');
    this.dale = this.game.add.button(300,300,'hank',this.hankClick, this);
    this.hank = this.game.add.button(500,300,'dale',this.daleClick, this);
    this.dale.anchor.setTo(0.5,0.5);
    this.hank.anchor.setTo(0.5,0.5);
    this.imHankHill= this.game.add.audio('sfxImHank');
    this.daleDisturbing = this.game.add.audio('sfxDaleSwornEnemy');
};

CharState.prototype.hankClick = function(){
    this.imHankHill.play();
    this.game.character = 'HANK';
    this.game.state.start('WaitState');
    
};
CharState.prototype.daleClick = function(){
    this.daleDisturbing.play();
    this.game.character = 'DALE';
    this.game.state.start('WaitState');
};

