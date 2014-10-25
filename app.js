var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { 
  preload: function() {
    game.load.image       ( 'sky'    , 'assets/sky.png'      ) ;
    game.load.image       ( 'ground' , 'assets/platform.png' ) ;
    game.load.image       ( 'star'   , 'assets/star.png'     ) ;
    game.load.spritesheet ( 'dude'   , 'assets/dude.png'     , 32 , 48 ) ;
  }
  , create: create
  , update: update 
});

var platforms;
var player;
var playerDimensions = {width: 48, height: 32};
var keys;
var configs = { jumpVelocity : 500 , horizontalMovement : 150 }
var emitters =  {};
var collisionHandlers =  {
  playerVworld: function(player, ground) {

    if ( player.body.velocity.y > -2 && player.body.velocity.y < +2 ) {
      return;
    }

    emitters.star.x = player.x + playerDimensions.width / 2;
    emitters.star.y = player.y + playerDimensions.height;
    emitters.star.removeAll(false, true);
    emitters.star.start(true, 2000, null, 10);
  }
};

function create() {
  keys = game.input.keyboard.createCursorKeys();

  game.add.sprite(0, 0, 'sky');
  game.add.sprite(0, 0, 'star');
  player = game.add.sprite(0, 0, 'dude');
  player.animations.add( 'left', [0, 1, 2, 3], 10, true);
  player.animations.add( 'right', [5, 6, 7, 8], 10, true);


  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 350;
  player.body.collideWorldBounds = true;

  platforms = game.add.group();
  platforms.enableBody = true;

  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2,2);
  ground.body.immovable = true;

  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;

  emitters.star = game.add.emitter(0, 0, 5);
  emitters.star.makeParticles('star');
  emitters.gravity = 200;

}

function update() {
  game.physics.arcade.collide(player, platforms, collisionHandlers.playerVworld);

  updatePlayer(player, keys);
}

function updatePlayer(player, keys) {
  updatePlayerVertical(player, keys);
  updatePlayerHorizontal(player, keys);
}

function updatePlayerVertical(player, keys) {
  if ( player.body.touching.down && keys.up.isDown) {
    player.body.velocity.y = - configs.jumpVelocity;
  }
}

function updatePlayerHorizontal(player, keys) {
  if (keys.left.isDown) {
    player.body.velocity.x = - configs.horizontalMovement;
    player.animations.play('left');
    return;
  }

  if (keys.right.isDown) {
    player.body.velocity.x = + configs.horizontalMovement;
    player.animations.play('right');
    return;
  }

  // == else == {
  player.body.velocity.x = 0;
  player.animations.stop();
  player.frame = 4;
  return;
  // }
}

