var MAP = require('../constants/map');

function findBestFitDimensions() {
    var currWidth = window.innerWidth;
    var ratio = MAP.TOTAL_X / MAP.Y;
    var currHeight = currWidth / ratio;
    if (currHeight > window.innerHeight) {
        currHeight = window.innerHeight;
        currWidth = currHeight * ratio;
    }
    return {
        width: currWidth,
        height: currHeight
    };
};

module.exports = {
    findCellIndex: function(value, unit) {
        if (value < 0) {
            return -1;
        }
        return parseInt(value / unit);
    },

    scaleToMap: function(value, unit) {
        return value * unit;
    },

    asFraction: function(value) {
        return value * MAP.MOVEMENTS_PER_CELL;
    },

    isWithinMapBounds: function(top, left) {
        return left >= 0 && left <= MAP.X - 1 && top >= 0 && top <= MAP.Y - 1;
    },

    findMapDimensions: function() {
        var bestFitDimensions = findBestFitDimensions();
        var appWidth = bestFitDimensions.width;
        var height = bestFitDimensions.height;
        var unit = height / MAP.Y;
        var width = appWidth * (MAP.X / MAP.TOTAL_X);
        return {
            width: width,
            height: height,
            appWidth: appWidth,
            unit: unit
        };
    }
};
