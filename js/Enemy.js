/**
 * Enemy class
 **/
var Enemy = function (_this, gameStatus) {
    // Is dead flag
    this.isDead = false;

    // Enemy type
    this.type = gameStatus.getLevel() % 5 == 0 ? 'boss' : 'minion';

    // Health information
    health = gameStatus.levelUp(this.type);

    this.health = health;
    this.maxHealth = health;

    // Get the world bounds
    var bounds = _this.physics.world.bounds;

    // Set the enemies config
    this.enemies = this.setEnemies();

    // Creates the sprite
    this.sprite = this.setUpNewEnemy(_this, bounds);
    console.log(this.sprite);
    this.sprite.body.setAllowGravity(false);
    this.sprite.depth = 1;
    this.sprite.setAlpha(0);

    _this.tweens.add({
        targets: this.sprite,
        alpha: { value: 1, duration: 300, ease: 'Power1' },
        yoyo: false,
        loop: 0
    });

    // Animations
    this.setUpAnimations(_this, bounds);

    // Creates the health bar
    this.healthBar = _this.add.text(0, 0, this.health + '/' + this.maxHealth, {
        color: '#b62e2e',
        fontSize: '20px',
        fontFamily: 'Courier, Consolas, serif',
        strokeThickness: 2,
        stroke: '#320202',
        align: 'center'
    });

    // Aligns the health bar text
    this.healthBar.setPosition(bounds.centerX + this.enemies[this.type].offsetX, this.sprite.y - ((this.sprite.height * this.enemies[this.type].scale) / 2));
    this.healthBar.setOrigin(0.5, 0.5);

    // Set z alignment
    this.healthBar.setDepth(1);

    this.coinGroup = _this.physics.add.group({
        bounceX: 0.35,
        bounceY: 0.5,
        collideWorldBounds: true
    });
}

/**
 * Updates the health bar with the current health
 **/
Enemy.prototype.updateHealthBar = function () {
    this.healthBar.setText((this.health < 0 ? 0 : this.health) + '/' + this.maxHealth);
}

/**
 * Kills the enemy - plays the dead animation
 **/
Enemy.prototype.die = function (_this) {
    this.isDead = true;

    // Creates the coins group
    this.coinGroup.createMultiple({
        key: 'chrono-tapper',
        frame: 'gold-coin-00.png',
        frameQuantity: this.type == 'minion' ? 5 : 15
    });

    this.coinGroup.getChildren().forEach((e) => {
        e.setVelocityX(Phaser.Math.FloatBetween(-1, 1) * 100);
        e.body.setDrag(100, 5);
    });

    // Align the coins
    Phaser.Actions.PlaceOnLine(this.coinGroup.getChildren(), new Phaser.Geom.Line(this.sprite.x - 20, this.sprite.y - 10, this.sprite.x + 20, this.sprite.y + 10));

    // Do the coins fade out animation
    _this.tweens.add({
        targets: this.coinGroup.getChildren(),
        alpha: { value: 0, duration: 2000, ease: 'Power1' },
        yoyo: false,
        loop: 0,
        onComplete: () => {
            this.coinGroup.clear(true, true);
        }
    });

    // Fade out the health bar
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
Enemy.prototype.hit = function (_this) {
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

/**
 * 
 * @param {object} _this
 * @param {object} bounds
 */
Enemy.prototype.setUpNewEnemy = function (_this, bounds) {
    if (this.type === 'boss') {
        this.health = this.maxHealth *= 5;
    }

    return _this.physics.add.sprite(bounds.centerX + 5, bounds.centerY + 5, 'chrono-tapper', this.enemies[this.type].key + '-00.png');
}

/**
 * 
 * @param {object} _this
 * @param {object} bounds
 * @param {string} type 
 */
Enemy.prototype.setUpAnimations = function (_this, bounds) {
    var enemy = this.enemies[this.type];

    // Only creates the animation if it doesn't exists
    if (!_this.anims.get(enemy.key)) {
        var animationFrames = _this.anims.generateFrameNames('chrono-tapper', {
            start: enemy.start, end: enemy.end, zeroPad: 2, prefix: enemy.key + '-', suffix: '.png'
        });

        _this.anims.create({
            key: enemy.key, frames: animationFrames, frameRate: enemy.frameRate, repeat: enemy.repeat, yoyo: enemy.yoyo,
            delay: enemy.delay, repeatDelay: enemy.repeatDelay
        });
    }

    // Scale
    this.sprite.setScale(this.enemies[this.type].scale);

    // Position
    this.sprite.setPosition(bounds.centerX + this.enemies[this.type].offsetX, bounds.centerY + this.enemies[this.type].offsetY)

    // Play the animation
    this.sprite.anims.play(this.enemies[this.type].key, true);
}

/**
 * 
 */
Enemy.prototype.setEnemies = function () {
    return {
        boss: {
            start: 0, end: 9, key: 'sorcerer-attack', frameRate: 6, repeat: -1, yoyo: true, delay: 1000, repeatDelay: 3000,
            scale: 1, offsetX: 8, offsetY: 0
        },
        minion: {
            start: 0, end: 2, key: 'minion-idle', frameRate: 1, repeat: -1, yoyo: true, delay: 1000, repeatDelay: 0,
            scale: 1.25, offsetX: 0, offsetY: 25
        }
    };
}

Enemy.prototype.getCoinGroup = function () {
    return this.coinGroup;
}