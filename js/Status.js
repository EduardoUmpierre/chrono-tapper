/**
 * GameStatus class
 **/
var GameStatus = function (_this) {
    this.level = 1;
    this.coins = 0;
}

/**
 * Levels up and increase the enemy's life
 **/
GameStatus.prototype.levelUp = function (_this, type, hud) {
    if (this.level != 1) {
        this.coins += this.level * (type == 'minion' ? 5 : 15);
    }

    this.level++;

    return parseInt(25 * ((this.level - 1) * 0.1));
}

/**
 * Returns the current level
 */
GameStatus.prototype.getLevel = function () {
    return this.level;
}

/**
 * Return the current coin amount
 */
GameStatus.prototype.getCoins = function() {
    return this.coins;
}