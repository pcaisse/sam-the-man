var Item = require('./item');
var Falls = require('../../mixins/falls');

function Block(data) {
    if (data.isDroppable && typeof data.isDroppable !== "boolean") {
        throw new TypeError('Block requires isDroppable to be a boolean if provided');
    }
    data.isCollidable = true;

    this.onWalkedOn = function(item) {
        this.walkingOnItem = item;
    };

    this.onWalkedOff = function() {
        this.walkingOnItem = null;
        if (this.isDroppable) {
            this.canFall = true;
        }
    };

    Falls.call(this);
    Item.call(this, data);
}

module.exports = Block;