var Item = require('./item');
var MAP = require('../../constants/map');

function Elevator(data) {
    if (typeof data.isGoingDown !== "boolean") {
        throw new TypeError('Elevator requires a boolean isGoingDown property');
    }
    if (typeof data.isStopped !== "boolean") {
        throw new TypeError('Elevator requires a boolean isStopped property');
    }
    data.isEnterable = true;
    data.canMoveVertically = true;
    data.enteredItem = null;

    this.isEntered = function() {
        return !!this.enteredItem;
    };

    this.moveVertically = function(isTest) {
        if (!this.canMoveVertically) {
            throw new Error('Item cannot move vertically.');
        }
        this.move(MAP.MOVEMENTS.MOVE_VERTICALLY);
        if (!isTest && this.enteredItem) {
            this.enteredItem.move(MAP.MOVEMENTS.MOVE_VERTICALLY);
        }
        return this;
    };

    this.onEntered = function(enteredItem) {
        enteredItem.onEnter();
        this.enteredItem = enteredItem;
        this.isStopped = false;
    };

    this.stop = function() {
        this.enteredItem.onStop();
        this.isStopped = true;
        this.isUnloading = true;
        return this;
    };

    this.onExited = function() {
        this.isUnloading = false;
        this.enteredItem = null;
        this.isGoingDown = !this.isGoingDown;
    };

    Item.call(this, data);
}

module.exports = Elevator;