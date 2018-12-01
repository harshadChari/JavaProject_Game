var menuState = {
	create: function() {
		this.game.world.setBounds(0, 0, 800, this.game.height);
		var nameLabel = game.add.text(220 ,80,'NINJA QUEST',
									{font:'50px Arial',fill:'#ffffff'});
		var startLabel = game.add.text(250,game.world.height - 80,'or press the W key to start',
									{font:'25px Arial',fill:'#ffffff'});
		
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		wkey.onDown.addOnce(this.start,this);
		
		button = game.add.button(game.world.centerX - 95, game.world.centerY - 80, 'btn_play', this.actionOnClick, this);

		button.onInputOver.add(this.over, this);
		button.onInputOut.add(this.out, this);
		button.onInputUp.add(this.up, this);
		
		//button2 = game.add.button(game.world.centerX - 95, game.world.centerY + 40, 'btn_play', this.actionOnClick, this);
		
		
		this.game.state.states['menu'].lives = 3;
		this.game.state.states['menu'].score = 0;
		

	},
	start: function() {
		game.state.start('play');
	},
	up: function() {
    //console.log('button up', arguments);
	},

	over: function() {
		//console.log('button over');
	},

	out: function() {
		//console.log('button out');
	},

	actionOnClick: function() {

		//console.log('button click');
		this.start();

	}
}