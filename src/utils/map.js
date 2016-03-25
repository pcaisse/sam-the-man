var MAP = require('../constants/map');

module.exports = {
    findCellIndex: function(value) {
        return parseInt(value / MAP.unit);
    },

    snapToGrid: function(value) {
        return this.findCellIndex(value) * MAP.unit;
    },

    scaleToMap: function(value) {
        return value * MAP.unit;
    },

    asFraction: function(value) {
        return value * MAP.MOVEMENTS_PER_CELL;
    }
};
