var MAP = require('../constants/map');

function Item(data) {
    [data.top, data.left, data.width, data.height].forEach(function(arg) {
        if (typeof arg !== "number") {
            throw new TypeError('Item must have top, left, width, height of all numbers.');
        }
    });
    Object.assign(this, data);

    this.isWithinMapY = function() {
        return this.top >= 0 && this.top <= MAP.height - this.height;
    };

    this.isWithinMapX = function() {
        return this.left >= 0 && this.left <= MAP.width - this.width;
    };

    this.isWithinMapBounds = function() {
        return this.isWithinMapX() && this.isWithinMapY();
    };

    this.collidesWith = function(item) {
        return this.left < item.left + item.width &&
            this.left + this.width > item.left &&
            this.top < item.top + item.height &&
            this.height + this.top > item.top;
    };

    this.hasSamePosition = function(item) {
        return this.top === item.top && this.left === item.left;
    };

    this.isSameAs = function(item) {
        return this.id === item.id;
    };
}

module.exports = Item;