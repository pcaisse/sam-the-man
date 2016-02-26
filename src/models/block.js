var Item = require('./item');

function Block(data) {
    data.isCollidable = true;
    Item.call(this, data);
}

module.exports = Block;