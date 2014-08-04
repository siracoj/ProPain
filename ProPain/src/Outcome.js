var OutState = function(game){this.game = game};

OutState.prototype.preload = function(){

};

OutState.prototype.create = function(){
    this.background = this.game.add.sprite(0,0,'fence');
    this.menubutton = this.game.add.button(400,350,'menubutton',this.menuClick, this);
    this.menubutton.anchor.setTo(0.5,0.5);
     this.outtext = this.game.add.text(
        400, 150, this.game.outcome, { font: '32px Arial', fill: 'red' }
    );
    this.outtext.anchor.setTo(0.5,0.5);


};

OutState.prototype.update = function(){
};

OutState.prototype.menuClick = function(){
    //this.game.state.start("MenuState",true,false);
    window.location.replace(window.location.pathname);
};

