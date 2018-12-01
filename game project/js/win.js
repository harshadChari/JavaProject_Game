var winState = {
	create: function() {
		var winLabel = game.add.text(80,80,'YOU DIED!',
									{font:'50px Arial',fill:'#00ff00'});
		var scoreLabel = game.add.text(80,150,'Score:' + this.game.state.states['menu'].score,
									{font:'50px Arial',fill:'#00ff00'});							
		var startLabel = game.add.text(80,game.world.height - 80,'press the W key to start',
									{font:'25px Arial',fill:'#ffffff'});
		
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		
		wkey.onDown.addOnce(this.restart,this);

	},
	restart: function() {
		game.state.start('menu');
	}
}