var FALL_INCREMENT = 3;
var WALK_INCREMENT = 2;

function Item(data) {
    [data.top, data.left, data.width, data.height].forEach(function(arg) {
        if (typeof arg !== "number") {
            throw new TypeError('Item must have top, left, width, height of all numbers.');
        }
    });
    Object.assign(this, data);

    this.collidesWith = function(item) {
        return ((item.top >= this.top && item.top <= this.top + this.height) ||
            (item.top <= this.top && item.top + item.height >= this.top)) &&
            ((item.left >= this.left && item.left <= this.left + this.width) ||
            (item.left <= this.left && item.left + item.width >= this.left));
    }

    this.fall = function() {
        if (!this.isMovable || !this.canFall) {
            throw new Error('Item cannot fall.');
        }
        this.top += FALL_INCREMENT;
    }

    this.walk = function() {
        if (!this.isMovable || !this.canWalk) {
            throw new Error('Item cannot walk.');
        }
        if (this.isFacingRight) {
            this.left += WALK_INCREMENT;
        } else {
            this.left -= WALK_INCREMENT;
        }
    }

    this.turn = function() {
        if (this.isFacingRight) {
            this.isFacingRight = false;
        } else {
            this.isFacingRight = true;
        }
    }
}

module.exports = Item;