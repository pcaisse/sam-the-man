var Item = require('./item');
var Falls = require('../../mixins/falls');

function DroppableBlock(data) {
    Item.call(this, data);
    this.constructor = DroppableBlock;
}

DroppableBlock.prototype = Object.create(Item.prototype);

DroppableBlock.prototype.fall = Falls.prototype.fall;

DroppableBlock.prototype.isCollidable = true;
DroppableBlock.prototype.isDroppable = true;

DroppableBlock.prototype.onWalkedOn = function(item) {
    this.walkingOnItem = item;
};

DroppableBlock.prototype.onWalkedOff = function() {
    this.walkingOnItem = null;
    this.canFall = true;
};

module.exports = DroppableBlock;
