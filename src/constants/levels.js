var Items = require('../collections/items');

var Block = require('../models/block');
var Elevator = require('../models/elevator');
var Level = require('../models/level');
var Man = require('../models/man');

var LEVELS = [
    new Level({
        items: new Items(
            new Elevator({top: 7, left: 0, height: 1, width: 1, isMovingDown: false, isStopped: true}),
            new Block({top: 0, left: 2, height: 1, width: 1}),
            new Block({top: 1, left: 1, height: 1, width: 1}),
            new Block({top: 4, left: 2, height: 1, width: 1}),
            new Block({top: 5, left: 3, height: 1, width: 2}),
            new Block({top: 5, left: 5, height: 1, width: 1, isDroppable: true}),
            new Block({top: 1, left: 5, height: 1, width: 1}),
            new Elevator({top: 7, left: 6, height: 1, width: 1, isMovingDown: false, isStopped: true}),
            new Block({top: 7, left: 9, height: 1, width: 1}),
            new Man({top: 0, left: 3, height: 1, width: 1, isFacingRight: true})
        )
    })
];

module.exports = LEVELS;
