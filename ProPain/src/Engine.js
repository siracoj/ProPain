var text, socket, globalGame;


///////////////////////////////////GAMESTATE//////////////////////////////////

var GameState = function (game) {
    this.player = new Player(1, 'HANK', 'local', game.width/2 ,game.height-100);
    //this.powerUp = new PowerUP(1,'BEER', 'local', game.width/2 ,game.height-100);
    this.remotePlayers = [];
    this.game = game;
    globalGame = game;
    // Start listening for events
    //this.setEventHandlers();
};
/*
///////////////////////////////////////EVENTS//////////////////////////////////
GameState.prototype.setEventHandlers = function() {
    socket.on("connect", this.onSocketConnected);
    socket.on("new player", this.onNewPlayer);
    socket.on("move player", this.onMovePlayer);
    socket.on("remove player", this.onRemovePlayer);
    socket.on("disconnect", this.onSocketDisconnect);
};
GameState.prototype.onSocketConnected = function() {
    console.log("Connected to socket server");
    try{
        socket.emit("new player", {x: this.game.width/2 , y: this.game.height-100}); 
        console.log("Player sent");
    }catch(err){
        console.log("PLayer could not be sent");
        console.log(err.message);
    }
};

GameState.prototype.onSocketDisconnect = function() {
    console.log("Disconnected from socket server");
};

GameState.prototype.onNewPlayer = function(data) {
    console.log("New player connected: "+data.id);
    
    var newPlayer = new Player(2, 'HANK');
    newPlayer.id = data.id;
    this.remotePlayers.push(newPlayer);
    
};

GameState.prototype.onMovePlayer = function(data) {

};

GameState.prototype.onRemovePlayer = function(data) {

};
*/

/////////////////////////////GAMESTATE FUNCTIONS////////////////////////////

// Load images and sounds
GameState.prototype.preload = function () {
    this.game.load.image('ground', 'assets/gfx/ground.png');
    this.game.load.image('platform','assets/gfx/platform.png');
    this.game.load.spritesheet('hank', '/assets/gfx/hanksprite3.png',32,40,16);    
    this.game.load.spritesheet('hank2', '/assets/gfx/hanksprite3.png',32,40,16);    
    //this.dale.loadPlayer(this);
    this.game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 40, 40);
    this.game.load.image('bullet', 'assets/gfx/tank.png');
    this.game.load.image('background', 'assets/gfx/background.jpg'); //attempt to load a background image
    //this.game.powerup.loadPowerUp(this);
};


//
GameState.prototype.create = function () {
    // Set stage background to something sky colored
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVeritcally = true;

    this.game.stage.backgroundColor=0x0066FF;
    //this.game.stage.backgroundImage(0,0,'background');
    this.add.sprite(0,0,'background');
    

    // Define movement constants
    this.MAX_SPEED = 250; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -700; // pixels/second (negative y is up)
    this.SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
    this.BULLET_SPEED = 800; // pixels/second
    this.NUMBER_OF_BULLETS = 20;

    //Create Player
    this.player.enablePlayer(this.game);
    try{
        socket.emit("new player", {x: game.width/2 , y: game.height-100});
        console.log("Player sent");
    }catch(err){
        console.log("PLayer could not be sent");
        console.log(err.message);
    }

//<<<<<<< HEAD
//<<<<<<< HEAD
    //create powerup
   // this.powerUp.enablePowerUp(this.game);
//=======
//=======
//>>>>>>> parent of f24282f... cleaned up some stuff
/*
    try{
       socket = io.connect("http://raineystreet", {port: 80, transports: ["websocket"]});
       // socket = io.connect("http://74.61.206.165", {port: 80, transports: ["websocket"]});
       // Start listening for events
       this.setEventHandlers();
    }catch(err){
       try{
            socket = io.connect("http://raineystreet", {port: 80, transports: ["websocket"]});
            this.setEventHandlers();
            console.log("connected locally");
       }catch(err){
           console.log("Server could not be reached");
           console.log(err);
       }
    }
*/
    //this.dale.enablePlayer(this);
    

    //var t = game.add.text(game.world.centerX-300, 0, text, style);

    
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
    this.createPlatforms(0,130,310);
    //second car
    this.createPlatforms(310,420,310);
    //Third car
    this.createPlatforms(520,590,310);
    //Random Platform
   this.createPlatforms(530,590,500);
    //Fourth car
    this.createPlatforms(740,800,310);
//---------End of Platforms-------------
    
    
//----------Create text------------
    this.healthDisplay = this.game.add.text(
        this.game.world.centerX, this.game.world.centerY+280, this.player.sprite.health, { font: '16px Arial', fill: '#ffffff' }
    );
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
    
    // Create a group for explosions
    this.explosionGroup = this.game.add.group();

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

    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();
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
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
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

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};


// The update() method is called every frame
GameState.prototype.update = function() {
    
    //Show FPS
    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }

    //Update Player
    this.player.movePlayer(this);
    this.player.jumpPlayer(this);
    var i; 
    for(i = 0; i < remotePlayers.length; i++){
        remotePlayers[i].movePlayer(this);
        remotePlayers[i].jumpPlayer(this);
    }
    
    //Update Health
   this.healthDisplay.setText(this.player.sprite.health);
    
    // Check if bullets have collided with the ground
    this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
        // Create an explosion
        this.getExplosion(bullet.x, bullet.y);

        // Kill the bullet
        bullet.kill();
    }, null, this);

    // Rotate all living bullets to match their trajectory
    this.bulletPool.forEachAlive(function(bullet) {
        bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
    }, this);

    //Throw propain
    if(this.input.keyboard.justPressed(Phaser.Keyboard.A)){
        this.shootBullet(this.player);
        try{
        socket.emit('throw');
        }catch(err){
            console.log("Shoot failed");
        }
    }
    if(remoteThrow){
        this.shootBullet(remotePlayers[0]);
        remoteThrow = false;
    }
    
    //Punch
    if(this.input.keyboard.justPressed(Phaser.Keyboard.S)){
     this.player.basicAttackPlayer(); 
     try{
     socket.emit('attack');
         
        }catch(err){
            console.log("Punch failed");
        }
    }
    if(remoteAttack){
        remotePlayers[0].basicAttackPlayer();
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
/*
GameState.prototype.setEventHandlers = function() {
    socket.on("connect", this.onSocketConnected);
    socket.on("new player", this.onNewPlayer);
    socket.on("move player", this.onMovePlayer);
    socket.on("remove player", this.onRemovePlayer);
    socket.on("disconnect", this.onSocketDisconnect);
};
GameState.prototype.onSocketConnected = function() {
    console.log("Connected to socket server");
    try{
        socket.emit("new player", {x: globalGame.width/2 , y: globalGame.height-100});
        console.log("Player sent");
    }catch(err){
        console.log("PLayer could not be sent");
        console.log(err.message);
    }
};

GameState.prototype.onSocketDisconnect = function() {
    console.log("Disconnected from socket server");
};

GameState.prototype.onNewPlayer = function(data) {
    console.log("New player connected: "+data.id);
    var newPlayer = new Player(2, 'HANK2', data.id);
//    newPlayer.id = data.id;
//    this.remotePlayers.push(newPlayer);
//    newPlayer.loadPlayer(this);
    try{
        newPlayer.enablePlayer(game);
    }catch(err){
        console.log("New Player failed to be created");
        console.log(err);
    }
};

GameState.prototype.onMovePlayer = function(data) {

};

GameState.prototype.onRemovePlayer = function(data) {

};
*/
