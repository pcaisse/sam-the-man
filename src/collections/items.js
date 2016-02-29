var Block = require('../models/block');
var Man = require('../models/man');
var Elevator = require('../models/elevator');

function Items() {
    this.push.apply(this, arguments);

    this.forEach(function(item) {
        if (!(item instanceof Block) && !(item instanceof Elevator) && !(item instanceof Man)) {
            throw new TypeError("Items in level must be of valid types.");
        }
    })

    return this;
}

Items.prototype = Object.create(Array.prototype);

Items.prototype.itemCollidesWithItemWhere = function(item, props) {
    return this.filter(function(currItem) {
        return currItem !== item && props.some(function(prop) {
            return currItem[prop];
        });
    }).some(function(filteredItem) {
        return item.collidesWith(filteredItem);
    });
}

Items.prototype.enterableItemWhichContainsItem = function(item) {
    return this.filter(function(currItem) {
        if (currItem.isEnterable && currItem !== item) {
            return item.hasSamePosition(currItem);
        }
    })[0];
}

module.exports = Items;
