//Player Class
//Holds player object, and movement functions


function Player(playerNumber, character, id, x, y) {
    
    //////////////////////////////////////////Properties////////////////////////////////////////////////////

    this.facingRight = true;
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
    this.isPunchingLeft =false;
    this.isPunchingRight= false;
    
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

Player.prototype.enablePlayer = function(GameState){
    //Load Player sprite and animations
    this.sprite = GameState.add.sprite(this.x, this.y, this.character);
        
    this.sprite.animations.add('walkRight',[1,2,3,4],10,true);
    this.sprite.animations.add('walkLeft',[10,11,12,13],10,true);
    this.sprite.animations.add('standRight',[0],2,false);
    this.sprite.animations.add('standLeft',[14],2,false);
    this.sprite.animations.add('punchRight',[15,0],2,false);
    this.sprite.animations.add('punchLeft',[16,14],2,false);

    
    
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
    
    //Collide player with platform
    GameState.game.physics.arcade.collide(this.sprite, GameState.platform);

   
    
    if ((localLeft && this.playerNumber == 1) || (remoteLeft && this.playerNumber != 1)) {
        // If the LEFT key is down, set the player velocity to move left
        this.sprite.body.acceleration.x = -GameState.ACCELERATION;
        this.sprite.animations.play('walkLeft');
        this.facingRight = false;
        
    } else if ((localRight && this.playerNumber == 1) || (remoteRight && this.playerNumber != 1)) {
        // If the RIGHT key is down, set the player velocity to move right
        this.sprite.body.acceleration.x = GameState.ACCELERATION;
        this.facingRight=true;
        this.sprite.animations.play('walkRight');
    }else{
        this.sprite.body.acceleration.x = 0;
        if(this.facingRight){
            this.sprite.animations.play('standRight');
        }else{
            this.sprite.animations.play('standLeft');
        }
    }

    if(GameState.leftInputIsActive()){
        if(this.playerNumber == 1){
            try{

                socket.emit('moveLeft',{id: this.id, health: this.sprite.health});
            }catch(err){
                //console.log("Move failed");
            }
        }

    }else if(GameState.rightInputIsActive()){
        if(this.playerNumber == 1){
            try{

               socket.emit('moveRight',{health: this.sprite.health});
            }catch(err){
                //console.log("Move failed");
            }
        }
    } else {
        if(this.playerNumber == 1){
            try{

                socket.emit('moveStop',{id: this.id, health: this.sprite.health, x: this.sprite.body.x, y: this.sprite.body.y});
            }catch(err){
            }
        }

    }

}

Player.prototype.basicAttackPlayer = function(GameState){
    if(this.facingRight){
            this.isPunchingLeft=true;
            this.sprite.animations.play('punchRight');
            this.isPunchingLeft=false;
        }else{
            this.isPunchingRight=true;
            this.sprite.animations.play('punchLeft');
            this.isPunchingRight=false;
        }
    
}
    
Player.prototype.jumpPlayer = function(GameState){
    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.sprite.body.touching.down;
    if (onTheGround) this.canDoubleJump = true;
    
    if ((localJump && this.playerNumber == 1) || (remoteJump && this.playerNumber != 1)) {
        // Allow the player to adjust his jump height by holding the jump button
        if (this.canDoubleJump) this.canVariableJump = true;

        if (this.canDoubleJump || onTheGround) {
            // Jump when the player is touching the ground or they can double jump
            this.sprite.body.velocity.y = GameState.JUMP_SPEED;

            // Disable ability to double jump if the player is jumping in the air
            if (!onTheGround) this.canDoubleJump = false;
        }
    }
    if(GameState.upInputIsActive()){
        if(this.playerNumber == 1){
            try{
                socket.emit('jump',{id: this.id});
            
            }catch(err){
                // console.log("jump failed");
            }
        }
    }


    // Don't allow variable jump height after the jump button is released
    if ((!localJump && this.playerNumber == 1) || (!remoteJump && this.playerNumber != 1)) {
        this.canVariableJump = false;
    }
    if(!GameState.upInputIsActive()){
        if(this.playerNumber == 1){
            try{
                socket.emit('jumpStop',{id: this.id});
            
            }catch(err){
               // console.log("Stop failed");
            }
        }
    }
}
