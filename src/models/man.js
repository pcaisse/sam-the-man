var Item = require('./item');

function Man(data) {
    if (typeof data.isFacingRight !== "boolean") {
        throw new TypeError('Man requires a boolean isFacingRight property');
    }
    data.isMovable = true;
    data.canWalk = true;
    data.canFall = true;
    Item.call(this, data);
}

module.exports = Man;