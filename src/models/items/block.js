var Item = require('./item');
var Falls = require('../../mixins/falls');

function Block(data) {
    if (data.isDroppable && typeof data.isDroppable !== "boolean") {
        throw new TypeError('Block requires isDroppable to be a boolean if provided');
    }
    Item.call(this, data);
    this.constructor = Block;
}

Block.prototype = Object.create(Item.prototype);

Block.prototype.fall = Falls.prototype.fall;

Block.prototype.isCollidable = true;

Block.prototype.onWalkedOn = function(item) {
    this.walkingOnItem = item;
};

Block.prototype.onWalkedOff = function() {
    this.walkingOnItem = null;
    if (this.isDroppable) {
        this.canFall = true;
    }
};

module.exports = Block;
