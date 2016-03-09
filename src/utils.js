var models = require('./models/items');
var views = require('./views/items');
var MAP = require('./constants/map');

module.exports = {
    modelToComponent: function(model) {
        if (model === models.Block) {
            return views.Block;
        }
        if (model === models.Elevator) {
            return views.Elevator;
        }
        if (model === models.Man) {
            return views.Man;
        }
        if (model === models.Goal) {
            return views.Goal;
        }
        return null;
    },

    filterByType: function(types, type) {
        return types.filter(function(currType) {
            return currType === type;
        });
    },

    findCellIndex: function(dimension) {
        return parseInt(dimension / MAP.unit);
    },

    snapToGrid: function(dimension) {
        return this.findCellIndex(dimension) * MAP.unit;
    },

    clone: function(obj) {
        return Object.assign({}, obj);
    }
};
