var Item = require('./item');

function Block(data) {
    data.isMovable = false;
    Item.call(this, data);
}

module.exports = Block;