var playState = {
	
   

    create: function() { 
	//-----------GAME ENVIRONMENT------------------------------------------------------------------
		this.game.world.setBounds(0, 0, 1600, this.game.height);
		//  A simple background for our game
		this.background = game.add.tileSprite(0, 0,800,600, 'sky');
		
		this.enemyNames = ['crate','stone'];
		this.diamondNames = ["diamond_blue","diamond_yellow"];
        //  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);	
		
		gate = game.add.sprite(game.width-16, 0, 'win');
		gate.height = game.height;
		game.physics.arcade.enable(gate);
		gate.visible = false;
		
		
	//-----------PLATFORMS------------------------------------------------------------------	 
		//  The platforms group contains the ground 
		platforms = game.add.group();
		
		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;

		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 64, 'ground');

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(9, 1);

		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;
		
	//-----------PLAYER------------------------------------------------------------------	 
		// The player and its settings
		player = game.add.sprite(128, game.world.height - 200, 'n-player');
		
		//  We need to enable physics on the player
		game.physics.arcade.enable(player);

		//  Player physics properties. 
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 1000;
		player.body.collideWorldBounds = false;

		//  Our two animations, walking left and right.
		player.animations.add('walk', [0, 1, 2, 3,4,5,6,7,8], 10, true);
		player.animations.add('jump', [10,11,12,13,14,15,16,17,18], 10, true);
		player.animations.add('throw', [20,21,22,23,24,25,26,27,28,29], 10, true);
		player.scale.setTo(0.25, 0.25);
		
		/*var anim = player.animations.add('walk');
		anim.reversed = true;
		player.scale.setTo(0.25, 0.25);*/
		//player.animations.play('walk', 12, true);
		
		player.checkWorldBounds = true;
		player.outOfBoundsKill = true;
		
		
		
		
	//-----------ENEMIES------------------------------------------------------------------
		// Create an empty group for enemies
		this.enemies = game.add.group(); 
		
		//this.timer = game.time.events.loop(2000, this.addEnemies, this);
		
		
	//-----------ITEMS------------------------------------------------------------------
		// Create an empty group for enemies
		this.groundItems = game.add.group();		
		
		this.timer_items = game.time.events.loop(1000, this.addGroundItems, this);			
		
	//-----------WEAPONS------------------------------------------------------------------	
		
		
		//  Creates 1 single bullet, using the 'bullet' graphic
		weapon = game.add.weapon(1, 'bullet');
		//weapon.scale.setTo(2, 2);
		weapon.bullets.setAll('scale.x', 0.3);
		weapon.bullets.setAll('scale.y', 0.3);
		
		//  The bullet will be automatically killed when it leaves the world bounds
		weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;

		//  Because our bullet is drawn facing up, we need to offset its rotation:
		weapon.bulletAngleOffset = 90;
		weapon.fireAngle =0;
		//  The speed at which the bullet is fired
		weapon.bulletSpeed = 400;
		
		weapon.trackSprite(player, player.width/2 , player.height/2);
		
   
	//-----------STATISTICS------------------------------------------------------------------		
		
		this.labelScore = game.add.text(20, 20, 'Score:' + this.game.state.states['menu'].score, 
			{ font: "30px Arial", fill: "#000000" });
			
		
		this.labelLives = game.add.text(game.width-180, 20, 'Lives:' + this.game.state.states['menu'].lives, 
			{ font: "30px Arial", fill: "#000000" });

			
	//-----------VARIABLES------------------------------------------------------------------		
		this.enemySpeed = 250;	
		this.speedUpState = false;
		this.lastItem="-";
		
	
	//-----------KEYS------------------------------------------------------------------	
		
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	
	//-----------AUDIO------------------------------------------------------------------	
		if(this.game.state.states['boot'].audioEnable)
		{
			this.music = game.add.audio('music');
			
			this.music.play();
			
			this.explode = game.add.audio('explode',1,false,true);
			
			this.sword_clink = game.add.audio('sword_clink',1,false,true);
			
		}
    },

    update: function() {
		//Move background Image
		this.background.tilePosition.x-=Math.floor(this.enemySpeed*0.009);
		
		
	//--------COLLISSIONS------------------------------------------------------------
		
		//player & platforms
		var hitPlatform = this.physics.arcade.collide(player, platforms,this.setFriction, null, this);
		
		//player and enemies
		this.physics.arcade.collide(player, this.enemies,this.hitEnemy, null, this);
		
		//bullets and enemies
		this.physics.arcade.overlap(weapon.bullets, this.enemies,this.bulletHitEnemy, null, this);
		
		//enemies and platforms
		this.physics.arcade.collide(this.enemies, platforms);
		
		//items and platforms
		this.physics.arcade.collide(this.groundItems, platforms);
		
		//player and treasure
		this.physics.arcade.collide(player, this.groundItems,this.getItem, null, this);
		
		//game screen and enemies
		this.physics.arcade.overlap(gate, this.enemies,this.countEnemy, null, this);
		
	//--------PLAYER------------------------------------------------------------	
	
		//  Reset the players velocity (movement)
		player.body.velocity.x = 0;
		
		//player.animations.play('right');
		if(hitPlatform && !fireButton.isDown)
			player.animations.play('walk', 16, true);
		
		if (fireButton.isDown)
		{
			player.animations.play('throw', 16, true);
			weapon.fire();			
		}		
		
		//  Allow the player to jump if they are touching the ground.
		if ((cursors.up.isDown && player.body.touching.down && hitPlatform))
		{
			player.body.velocity.y = -550;
			player.animations.play('jump', 16, true);
		}
		
		if(this.game.state.states['menu'].score%10==0 && this.game.state.states['menu'].score > 0 && !this.speedUpState)
		{			
			this.enemySpeed+=50;
			this.speedUpState = true;
		}
		
	},
	addGroundItems: function(){
		var ch = getRandomIntInclusive(0,5);
		if(this.lastItem=="enemy")
		{
			
			while(ch==1 || ch==2)
			{
				ch = getRandomIntInclusive(0,5);
			}
		}
		if(ch==0 || ch==3 ||ch== 4||ch==5){
			this.addTreasures();
			this.lastItem="treasure";
		}
		else{
			this.addEnemies();
			this.lastItem="enemy";
		}
	},
	addTreasures: function(){	
			
			var x = game.width + 400;
			var y = game.height - (Math.floor(game.height/4));	
			
			//random enemy 
			var diamondName = this.diamondNames[ Math.floor( Math.random() * this.diamondNames.length ) ];
			// Create a enemy at the position x and y
			var Item = game.add.sprite(x, y, diamondName);
			Item.type = diamondName;			
		
			// Add the enemy to our previously created group
			this.groundItems.add(Item);
			
			// Enable physics on the enemy 
			game.physics.arcade.enable(Item);

			// Add velocity to the enemy to make it move left
			Item.body.velocity.x = -1*this.enemySpeed; 
		
		
			// Automatically kill the enemy when it's no longer visible 
			Item.checkWorldBounds = true;
			Item.outOfBoundsKill = true;
			Item.body.bounce.y = 0.2;
			Item.body.gravity.y = 500;	
			
			
	},
	addEnemies: function() {			
			var hole = Math.random()+ 0.5;
			
			var x = game.width + 400;
			var y = game.height - (Math.floor(game.height/3));	
			
			//random enemy 
			var enemyName = this.enemyNames[ Math.floor( Math.random() * this.enemyNames.length ) ];
			// Create a enemy at the position x and y
			var enemy = game.add.sprite(x, y, enemyName);
			enemy.type = enemyName;			
			enemy.entered = false;
			// Add the enemy to our previously created group
			this.enemies.add(enemy);
			
			// Enable physics on the enemy 
			game.physics.arcade.enable(enemy);

			// Add velocity to the enemy to make it move left
			enemy.body.velocity.x = -1*this.enemySpeed; 
		
		
			// Automatically kill the enemy when it's no longer visible 
			enemy.checkWorldBounds = true;
			enemy.outOfBoundsKill = true;
			//enemy.body.bounce.y = 0.2;
			enemy.body.gravity.y = 500;		
			
			this.speedUpState = false;
			
		
	},
	//---------hit enemy
	hitEnemy: function(player,enemy) {			
		if(enemy.type=='crate')
		{	if(this.game.state.states['boot'].audioEnable)
				this.explode.play();
				
			this.makeSmoke(enemy.x,enemy.y);
			enemy.destroy();
			this.decreaseScore(5);
		}
		else
		{
			// Prevent new enemies from appearing
			//game.time.events.remove(this.timer);
			this.game.state.states['menu'].lives--;
			this.labelLives.text = 'Lives:' + this.game.state.states['menu'].lives;
			if(this.game.state.states['menu'].lives==0)
			{
				if(this.game.state.states['boot'].audioEnable)
					this.music.stop();
				this.Win();
			}
			else
			{
				if(this.game.state.states['boot'].audioEnable)
					this.music.stop();
				this.restartGame();
			}
		}		
		
	}, 
	bulletHitEnemy: function(bullet,enemy){
		bullet.kill();
		if(enemy.type=='crate')
		{
			this.makeSmoke(enemy.x,enemy.y);
			if(this.game.state.states['boot'].audioEnable)
				this.explode.play();
			enemy.destroy();
			this.decreaseScore(1);
		}
		else if(enemy.type=='stone')
		{
			if(this.game.state.states['boot'].audioEnable)
				this.sword_clink.play();
		}
	},
	getItem: function(player,item){
	var val=1;
	if(item.type=="diamond_blue")
		val=10;
	else if(item.type=="diamond_yellow")	
	{	
		val=20;
		
	}
		this.increaseScore(val);
		item.kill();	
	},
	countEnemy :function(gate,enemy){
		if(!enemy.entered)
		{
			this.increaseScore(1);
			enemy.entered = true;
		}	
	},
	setFriction: function (player, platform) {

            
                player.body.x -= platform.body.x - platform.body.prev.x;
				
            

        },
		// Restart the game
		restartGame: function() {
			// Start the 'main' state, which restarts the game
			game.state.start('play');
		},
	
	Win: function(){
		game.state.start('win');
	},
	makeSmoke: function(x,y){
		y=y-10;
		smoke = game.add.sprite(x, y, 'effects');
		smoke.scale.setTo(0.25, 0.25);
		smoke.animations.add('s1', [0, 1, 2, 3], 24, false);		
		smoke.animations.play('s1',null,false,true);
	},
	increaseScore: function(val){
		this.game.state.states['menu'].score += val;
		this.updateStats();
	},
	decreaseScore: function(val){
		this.game.state.states['menu'].score -= val;
		this.updateStats();
	},
	updateStats :function(){
		this.labelScore.text = 'Score:' + this.game.state.states['menu'].score;
	}
	


	
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}