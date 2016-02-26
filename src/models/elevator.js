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
        if (this.enteredItem) {
            this.enteredItem.top = this.top;
        }
    }

    this.onEnter = function(enteredItem) {
        this.enteredItem = enteredItem;
        this.isStopped = false;
    }

    Item.call(this, data);
}

module.exports = Elevator;