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

PowerUpPlayer.prototype.setY = function(newY) {
    this.sprite.body.y = newY;
};
    ///////////////////////////////////////Player Functions////////////////////////////////////////////////



PowerUp.prototype.loadPowerUp = function(GameState){
        GameState.game.load.image('powerup','assets/gfx/beer-sprite.png');//loads powerup image
    
}
    
PowerUp.prototype.enablePowerUp = function(GameState){
    //Load Player sprite and animations
    	this.sprite = GameState.add.sprite(this.x, this.y, 'powerup');
        


    // Enable physics on the player
    
    GameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.sprite.body.collideWorldBounds = true;
    
    //Possible way for collition detection
    //beer = this.game.add.group();
    //beer.enableBody = true;
    //var beer = beer.create(this.game.width/ 2, this.game.height-50,'powerup');
    GameState.game.powerUp = this.game.add.group();
    //for (var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var powerUp = GameState.add.sprite(450, this.game.height - 100, 'powerup');
        this.game.physics.enable(powerUp, Phaser.Physics.ARCADE);
        
        powerUp.body.allowGravity = false;
        GameState.game.powerUp.add(powerUp);
    //}
        
}

GameState.prototype.powerup = function(){
   //this.game.add.sprite(this.game.width/ 2, this.game.height-50,'powerup');
};


function collectPoweup (player, powerup) {
    
    // Removes the star from the screen
    beer.kill();
 
}

}
