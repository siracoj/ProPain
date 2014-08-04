var CharState = function(game){
    this.game = game;
};

CharState.prototype.preload = function() {
    this.load.image('hank','assets/gfx/Hank.png');
    this.load.image('dale','assets/gfx/dale.png');
    this.load.image('background', 'assets/gfx/background.jpg');
    this.load.audio('sfxImHank','assets/gfx/audio/Hank - Hank Hill.mp3');
    this.game.load.audio('sfxDaleSwornEnemy','assets/gfx/audio/Dale - Sworn Enemy.mp3');
    this.load.audio('sfxBoom','assets/gfx/audio/Boomhauer - Makes fun of Hank.mp3');
    this.load.audio('sfxBill','assets/gfx/audio/Bill - Win for Longhorns.mp3');
};

CharState.prototype.create = function(){
    this.background = this.game.add.sprite(0,0,'fence');
    this.dale = this.game.add.button(200,100,'hank',this.hankClick, this);
    this.hank = this.game.add.button(400,100,'dale',this.daleClick, this);
    this.boom = this.game.add.button(400,300,'hauer',this.boomClick, this);
    this.bill = this.game.add.button(200,300,'bill',this.billClick, this);
    this.imHankHill= this.game.add.audio('sfxImHank');
    this.daleDisturbing = this.game.add.audio('sfxDaleSwornEnemy');
    this.sfxBill = this.game.add.audio('sfxBill');
    this.sfxBoom = this.game.add.audio('sfxBoom');
};

CharState.prototype.billClick = function(){
    this.sfxBill.play();
    this.game.character = 'BILL';
    this.game.state.start('WaitState');

};


CharState.prototype.boomClick = function(){
    this.sfxBoom.play();
    this.game.character = 'BOOM';
    this.game.state.start('WaitState');

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

