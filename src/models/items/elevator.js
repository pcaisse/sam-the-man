var Item = require('./item');
var MAP = require('../../constants/map');

function Elevator(data) {
    Item.call(this, data);
    this.constructor = Elevator;
}

Elevator.prototype = Object.create(Item.prototype);
Elevator.prototype.isEnterable = true;
Elevator.prototype.isStopped = true;
Elevator.prototype.isGoingDown = false;
Elevator.prototype.canMoveVertically = true;
Elevator.prototype.enteredItem = null;

Elevator.prototype.isEntered = function() {
    return !!this.enteredItem;
};

Elevator.prototype.moveVertically = function(isTest) {
    if (!this.canMoveVertically) {
        throw new Error('Item cannot move vertically.');
    }
    var movement = this.isGoingDown ? MAP.MOVEMENTS.MOVE_DOWN : MAP.MOVEMENTS.MOVE_UP;
    this.move(movement);
    if (!isTest && this.enteredItem) {
        this.enteredItem.move(movement);
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
