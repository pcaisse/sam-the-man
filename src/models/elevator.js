var Item = require('./item');
var VERTICAL_MOVE_INCREMENT = 1;

function Elevator(data) {
    if (typeof data.isMovingDown !== "boolean") {
        throw new TypeError('Man requires a boolean isFacingRight property');
    }
    data.isMovable = true;
    data.isEnterable = true;
    data.canMoveVertically = true;
    data.enteredItem = null;

    this.moveVertically = function() {
        if (!this.isMovable || !this.canMoveVertically) {
            throw new Error('Item cannot move vertically.');
        }
        if (this.isMovingDown) {
            this.top += VERTICAL_MOVE_INCREMENT;
        } else {
            this.top -= VERTICAL_MOVE_INCREMENT;
        }
        if (this instanceof Elevator && this.enteredItem) { // type check is a hack to avoid changing enetered item
                                                            // when cloning the object (clone is not of Elevator type)
            this.enteredItem.top = this.top;
        }
    }

    this.onEntered = function(enteredItem) {
        enteredItem.onEnter();
        this.enteredItem = enteredItem;
        this.isStopped = false;
    }

    this.stop = function() {
        this.enteredItem.onStop();
        this.isStopped = true;
        this.isUnloading = true;
    }

    this.onExited = function() {
        this.isUnloading = false;
        this.enteredItem = null;
        this.isMovingDown = !this.isMovingDown;
    }

    Item.call(this, data);
}

module.exports = Elevator;