var Item = require('./item');
var Falls = require('../../mixins/falls');
var MAP = require('../../constants/map');

function Man(data) {
    if (typeof data.isFacingRight !== "boolean") {
        throw new TypeError('Man requires a boolean isFacingRight property');
    }
    Item.call(this, data);
    this.constructor = Man;
}

Man.prototype = Object.create(Item.prototype);
Man.prototype.fall = Falls.prototype.fall;

Man.prototype.canWalk = true;
Man.prototype.canFall = true;
Man.prototype.canCompleteGoal = true;
Man.prototype.isCollidable = true;

Man.prototype.walk = function() {
    if (!this.canWalk) {
        throw new Error('Item cannot walk.');
    }
    this.move(MAP.MOVEMENTS.WALK);
    return this;
};

Man.prototype.turn = function() {
    this.isFacingRight = !this.isFacingRight;
    return this;
};

Man.prototype.onEnter = function() {
    this.isWaiting = true;
};

Man.prototype.onStop = function() {
    this.isWaiting = false;
};

module.exports = Man;