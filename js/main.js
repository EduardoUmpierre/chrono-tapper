var game = new Phaser.Game({
    type: Phaser.AUTO,
    antialias: false,
    width: 512,
    height: 339,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

/**
 * Preloads the assets
 **/
function preload() {
    this.load.image('background', 'img/background.png');
    this.load.multiatlas('chrono-tapper', 'img/chrono-tapper.json', 'img');
}

/**
 * Setup
 **/
function create() {
    // Background
    background = this.add.image(0, 0, 'background');
    background.displayOriginX = 0;
    background.displayOriginY = 0;

    // Status
    gameStatus = new GameStatus(this);

    // Enemy
    enemy = spawnNewEnemy(this);

    // Hero
    hero = new Hero(this);

    // Click
    this.input.on('pointerdown', function (pointer) {
        // Do the hero attack animation
        hero.attack();

        // Deals damage to enemy
        hit(this);
    }, this);
}

/**
 * Updates the content
 **/
function update() {
    enemy.updateHealthBar();
}

/**
 * Manage the hero hit
 **/
function hit(_this) {
    // Only deals the hit if the enemy is not dead
    if (!enemy.isDead) {
        isCriticalHit = false;
        damage = hero.damage;
        randomPositiveNumber = Phaser.Math.FloatBetween(0, 1);

        // Randomized critical hit
        if (randomPositiveNumber > (100 - hero.criticalChance) / 100) {
            isCriticalHit = true;
            damage *= 2;
        }

        // Creates the hit damage text
        createHitText(_this, damage, isCriticalHit, randomPositiveNumber);

        // Deals the damage to enemy
        enemy.hit(_this);
        enemy.health -= damage;

        console.info('Enemy HP: ' + enemy.health, ' Level: ' + gameStatus.getLevel());

        // If the enemy is out of health, destroys it
        if (enemy.health <= 0) {
            enemy.die(_this);

            // Spawns a new enemy after 1,5 seconds
            setTimeout(() => {
                enemy = spawnNewEnemy(_this);
            }, 1500);
        }
    }
}

/**
 * Spawns a new enemy with the new level status
 **/
function spawnNewEnemy(_this) {
    var enemyType = gameStatus.getLevel() % 5 == 0 ? 'boss' : 'minion';

    return new Enemy(_this, gameStatus.levelUp(), enemyType);
}

/**
 * Creates the hit damage text
 **/
function createHitText(_this, damage, isCriticalHit, randomPositiveNumber) {
    // Text configuration
    hitText = _this.add.text(hero.sprite.x + (Phaser.Math.FloatBetween(-1, 1) * 50), hero.sprite.y - 50 - (randomPositiveNumber * 50), damage, {
        color: isCriticalHit ? '#e3bf14' : '#b62e2e',
        fontSize: isCriticalHit ? '36px' : '26px',
        fontFamily: 'Courier, Consolas, serif',
        strokeThickness: 3,
        stroke: isCriticalHit ? '#885a0b' : '#320202'
    });

    // Z axis alignment
    hitText.setDepth(2);

    // Animation
    _this.tweens.add({
        targets: [hitText],
        alpha: { value: 0, duration: 1500, ease: 'Power1' },
        y: { value: hitText.y - (randomPositiveNumber * 50), duration: 1000, ease: 'Power1' },
        yoyo: false,
        loop: 0,
        onComplete: (e) => {
            e.targets[0].destroy();
        }
    });
}
