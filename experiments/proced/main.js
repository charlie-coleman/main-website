var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {preload: preload, create:create, update: update, render: render});
function preload() {
    game.load.image('spaceship','img/spaceship.png');
}
var sprite;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#0072bc";
    sprite = game.add.sprite(340,580,'spaceship');
    sprite.anchor.setTo(0.5,0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.allowRotation = true;
    
}
function update() {
    sprite.rotation = game.physics.arcade.moveToPointer(sprite, 100, game.input.activePointer, 500);
}
function render() {
}