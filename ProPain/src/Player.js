//Player Class
//Holds player object, and movement functions


function Player(playerNumber, character, id) {
    
    //////////////////////////////////////////Properties////////////////////////////////////////////////////

    this.id = id;
    //Player 1,2,...
    this.playerNumber = playerNumber;  
    //Chosen character
    this.character = character;
    // Set a flag for tracking if we've double jumped
    this.canDoubleJump = true;
    // Set a flag for tracking if the player can adjust their jump height
    this.canVariableJump = true;
    
    
};

//////////////////////////////////////////////////////Getters and Setters////////////////////////////////////////////

Player.prototype.getX = function() {
    return this.sprite.body.x;
};

Player.prototype.getY = function() {
    return this.sprite.body.y;
};

Player.prototype.setX = function(newX) {
    this.sprite.body.x = newX;
};

Player.prototype.setY = function(newY) {
    this.sprite.body.y = newY;
};
    ///////////////////////////////////////Player Functions////////////////////////////////////////////////



Player.prototype.loadPlayer = function(GameState){
    //if(this.character == 'HANK'){
        //GameState.game.load.image(this.playername, '/assets/gfx/hank.png');
        GameState.game.load.spritesheet(this.id, '/assets/gfx/hanksprite3.png',32,40,16);
    /*}else if(this.character == 'DALE'){
        this.playername = 'player2';
        GameState.game.load.image(this.playername, 'assets/gfx/dale.png');
    }*/
}
    
Player.prototype.enablePlayer = function(GameState){
    //Load Player sprite and animations
    this.sprite = GameState.game.add.sprite(GameState.game.width / 2, GameState.game.height-100, this.id);
    this.sprite.animations.add('walkRight',[1,2,3,4],5,true);
    this.sprite.animations.add('walkLeft',[10,11,12,13],5,true);
    //this.sprtie.animations.add('stand',[14],2,false);
    this.sprite.animations.add('punch',[15],2,false);

    
    
    //player health
    this.sprite.health =100;

    // Enable physics on the player
    
    GameState.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.sprite.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.sprite.body.maxVelocity.setTo(GameState.MAX_SPEED, GameState.MAX_SPEED * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.sprite.body.drag.setTo(GameState.DRAG, 0); // x, y
        
}

Player.prototype.movePlayer = function(GameState){
        
    // Collide the player with the ground
    GameState.game.physics.arcade.collide(this.sprite, GameState.ground);

    if (GameState.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.sprite.body.acceleration.x = -GameState.ACCELERATION;
        this.sprite.animations.play('walkLeft');
        
        
    } else if (GameState.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.sprite.body.acceleration.x = GameState.ACCELERATION;
        this.sprite.animations.play('walkRight');
    } else {
        this.sprite.body.acceleration.x = 0;
        this.sprite.animations.stop();
    }
    //insert animation call her
    
        
}

Player.prototype.basicAttackPlayer = function(GameState){
    this.sprite.animations.play('punch');
    this.sprite.animations.play('stand');
    this.sprite.animations.stop();
}
    
Player.prototype.jumpPlayer = function(GameState){
    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.sprite.body.touching.down;
    if (onTheGround) this.canDoubleJump = true;

    if (GameState.upInputIsActive(5)) {
        // Allow the player to adjust his jump height by holding the jump button
        if (this.canDoubleJump) this.canVariableJump = true;

        if (this.canDoubleJump || onTheGround) {
            // Jump when the player is touching the ground or they can double jump
            this.sprite.body.velocity.y = GameState.JUMP_SPEED;

            // Disable ability to double jump if the player is jumping in the air
            if (!onTheGround) this.canDoubleJump = false;
        }
    }

    // Keep y velocity constant while the jump button is held for up to 150 ms
    if (this.canVariableJump && GameState.upInputIsActive(150)) {
        this.sprite.body.velocity.y = GameState.JUMP_SPEED;
    }

    // Don't allow variable jump height after the jump button is released
    if (!GameState.upInputIsActive()) {
        this.canVariableJump = false;
    }
}
