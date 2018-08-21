/**
 * Enemy class
 **/
var Enemy = function(_this, health) {
    // Is dead flag
    this.isDead = false;

    // Health information
    this.health = health;
    this.maxHealth = health;

    // Get the world bounds
    var bounds = _this.physics.world.bounds;

    // Creates the sprite
    this.sprite = _this.physics.add.sprite(bounds.centerX + 5, bounds.centerY + 5, 'chrono-tapper', 'sorcerer-attack-00.png');
    this.sprite.depth = 1;

    // Animations
    var attackAnimationFrames = _this.anims.generateFrameNames('chrono-tapper', {
        start: 0, end: 9, zeroPad: 2, prefix: 'sorcerer-attack-', suffix: '.png'
    });

    _this.anims.create({ key: 'sorcerer-attack', frames: attackAnimationFrames, frameRate: 6, repeat: -1, yoyo: true, delay: 1000, repeatDelay: 3000 });
    this.sprite.anims.play('sorcerer-attack', true);

    // Creates the health bar
    this.healthBar = _this.add.text(0, 0, this.health + '/' + this.maxHealth, {
        color: '#b62e2e',
        fontSize: '20px',
        fontFamily: 'Courier, Consolas, serif',
        strokeThickness: 3,
        stroke: '#320202',
        align: 'center'
    });

    // Aligns the health bar text
    this.healthBar.setPosition((bounds.width / 2) - (this.healthBar.x / 2), 60);
    this.healthBar.setOrigin(0.5, 0.5);

    // Set z alignment
    this.healthBar.setDepth(1);
}

/**
 * Updates the health bar with the current health
 **/
Enemy.prototype.updateHealthBar = function() {
    this.healthBar.setText((this.health < 0 ? 0 : this.health) + '/' + this.maxHealth);
}

/**
 * Kills the enemy - plays the dead animation
 **/
Enemy.prototype.die = function(_this) {
    this.isDead = true;

    _this.tweens.add({
        targets: [this.sprite, this.healthBar],
        alpha: { value: 0, duration: 400, ease: 'Power1' },
        yoyo: false,
        loop: 0,
        onComplete: (e) => {
            e.targets[0].visible = false;
            e.targets[0].destroy();
            e.targets[1].visible = false;
            e.targets[1].destroy();
        }
    });
}

/**
 * Enemy hit effect - plays the hit animation
 **/
Enemy.prototype.hit = function(_this) {
    _this.tweens.add({
        targets: [this.sprite],
        alpha: { value: 1, duration: 100, ease: 'Power1' },
        alpha: { value: 0.1, duration: 100, ease: 'Power1' },
        yoyo: true,
        loop: 0,
        onComplete: (e) => {
            e.targets[0].alpha = 1;
        }
    });
}
