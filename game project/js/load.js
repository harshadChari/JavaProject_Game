var loadState = {
	preload: function(){
		var loadingLabel = game.add.text(80,150,'loading...',
										{font:'30px Courier',fill:'#ffffff'});		
		
		game.load.image('btn_play', 'assets/button_play.png');
		game.load.image('button_restart', 'assets/button_restart.png');
		
		game.load.image('ground', 'assets/platform-desert.png');
		game.load.image('crate', 'assets/crate.png');
		game.load.image('stone', 'assets/stone.png');
		
		game.load.image('win', 'assets/win.png');
		
		game.load.image('diamond_blue', 'assets/diamond-flat-blue.png');
		game.load.image('diamond_yellow', 'assets/diamond-flat-yellow.png');
		game.load.image('sky', 'assets/BG.png');
		game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.spritesheet('effects', 'assets/smoke.png', 512, 512);
		
		game.load.image('bullet', 'assets/Kunai.png');
		
		game.load.spritesheet('n-player', 'assets/ninja_triple.png', 366, 440);
		
		//---------audio
		if(this.game.state.states['boot'].audioEnable)
		{
			game.load.audio('music', 'assets/sd-ingame1.wav');
			game.load.audio('explode', 'assets/explosion.mp3');
			game.load.audio('sword_clink', 'assets/sword.mp3');
		}
   		
	},
	
	create: function(){
		
		game.state.start('menu');
	}
	
}