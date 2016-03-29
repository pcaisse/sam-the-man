var Items = require('../collections/items');
var Inventory = require('../collections/inventory');

var Block = require('../models/items/block');
var Elevator = require('../models/items/elevator');
var Level = require('../models/level');
var Man = require('../models/items/man');
var Goal = require('../models/items/goal');

var LEVELS = [
    new Level({
        items: new Items(
            new Elevator({top: 7, left: 0, isGoingDown: false, isStopped: true}),
            new Block({top: 0, left: 2}),
            new Block({top: 1, left: 1}),
            new Block({top: 4, left: 2}),
            new Block({top: 5, left: 3}),
            new Block({top: 5, left: 4}),
            new Block({top: 5, left: 5, isDroppable: true}),
            new Block({top: 1, left: 5}),
            new Elevator({top: 7, left: 6, isGoingDown: false, isStopped: true}),
            new Block({top: 7, left: 9}),
            new Man({top: 4, left: 3, isFacingRight: true}),
            new Goal({top: 0, left: 1})
        ),
        inventory: new Inventory(Block, Block)
    })
];

module.exports = LEVELS;
