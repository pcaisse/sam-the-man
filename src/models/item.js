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

    this.hasSamePosition = function(item) {
        return this.top === item.top && this.left === item.left;
    }
}

module.exports = Item;