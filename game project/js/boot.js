var bootState = {
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
		game.stage.backgroundColor = "#4488AA";
		this.game.state.states['boot'].audioEnable = false;
	}
};