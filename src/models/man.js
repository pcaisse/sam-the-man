var Item = require('./item');
var FALL_INCREMENT = 5;
var WALK_INCREMENT = 2;

function Man(data) {
    if (typeof data.isFacingRight !== "boolean") {
        throw new TypeError('Man requires a boolean isFacingRight property');
    }
    data.isMovable = true;
    data.canWalk = true;
    data.canFall = true;

    this.fall = function() {
        if (!this.isMovable || !this.canFall) {
            throw new Error('Item cannot fall.');
        }
        this.top += FALL_INCREMENT;
    }

    this.walk = function() {
        if (!this.isMovable || !this.canWalk) {
            throw new Error('Item cannot walk.');
        }
        if (this.isFacingRight) {
            this.left += WALK_INCREMENT;
        } else {
            this.left -= WALK_INCREMENT;
        }
    }

    this.turn = function() {
        if (this.isFacingRight) {
            this.isFacingRight = false;
        } else {
            this.isFacingRight = true;
        }
    }

    this.onEnter = function() {
        this.isWaiting = true;
    }

    this.onStop = function() {
        this.isWaiting = false;
    }

    Item.call(this, data);
}

module.exports = Man;