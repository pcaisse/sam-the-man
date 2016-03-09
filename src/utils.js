var Man = require('./views/man.jsx');
var Block = require('./views/block.jsx');
var Elevator = require('./views/elevator.jsx');
var Goal = require('./views/goal.jsx');

var models = require('./models');
var MAP = require('./constants/map');

module.exports = {
    modelToComponent: function(model) {
        if (model === models.Block) {
            return Block;
        }
        if (model === models.Elevator) {
            return Elevator;
        }
        if (model === models.Man) {
            return Man;
        }
        if (model === models.Goal) {
            return Goal;
        }
        return null;
    },

    filterByType: function(types, type) {
        return types.filter(function(currType) {
            return currType === type;
        });
    },

    findCell: function(dimension) {
        return parseInt(dimension / MAP.unit);
    },

    snapToGrid: function(dimension) {
        return this.findCell(dimension) * MAP.unit;
    },

    clone: function(obj) {
        return Object.assign({}, obj);
    }
};
