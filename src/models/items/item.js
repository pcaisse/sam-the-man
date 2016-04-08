var MAP = require('../../constants/map');
var mapUtils = require('../../utils/map');

function Item(data) {
    [data.top, data.left].forEach(function(arg) {
        if (typeof arg !== "number") {
            throw new TypeError('Item must have top and left of type number.');
        }
    });
    this.width = 1;
    this.height = 1;
    this.topFraction = 0;
    this.leftFraction = 0;
    this._data = data;
    this._lastMove = null;
    Object.assign(this, data);

    this.move = function(movement) {
        var adjustLeft = false;
        var adjustTop = false;
        var movementValues = {};
        // Save to be able to undo changes
        this._lastMove = {
            top: this.top,
            topFraction: this.topFraction,
            left: this.left,
            leftFraction: this.leftFraction
        };
        // Adjust position fraction
        if (movement === MAP.MOVEMENTS.FALL) {
            movementValues.topFraction = this.topFraction + MAP.MOVEMENTS_PER_FALL;
            adjustTop = true;
        } else if (movement === MAP.MOVEMENTS.WALK) {
            if (this.isFacingRight) {
                movementValues.leftFraction = this.leftFraction + MAP.MOVEMENTS_PER_WALK;
            } else {
                movementValues.leftFraction = this.leftFraction - MAP.MOVEMENTS_PER_WALK;
            }
            adjustLeft = true;
        } else if (movement === MAP.MOVEMENTS.MOVE_VERTICALLY) {
            if (this.isGoingDown) {
                movementValues.topFraction = this.topFraction + MAP.MOVEMENTS_PER_VERTICAL_MOVEMENT;
            } else {
                movementValues.topFraction = this.topFraction - MAP.MOVEMENTS_PER_VERTICAL_MOVEMENT;
            }
            adjustTop = true;
        }
        // Change position as needed based on fraction
        if (adjustTop) {
            if (this.topFraction > 0 && this.topFraction % MAP.MOVEMENTS_PER_CELL === 0) {
                movementValues.top = this.top + 1;
                movementValues.topFraction = 0;
            }
            if (this.topFraction < 0) {
                movementValues.top = this.top - 1;
                movementValues.topFraction = this.topFraction + MAP.MOVEMENTS_PER_CELL;
            }
        }
        if (adjustLeft) {
            if (this.leftFraction > 0 && this.leftFraction % MAP.MOVEMENTS_PER_CELL === 0) {
                movementValues.left = this.left + 1;
                movementValues.leftFraction = 0;
            }
            if (this.leftFraction < 0) {
                movementValues.left = this.left - 1;
                movementValues.leftFraction = this.leftFraction + MAP.MOVEMENTS_PER_CELL;
            }
        }
        // Apply new movement values
        this.applyMovements(movementValues);
    };

    this.unmove = function() {
        this.applyMovements(this._lastMove);
    };

    this.applyMovements = function(movementValues) {
        for (var prop in movementValues) {
            this[prop] = movementValues[prop];
        }
    };

    this.fractionLeft = function() {
        return mapUtils.asFraction(this.left) + this.leftFraction;
    };

    this.fractionTop = function() {
        return mapUtils.asFraction(this.top) + this.topFraction;
    };

    this.fractionWidth = function() {
        return mapUtils.asFraction(this.width);
    };

    this.fractionHeight = function() {
        return mapUtils.asFraction(this.height);
    };

    this.decimalLeft = function() {
        return this.fractionLeft() / MAP.MOVEMENTS_PER_CELL;
    };

    this.decimalTop = function() {
        return this.fractionTop() / MAP.MOVEMENTS_PER_CELL;
    };

    this.collidesWith = function(item) {
        return this.fractionLeft() < item.fractionLeft() + item.fractionWidth() &&
            this.fractionLeft() + this.fractionWidth() > item.fractionLeft() &&
            this.fractionTop() < item.fractionTop() + item.fractionHeight() &&
            this.fractionHeight() + this.fractionTop() > item.fractionTop();
    };

    this.hasSamePosition = function(item) {
        return this.decimalTop() === item.decimalTop() && this.decimalLeft() === item.decimalLeft();
    };

    this.isSameAs = function(item) {
        return this.id === item.id;
    };
}

module.exports = Item;