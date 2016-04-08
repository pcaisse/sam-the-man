var Item = require('./item');
var MAP = require('../../constants/map');

function Elevator(data) {
    if (typeof data.isGoingDown !== "boolean") {
        throw new TypeError('Elevator requires a boolean isGoingDown property');
    }
    if (typeof data.isStopped !== "boolean") {
        throw new TypeError('Elevator requires a boolean isStopped property');
    }
    Item.call(this, data);
    this.constructor = Elevator;
}

Elevator.prototype = Object.create(Item.prototype);
Elevator.prototype.isEnterable = true;
Elevator.prototype.canMoveVertically = true;
Elevator.prototype.enteredItem = null;

Elevator.prototype.isEntered = function() {
    return !!this.enteredItem;
};

Elevator.prototype.moveVertically = function(isTest) {
    if (!this.canMoveVertically) {
        throw new Error('Item cannot move vertically.');
    }
    this.move(MAP.MOVEMENTS.MOVE_VERTICALLY);
    if (!isTest && this.enteredItem) {
        this.enteredItem.move(MAP.MOVEMENTS.MOVE_VERTICALLY);
    }
    return this;
};

Elevator.prototype.onEntered = function(enteredItem) {
    enteredItem.onEnter();
    this.enteredItem = enteredItem;
    this.isStopped = false;
};

Elevator.prototype.stop = function() {
    this.enteredItem.onStop();
    this.isStopped = true;
    this.isUnloading = true;
    return this;
};

Elevator.prototype.onExited = function() {
    this.isUnloading = false;
    this.enteredItem = null;
    this.isGoingDown = !this.isGoingDown;
};

module.exports = Elevator;
