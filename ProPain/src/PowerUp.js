//PowerUp Class
//Holds PowerUp object, and movement functions


function PowerUp(powerUpNumber, powerUp, id, x, y) {
    
    //////////////////////////////////////////Properties////////////////////////////////////////////////////

    this.id = id;
    //PowerUP 1,2,...
    this.powerUpNumber = powerUpNumber;  
    //Chosen powerUp i.e. beer
    this.powerUp = powerUp;
    this.x = x;
    this.y = y;
    
    
};

//////////////////////////////////////////////////////Getters and Setters////////////////////////////////////////////

PowerUp.prototype.getX = function() {
    return this.sprite.body.x;
};

PowerUp.prototype.getY = function() {
    return this.sprite.body.y;
};

PowerUp.prototype.setX = function(newX) {
    this.sprite.body.x = newX;
};

PowerUp.prototype.setY = function(newY) {
    this.sprite.body.y = newY;
};
    ///////////////////////////////////////Player Functions////////////////////////////////////////////////



PowerUp.prototype.loadPowerUp = function(GameState){
        GameState.game.load.image('powerup','assets/gfx/beer-sprite.png');//loads powerup image
    
}
    
PowerUp.prototype.enablePowerUp = function(GameState){
    //Load Power up group
   GameState.powerUps = GameState.game.add.group();
        var powerUping = GameState.add.sprite(450, GameState.game.height - 100, 'powerup');
        GameState.game.physics.enable(powerUping, Phaser.Physics.ARCADE);
        
        powerUping.body.allowGravity = false;
        GameState.powerUps.add(powerUping);
    //}
        
}

GameState.prototype.powerup = function(){
   //this.game.add.sprite(this.game.width/ 2, this.game.height-50,'powerup');
};


function collectPoweup (player, powerup) {
    
    // Removes the star from the screen
    beer.kill();
 
}


