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

Items.prototype.itemCollidesWithItemWhere = function(item, props) {
    return this.filter(function(currItem) {
        if (currItem.id !== item.id && item.collidesWith(currItem) && props.some(function(prop) {
            return currItem[prop];
        })) {
            return currItem;
        }
    })[0];
};

Items.prototype.enterableItemWhichContainsItem = function(item) {
    return this.filter(function(currItem) {
        if (currItem.id !== item.id && currItem.isEnterable) {
            return item.hasSamePosition(currItem);
        }
    })[0];
};

module.exports = Items;
