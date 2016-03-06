var Block = require('../models/block');
var Man = require('../models/man');
var Elevator = require('../models/elevator');

var MAP = require('../constants/map');

function Items() {
    this.push.apply(this, arguments);

    var count = 0;
    this.forEach(function(item) {
        // Validate
        if (!(item instanceof Block) && !(item instanceof Elevator) && !(item instanceof Man)) {
            throw new TypeError("Items in level must be of valid types.");
        }
        // Scale
        ['top', 'left', 'width', 'height'].forEach(function(measure) {
            item[measure] *= MAP.unit;
        });
        // Give unique id
        item.id = count;
        count++;
    });

    return this;
}

Items.prototype = Object.create(Array.prototype);

Items.prototype.itemCollidesWithItemWhere = function(item, conditionFunc) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && item.collidesWith(currItem) && conditionFunc(currItem, item);
    })[0];
};

Items.prototype.enterableItemWhichContainsItem = function(item) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && currItem.isEnterable && item.hasSamePosition(currItem);
    })[0];
};

Items.prototype.droppableItemWalkedOnByItem = function(item) {
    return this.filter(function(currItem) {
        return !item.isSameAs(currItem) && currItem.isDroppable && currItem.walkingOnItem &&
            currItem.walkingOnItem.isSameAs(item);
    })[0];
};

module.exports = Items;
