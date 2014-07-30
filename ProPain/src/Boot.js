var BootState = function(game){this.game = game};

BootState.prototype.preload = function(){
    this.load.image('propainlogo', 'assets/gfx/ProPainLogo.png');
};
BootState.prototype.create = function(){
    this.game.state.start('LoadState');
};

