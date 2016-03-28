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
    Object.assign(this, data);

    this.move = function(movement) {
        var adjustLeft = false;
        var adjustTop = false;
        // Adjust position fraction
        if (movement === MAP.MOVEMENTS.FALL) {
            this.topFraction += MAP.FALLS_PER_CELL;
            adjustTop = true;
        } else if (movement === MAP.MOVEMENTS.WALK) {
            if (this.isFacingRight) {
                this.leftFraction += MAP.WALKS_PER_CELL;
            } else {
                this.leftFraction -= MAP.WALKS_PER_CELL;
            }
            adjustLeft = true;
        } else if (movement === MAP.MOVEMENTS.MOVE_VERTICALLY) {
            if (this.isMovingDown) {
                this.topFraction += MAP.VERTICAL_MOVEMENTS_PER_CELL;
            } else {
                this.topFraction -= MAP.VERTICAL_MOVEMENTS_PER_CELL;
            }
            adjustTop = true;
        }
        // Change position as needed based on fraction
        if (adjustTop) {
            if (this.topFraction > 0 && this.topFraction % MAP.MOVEMENTS_PER_CELL === 0) {
                this.top += 1;
                this.topFraction = 0;
            }
            if (this.topFraction < 0) {
                this.top -= 1;
                this.topFraction += MAP.MOVEMENTS_PER_CELL;
            }
        }
        if (adjustLeft) {
            if (this.leftFraction > 0 && this.leftFraction % MAP.MOVEMENTS_PER_CELL === 0) {
                this.left += 1;
                this.leftFraction = 0;
            }
            if (this.leftFraction < 0) {
                this.left -= 1;
                this.leftFraction += MAP.MOVEMENTS_PER_CELL;
            }
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