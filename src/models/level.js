var Block = require('./block');
var Man = require('./man');
var Elevator = require('./elevator');

function Level(items) {
    items.forEach(function(item) {
        if (!(item instanceof Block) && !(item instanceof Elevator) && !(item instanceof Man)) {
            throw new TypeError("Items in level must be of valid types.");
        }
    })
    this.items = items;
}

module.exports = Level;