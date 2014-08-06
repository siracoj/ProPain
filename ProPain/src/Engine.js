var text,  music, sfxBoom, imHankHill, hankHeckOfaNerve, hankKickAss, hankProjectAnger, daleSwornEnemy, daleDisturbing, boomhauer, billLonghorns;

///////////////////////////////////GAMESTATE//////////////////////////////////

var GameState = function (game) {
    //ERROR HERE
    this.powerUp = new PowerUp(1,'BEER', 'local', game.width-500 ,game.height-100);
    this.game = game;
    // Start listening for events
    //this.setEventHandlers();
};


/////////////////////////////GAMESTATE FUNCTIONS////////////////////////////

// Load images and sounds
GameState.prototype.preload = function () {
    /*game.stage.disableVisibilityChange = true;
    this.game.load.image('ground', 'assets/gfx/ground.png');
    this.game.load.image('platform','assets/gfx/platform.png');
    this.game.load.spritesheet('HANK', '/assets/gfx/hanksprite4.png',32,40,17);        
    this.game.load.spritesheet('DALE', '/assets/gfx/dalesprite.png',32,40,17);        
    this.game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 40, 40);
    this.game.load.image('bullet', 'assets/gfx/tank.png');
    //this.game.load.image('background', 'assets/gfx/background.jpg'); //attempt to load a background image
    this.game.load.image('powerup','assets/gfx/beer-sprite.png');
    this.game.load.audio('themeMusic','assets/gfx/audio/KOTH Theme Song.mp3'); 
*/};


//
GameState.prototype.create = function () {
    // Set stage background to something sky colored
    localPlayer.character = this.game.character;
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVeritcally = true;
    
    this.game.stage.backgroundColor=0x0066FF;
    //this.game.stage.backgroundImage(0,0,'background');
    this.add.sprite(-10,0,'background');
    
    //Audio
    this.music = this.game.add.audio('themeMusic');
    this.music.play();
    //this.music.volume = .5;
    
    
    this.sfxBoom = this.game.add.audio('sfxExplosion');
    this.imHankHill= this.game.add.audio('sfxHank');
    this.hankHeckOfaNerve = this.add.audio('sfxHankHeckNerve');
    this.hankKickAss = this.add.audio('sfxHankKickAss');
    this.hankProjectAnger = this.add.audio('sfxHankProjectAnger');
    this.daleSwornEnemy = this.add.audio('sfxDaleSwornEnemy');
    this.daleDisturbing = this.add.audio('sfxDaleDisturbing');
    this.boomhauer = this.add.audio('sfxBoomhauer');
    this.billLonghorns = this.add.audio('sfxBillWinLonghorns');
    

    // Define movement constants
    this.MAX_SPEED = 250; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -1000; // pixels/second (negative y is up)
    this.SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
    this.BULLET_SPEED = 800; // pixels/second
    this.NUMBER_OF_BULLETS = 20;

    //Create Player
    if(this.game.gameRequest == 'create'){
        localPlayer.x = 150;
        remotePlayer.x = 650;
    }else{
        localPlayer.x = 650;
        remotePlayer.x = 150;
    }
    localPlayer.y = 300;
    remotePlayer.y = 300;
    localPlayer.enablePlayer(this.game);
    remotePlayer.enablePlayer(this.game);

    
    // Since we're jumping we need gravity
    this.game.physics.arcade.gravity.y = this.GRAVITY;
    
    
//--------Create the Ground----------   
    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for (var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }
//---------End of Ground---------------
    
    
//----------create platforms---------
  this.platform = this.game.add.group();
    //PLatforms for first car
    this.createPlatforms(100,300,125);
    //second car
    this.createPlatforms(300,500,250);
    //Third car
    //Random Platform
   //this.createPlatforms(530,590,500);
    //Fourth car
    this.createPlatforms(500,700,125);
//---------End of Platforms-------------
    
    
//----------Create text------------
    this.healthDisplay = this.game.add.text(
        localPlayer.sprite.x, localPlayer.sprite.y+50, "You: "+localPlayer.sprite.health, { font: '16px Arial', fill: '#ffffff' }
    );
    this.remoteHealthDisplay = this.game.add.text(
        remotePlayer.sprite.x, remotePlayer.sprite.y+50, "Enemy: "+remotePlayer.sprite.health, { font: '16px Arial', fill: 'red' }
    );
    this.healthDisplay.anchor.setTo(0.5,0.5);
    this.remoteHealthDisplay.anchor.setTo(0.5,0.5);
//----------End of Text-----------
    
    

    
    // Create an object pool of bullets
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }
      
    // Create an object pool of bullets for the opponent 
    this.remoteBulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.remoteBulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }
    //----------Create PowerUp----------
    
    this.powerUp.enablePowerUp(this);
//----------End PowerUp-------------
    // Create a group for explosions
    this.explosionGroup = this.game.add.group();
    this.sandGroup = this.game.add.group();
    this.remoteSandGroup = this.game.add.group();

    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#ffffff' }
    );
};

//Create Platforms anywhere on the map and add if to the platform
//grounp.  Note Group must already be created
GameState.prototype.createPlatforms=function(start,stop,y){
    for (var x = start; x < stop; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var platformBlock = this.game.add.sprite(x, this.game.height - y, 'platform');
        this.game.physics.enable(platformBlock, Phaser.Physics.ARCADE);
        platformBlock.body.immovable = true;
        platformBlock.body.allowGravity = false;
        this.platform.add(platformBlock);
    }   
};


GameState.prototype.shootBullet = function(player) {
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;
    var bullet;
    // Get a dead bullet from the pool
    if(player.playerNumber == 1){
        bullet = this.bulletPool.getFirstDead();
    }else{
        bullet = this.remoteBulletPool.getFirstDead();
    }
    
    this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    // Revive the bullet
    // This makes the bullet "alive"
    bullet.revive();
    
    
    
    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
    
    //puts the bullet at the players position
    bullet.reset(player.sprite.x, player.sprite.y);

    // Set the bullet position to the gun position.
    bullet.rotation = player.sprite.rotation;

    // Shoot it in the right direction
    if(player.facingRight){
        bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    }else{
        bullet.body.velocity.x = -Math.cos(bullet.rotation) * this.BULLET_SPEED;
    }
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
};



GameState.prototype.getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], 100, false);
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');
    this.sfxBoom.play();
    this.sfxBoom.volume = .5;
    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};

GameState.prototype.pocketSand = function(x, y, direction, islocal, character) {
    var psand;
    if(islocal){
        psand = this.sandGroup.getFirstDead();
    }else{
        psand = this.remoteSandGroup.getFirstDead();
    }

    if(psand === null){
        var animate;
        if(character === 'DALE'){
        psand = this.game.add.sprite(0,0,'sand');
        animate = psand.animations.add('cone', [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 100, false);
        }else{
        psand = this.game.add.sprite(0,0,'sound');
        animate = psand.animations.add('cone', [0,1,2,3,4], 100, false);
        }
        //psand.anchor.setTo(0.5, 0.5);
        animate.killOnComplete = true;
        if(islocal){this.sandGroup.add(psand);}
        else{this.remoteSandGroup.add(psand);}
    }
    
    this.game.physics.enable(psand, Phaser.Physics.ARCADE);
    psand.body.allowGravity = false;
    psand.body.immovable = true;

    psand.revive();

    psand.x = x;
    psand.y = y;

    if(direction === 'left'){
        psand.angle = 180;
    }
    psand.animations.play('cone');
    return psand;

};

GameState.prototype.playerLoses = function(player){
    try{
        socket.emit("dead", {game: gameid});
    }catch(err){}

    player.kill();
    this.game.outcome = "You Lose";
    this.game.state.start("OutState");

};
// The update() method is called every frame
GameState.prototype.update = function() {
    
    //Show FPS
    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }

     
    //Update Health
    this.healthDisplay.setText("You: "+localPlayer.sprite.health);
    this.healthDisplay.x = localPlayer.sprite.x;
    this.healthDisplay.y = localPlayer.sprite.y+50;
    this.remoteHealthDisplay.setText("Enemy: "+remotePlayer.sprite.health);
    this.remoteHealthDisplay.x = remotePlayer.sprite.x;
    this.remoteHealthDisplay.y = remotePlayer.sprite.y+50;
    this.healthDisplay.anchor.setTo(0.5,0.5);
    this.remoteHealthDisplay.anchor.setTo(0.5,0.5);

    // Check if bullets have collided with the ground
    this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);

        // Kill the bullet
        bullet.kill();
    }, null, this);
    
    this.game.physics.arcade.collide(this.remoteBulletPool, this.ground, function(bullet, ground) {
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);

        // Kill the bullet
        bullet.kill();
    }, null, this);
    
    this.game.physics.arcade.collide(this.bulletPool, this.platform, function(bullet, ground) {
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);

        // Kill the bullet
        bullet.kill();
    }, null, this);


    this.game.physics.arcade.collide(localPlayer.sprite, this.remoteSandGroup, function(player, sand) {
        player.health -= 10;
        if(player.health <= 0){
            this.playerLoses(player);
        }
        sand.kill()

    }, null, this);
    
    this.game.physics.arcade.collide(remotePlayer.sprite, this.sandGroup, function(player, sand) {

    sand.kill(); }, null, this);

    this.game.physics.arcade.collide(this.remoteBulletPool, this.platform, function(bullet, ground) {
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);

        // Kill the bullet
        bullet.kill();
    }, null, this);
    
    //player hit by bullet
    this.game.physics.arcade.collide(localPlayer.sprite, this.remoteBulletPool, function(player, bullet) {
        this.getExplosion(bullet.x, bullet.y);
        player.health -= 30;
        if(player.health <= 0){
            this.playerLoses(player);
        }
        // Kill the powerup
        bullet.kill();
    }, null, this);
    
    this.game.physics.arcade.collide(localPlayer.sprite, this.powerUps, function(player, powerup) {
        console.log("power up get");
        player.health += 30;
        // Kill the powerup
        powerup.kill();
    }, null, this);
    
    if(remotePlayer.playerNumber == 2){
        this.game.physics.arcade.collide(remotePlayer.sprite, this.powerUps, function(player, powerup) {
            console.log("power up get");
            // Kill the powerup
            powerup.kill();
        }, null, this);
        this.game.physics.arcade.collide(remotePlayer.sprite, this.bulletPool, function(player, bullet){
            this.getExplosion(bullet.x, bullet.y);
        }, null, this);
    }
    localPlayer.movePlayer(this);
    localPlayer.jumpPlayer(this);
    if(remotePlayer.playerNumber == 2){
        remotePlayer.movePlayer(this);
        remotePlayer.jumpPlayer(this);
    }


    // Rotate all living bullets to match their trajectory
    this.bulletPool.forEachAlive(function(bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
    }, this);
    this.remoteBulletPool.forEachAlive(function(bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
    }, this);
    
        

    //Throw propain
    if(this.input.keyboard.justPressed(Phaser.Keyboard.A)){
        try{
        socket.emit('throw',{id: localPlayer.id});
        }catch(err){
            console.log("Shoot failed");
        }
    }
    if(localThrow){
        if(localPlayer.character === 'DALE' || localPlayer.character === 'BOOM'){
            if(localPlayer.facingRight){
                this.pocketSand(localPlayer.sprite.x, localPlayer.sprite.y+40, 'right',true, localPlayer.character);
            }else{
                this.pocketSand(localPlayer.sprite.x, localPlayer.sprite.y+40, 'left',true, localPlayer.character);
            }
        }else{
            this.shootBullet(localPlayer);
        }
        localThrow = false;
    }
        
    if(remoteThrow){
         if(remotePlayer.character === 'DALE' || remotePlayer.character === 'BOOM'){
            if(remotePlayer.facingRight){
                this.pocketSand(remotePlayer.sprite.x, remotePlayer.sprite.y+40, 'right',false, remotePlayer.character);
            }else{
                this.pocketSand(remotePlayer.sprite.x, remotePlayer.sprite.y+40, 'left',false, remotePlayer.character);
            }
        }else{
            this.shootBullet(remotePlayer);
        }
        remoteThrow = false;
    }
    
    //Punch
    if(this.input.keyboard.justPressed(Phaser.Keyboard.S)){
        try{
            socket.emit('attack',{id: localPlayer.id});
         
        }catch(err){
            console.log("Punch failed");
        }
    }
    if(localAttack){
        localPlayer.basicAttackPlayer(); 
        localAttack = false;
    }
 
    if(remoteAttack){
        remotePlayer.basicAttackPlayer();
        remoteAttack = false;
    }
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x < this.game.width/4);
    
    return isActive;
};


GameState.prototype.render= function() {
    this.game.debug.soundInfo(this.music, 20, 64);
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
GameState.prototype.upInputIsActive = function(duration) {
    var isActive = false;

    isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);
    isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
        this.game.input.activePointer.x > this.game.width/4 &&
        this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
};