var winState = {
	create: function() {
		var winLabel = game.add.text(150,80,'YOU DIED!',
									{font:'100px Arial',fill:'#ffffff'});
		var scoreLabel = game.add.text(280,220,'Score:' + this.game.state.states['menu'].score,
									{font:'50px Arial',fill:'#ffffff'});							
		var startLabel = game.add.text(250,game.world.height - 80,'press the W key to restart',
									{font:'25px Arial',fill:'#ffffff'});
		
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		wkey.onDown.addOnce(this.restart,this);
		
		button = game.add.button(320, 350, 'button_restart', this.actionOnClick, this);


	},
	restart: function() {
		game.state.start('menu');
	},
	actionOnClick: function() {

		//console.log('button click');
		this.restart();

	}
}