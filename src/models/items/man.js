var Item = require('./item');
var Falls = require('../../mixins/falls');
var MAP = require('../../constants/map');

function Man(data) {
    if (typeof data.isFacingRight !== "boolean") {
        throw new TypeError('Man requires a boolean isFacingRight property');
    }
    data.canWalk = true;
    data.canFall = true;
    data.canCompleteGoal = true;
    data.isCollidable = true;

    this.walk = function() {
        if (!this.canWalk) {
            throw new Error('Item cannot walk.');
        }
        if (this.isFacingRight) {
            this.left += MAP.walkIncrement;
        } else {
            this.left -= MAP.walkIncrement;
        }
        return this;
    };

    this.turn = function() {
        this.isFacingRight = !this.isFacingRight;
        return this;
    };

    this.onEnter = function() {
        this.isWaiting = true;
    };

    this.onStop = function() {
        this.isWaiting = false;
    };

    Falls.call(this);
    Item.call(this, data);
}

module.exports = Man;