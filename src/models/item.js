function Item(data) {
    [data.top, data.left, data.width, data.height].forEach(function(arg) {
        if (typeof arg !== "number") {
            throw new TypeError('Item must have top, left, width, height of all numbers.');
        }
    });
    Object.assign(this, data);

    this.collidesWith = function(item) {
        return this.left < item.left + item.width &&
            this.left + this.width > item.left &&
            this.top < item.top + item.height &&
            this.height + this.top > item.top;
    }

    this.hasSamePosition = function(item) {
        return this.top === item.top && this.left === item.left;
    }
}

module.exports = Item;