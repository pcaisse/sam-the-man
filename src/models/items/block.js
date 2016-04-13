var Item = require('./item');

function Block(data) {
    Item.call(this, data);
    this.constructor = Block;
}

Block.prototype = Object.create(Item.prototype);

Block.prototype.isCollidable = true;

module.exports = Block;
