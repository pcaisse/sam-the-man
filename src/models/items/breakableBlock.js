var Item = require('./item');

function BreakableBlock(data) {
    Item.call(this, data);
    this.constructor = BreakableBlock;
}

BreakableBlock.prototype = Object.create(Item.prototype);

BreakableBlock.prototype.isCollidable = true;
BreakableBlock.prototype.isBreakable = true;

BreakableBlock.prototype.onWalkedOn = function(item) {
    this.walkingOnItem = item;
};

BreakableBlock.prototype.onWalkedOff = function() {
    this.walkingOnItem = null;
    this.isBroken = true;
    this.isCollidable = false;
};

BreakableBlock.prototype.onCollided = function() {
    this.isBroken = true;
    this.isCollidable = false;
};

module.exports = BreakableBlock;
