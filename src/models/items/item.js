var MAP = require('../../constants/map');
var mapUtils = require('../../utils/map');

function Item(data) {
    [data.top, data.left].forEach(function(arg) {
        if (typeof arg !== "number") {
            throw new TypeError('Item must have top and left of type number.');
        }
    });
    this._data = data;
    Object.assign(this, data);
}

Item.prototype.width = 1;
Item.prototype.height = 1;
Item.prototype.topFraction = 0;
Item.prototype.leftFraction = 0;
Item.prototype._lastMove = null;

Item.prototype.edit = function(values) {
    Object.keys(values).forEach(function(prop) {
        this[prop] = values[prop];
    }.bind(this));
    return this;
};

Item.prototype.move = function(movement) {
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
    } else if (movement === MAP.MOVEMENTS.WALK) {
        if (this.isFacingRight) {
            movementValues.leftFraction = this.leftFraction + MAP.MOVEMENTS_PER_WALK;
        } else {
            movementValues.leftFraction = this.leftFraction - MAP.MOVEMENTS_PER_WALK;
        }
    } else if (movement === MAP.MOVEMENTS.MOVE_DOWN) {
        movementValues.topFraction = this.topFraction + MAP.MOVEMENTS_PER_VERTICAL_MOVEMENT;
    } else if (movement === MAP.MOVEMENTS.MOVE_UP) {
        movementValues.topFraction = this.topFraction - MAP.MOVEMENTS_PER_VERTICAL_MOVEMENT;
    }
    // Change position as needed based on fraction
    if (movementValues.topFraction > 0 && movementValues.topFraction % MAP.MOVEMENTS_PER_CELL === 0) {
        movementValues.top = this.top + 1;
        movementValues.topFraction = 0;
    }
    if (movementValues.topFraction < 0) {
        movementValues.top = this.top - 1;
        movementValues.topFraction = movementValues.topFraction + MAP.MOVEMENTS_PER_CELL;
    }
    if (movementValues.leftFraction > 0 && movementValues.leftFraction % MAP.MOVEMENTS_PER_CELL === 0) {
        movementValues.left = this.left + 1;
        movementValues.leftFraction = 0;
    }
    if (movementValues.leftFraction < 0) {
        movementValues.left = this.left - 1;
        movementValues.leftFraction = movementValues.leftFraction + MAP.MOVEMENTS_PER_CELL;
    }
    // Apply new movement values
    this.applyMovements(movementValues);
};

Item.prototype.unmove = function() {
    this.applyMovements(this._lastMove);
};

Item.prototype.applyMovements = function(movementValues) {
    for (var prop in movementValues) {
        this[prop] = movementValues[prop];
    }
};

Item.prototype.fractionLeft = function() {
    return mapUtils.asFraction(this.left) + this.leftFraction;
};

Item.prototype.fractionTop = function() {
    return mapUtils.asFraction(this.top) + this.topFraction;
};

Item.prototype.fractionWidth = function() {
    return mapUtils.asFraction(this.width);
};

Item.prototype.fractionHeight = function() {
    return mapUtils.asFraction(this.height);
};

Item.prototype.decimalLeft = function() {
    return this.fractionLeft() / MAP.MOVEMENTS_PER_CELL;
};

Item.prototype.decimalTop = function() {
    return this.fractionTop() / MAP.MOVEMENTS_PER_CELL;
};

Item.prototype.collidesWith = function(item) {
    return this.fractionLeft() < item.fractionLeft() + item.fractionWidth() &&
        this.fractionLeft() + this.fractionWidth() > item.fractionLeft() &&
        this.fractionTop() < item.fractionTop() + item.fractionHeight() &&
        this.fractionHeight() + this.fractionTop() > item.fractionTop();
};

Item.prototype.hasSamePosition = function(item) {
    return this.decimalTop() === item.decimalTop() && this.decimalLeft() === item.decimalLeft();
};

Item.prototype.isSameAs = function(item) {
    return this.id === item.id;
};

module.exports = Item;
