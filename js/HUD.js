var HUD = function (_this, gameStatus) {
    // Animations
    var coinAnimationFrames = _this.anims.generateFrameNames('chrono-tapper', {
        start: 0, end: 8, zeroPad: 2, prefix: 'gold-coin-', suffix: '.png'
    });

    _this.anims.create({ key: 'gold-coin', frames: coinAnimationFrames, frameRate: 6, repeat: -1 });

    this.coinBalance = this.createCoinBalance(_this);
}

/**
 * 
 * @param {*} _this 
 */
HUD.prototype.createCoinBalance = function (_this) {
    var coin = _this.physics.add.sprite(30, 30, 'chrono-tapper', 'gold-coin-00.png')
    coin.body.setAllowGravity(false);
    coin.anims.play('gold-coin', true);

    // Bitmap text
    // return _this.add.bitmapText(coin.x + coin.width / 2, coin.y - 7, 'small-yellow', '', 12);

    return _this.add.text(coin.x + coin.width / 2, coin.y - 10, 0, {
        color: '#dad40f',
        fontSize: '20px',
        fontFamily: 'Courier, Consolas, serif',
        strokeThickness: 2,
        stroke: '#868307',
        align: 'left'
    });
}

/**
 * 
 * @param {*} coins 
 */
HUD.prototype.updateCoinBalance = function (coins) {
    this.coinBalance.setText(coins);
}