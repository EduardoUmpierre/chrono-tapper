/**
 * GameStatus class
 **/
var GameStatus = function (_this) {
    this.level = 1;
}

/**
 * Levels up and increase the enemy's life
 **/
GameStatus.prototype.levelUp = function () {
    this.level++;

    return parseInt((this.level * 100) * (this.level * 0.10));
}

/**
 * Returns the current level
 */
GameStatus.prototype.getLevel = function () {
    return this.level;
}