//Player Class
//Holds player object, and movement functions


function Player(playerNumber, character, id, x, y) {
    
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
    this.x = x;
    this.y = y;
    
    
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
        GameState.game.load.spritesheet('hank', '/assets/gfx/hanksprite3.png',32,40,16);
    /*}else if(this.character == 'DALE'){
        this.playername = 'player2';
        GameState.game.load.image(this.playername, 'assets/gfx/dale.png');
    }*/
}
    
Player.prototype.enablePlayer = function(GameState){
    //Load Player sprite and animations
    	this.sprite = GameState.add.sprite(this.x, this.y, 'hank');
        
    this.sprite.animations.add('walkRight',[1,2,3,4],5,true);
    this.sprite.animations.add('walkLeft',[10,11,12,13],5,true);
    //this.sprtie.animations.add('stand',[14],2,false);
    this.sprite.animations.add('punch',[15],2,false);

    
    
    //player health
    this.sprite.health =100;

    // Enable physics on the player
    
    GameState.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.sprite.body.collideWorldBounds = true;

    // Set player minimum and maximum movement speed
    this.sprite.body.maxVelocity.setTo(250, 250 * 10); // x, y

    // Add drag to the player that slows them down when they are not accelerating
    this.sprite.body.drag.setTo(600, 0); // x, y
        
}

Player.prototype.movePlayer = function(GameState){
        
    // Collide the player with the ground
    GameState.game.physics.arcade.collide(this.sprite, GameState.ground);

    if ((GameState.leftInputIsActive() && this.playerNumber == 1) || (remoteLeft && this.playerNumber != 1)) {
        // If the LEFT key is down, set the player velocity to move left
        this.sprite.body.acceleration.x = -GameState.ACCELERATION;
        this.sprite.animations.play('walkLeft');
        if(this.playerNumber == 1){socket.emit('moveLeft');} 
        
    } else if ((GameState.rightInputIsActive() && this.playerNumber == 1) || (remoteRight && this.playerNumber != 1)) {
        // If the RIGHT key is down, set the player velocity to move right
        this.sprite.body.acceleration.x = GameState.ACCELERATION;
        this.sprite.animations.play('walkRight');
        if(this.playerNumber == 1){socket.emit('moveRight');} 
       

    } else {
        this.sprite.body.acceleration.x = 0;
        this.sprite.animations.stop();
        if(this.playerNumber == 1){socket.emit('moveStop');} 
       
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
    
    if ((GameState.upInputIsActive() && this.playerNumber == 1) || (remoteJump && this.playerNumber != 1)) {
        // Allow the player to adjust his jump height by holding the jump button
        if (this.canDoubleJump) this.canVariableJump = true;

        if (this.canDoubleJump || onTheGround) {
            // Jump when the player is touching the ground or they can double jump
            this.sprite.body.velocity.y = GameState.JUMP_SPEED;

            // Disable ability to double jump if the player is jumping in the air
            if (!onTheGround) this.canDoubleJump = false;
        }
        if(this.playerNumber == 1){socket.emit('jump');}
    }


    // Don't allow variable jump height after the jump button is released
    if ((!GameState.upInputIsActive() && this.playerNumber == 1) || (!remoteJump && this.playerNumber != 1)) {
        this.canVariableJump = false;
        if(this.playerNumber == 1){socket.emit('jumpStop');}
    }
}
