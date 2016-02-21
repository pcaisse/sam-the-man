var Item = require('./item');

function Elevator(data) {
    data.isMovable = true;
    data.canWalk = false;
    data.canFall = false;
    Item.call(this, data);
}

module.exports = Elevator;