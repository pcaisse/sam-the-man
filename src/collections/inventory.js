var Block = require('../models/items/block');
var Man = require('../models/items/man');
var Elevator = require('../models/items/elevator');
var Goal = require('../models/items/goal');

var utils = require('../utils');

function Inventory() {

    this.removeOneOfType = function(itemType) {
        for (var i = 0; i < this.length; i++) {
            var currItemType = this[i];
            if (itemType === currItemType) {
                this.splice(i, 1);
                break;
            }
        }
    };

    for (var i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
    }
    return this;
}

Inventory.prototype = Object.create(Array.prototype);

Inventory.prototype.add = function(itemType) {
    if (itemType !== Block && itemType !== Man && itemType !== Elevator && itemType !== Goal) {
        throw new TypeError('Item type not valid');
    }
    this.push(itemType);
};

module.exports = Inventory;
