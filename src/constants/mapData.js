var Block = require('../models/block');
var Elevator = require('../models/elevator');
var Level = require('../models/level');
var Man = require('../models/man');
var MapData = {};

MapData.map = {
    width: 600,
    height: 400
};

MapData.levels = [
    new Level([
        new Elevator({top: 350, left: 0, height: 50, width: 50, isMovingDown: false, isStopped: true}),
        new Block({top: 0, left: 100, height: 50, width: 50}),
        new Block({top: 50, left: 50, height: 50, width: 50}),
        new Block({top: 200, left: 100, height: 50, width: 50}),
        new Block({top: 250, left: 150, height: 50, width: 100}),
        new Block({top: 250, left: 250, height: 50, width: 50}),
        new Block({top: 350, left: 450, height: 50, width: 50}),
        new Man({top: 0, left: 150, height: 50, width: 50, isFacingRight: true})
    ])
];

module.exports = MapData;