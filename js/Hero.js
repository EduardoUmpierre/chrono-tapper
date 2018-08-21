/**
 * Hero class
 **/
var Hero = function(_this) {
    // Hero stats
    this.criticalChance = 5;
    this.damage = 10;

    // World bounds
    var bounds = _this.physics.world.bounds;

    // Sprite
    this.sprite = _this.physics.add.sprite(bounds.centerX, 270, 'chrono-tapper', 'hero-attack-00.png');
    this.sprite.depth = 3;

    // Animations
    var attackAnimationFrames = _this.anims.generateFrameNames('chrono-tapper', {
        start: 0, end: 2, zeroPad: 2, prefix: 'hero-attack-', suffix: '.png'
    });

    _this.anims.create({ key: 'hero-attack', frames: attackAnimationFrames, frameRate: 6, repeat: 0, yoyo: true });
}

/**
 * Attack function - plays the attack animation
 **/
Hero.prototype.attack = function() {
    this.sprite.anims.play('hero-attack', true);
}
