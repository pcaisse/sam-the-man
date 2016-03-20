var MAP = require('../constants/map');

module.exports = {
    findCellIndex: function(dimension) {
        return parseInt(dimension / MAP.unit);
    },

    snapToGrid: function(dimension) {
        return this.findCellIndex(dimension) * MAP.unit;
    },

    scaleToMap: function(position) {
        return position * MAP.unit;
    }
};
