var Item = require('./item');
var MAP = require('../constants/map');

function Elevator(data) {
    if (typeof data.isMovingDown !== "boolean") {
        throw new TypeError('Elevator requires a boolean isMovingDown property');
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

    this.moveVertically = function() {
        if (!this.canMoveVertically) {
            throw new Error('Item cannot move vertically.');
        }
        if (this.isMovingDown) {
            this.top += MAP.verticalMoveIncrement;
        } else {
            this.top -= MAP.verticalMoveIncrement;
        }
        if (this instanceof Elevator && this.enteredItem) { // type check is a hack to avoid changing enetered item
                                                            // when cloning the object (clone is not of Elevator type)
            this.enteredItem.top = this.top;
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
        this.isMovingDown = !this.isMovingDown;
    };

    Item.call(this, data);
}

module.exports = Elevator;