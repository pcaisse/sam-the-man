var Item = require('./item');

function Block(data) {
    data.isMovable = false;
    data.canWalk = false;
    data.canFall = false;
    Item.call(this, data);
}

module.exports = Block;