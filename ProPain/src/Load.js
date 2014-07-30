var LoadState = function(game){    
    this.ready = false;
};

LoadState.prototype.preload = function() {
    this.asset = this.add.sprite(400,300, 'propainlogo');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.game.stage.disableVisibilityChange = true;
    this.game.load.image('ground', 'assets/gfx/ground.png');
    this.game.load.image('platform','assets/gfx/platform.png');
    this.game.load.spritesheet('HANK', '/assets/gfx/hanksprite4.png',32,40,17);
    this.game.load.spritesheet('DALE', '/assets/gfx/dalesprite.png',32,40,17);
    this.game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 40, 40);
    this.game.load.image('bullet', 'assets/gfx/tank.png');
    this.game.load.image('background', 'assets/gfx/background.jpg'); 
    this.game.load.image('powerup','assets/gfx/beer-sprite.png');
    this.game.load.audio('themeMusic','assets/gfx/audio/KOTH Theme Song.mp3');

};
LoadState.prototype.create = function() {
    this.asset.cropEnabled = false;
};
LoadState.prototype.update = function() {
    if(!!this.ready) {
        this.game.state.start('CharState');
    }
};
LoadState.prototype.onLoadComplete = function() {
      this.ready = true;
};

