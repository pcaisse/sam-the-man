// Map is a XxY grid.
var X = 10;
var Y = 8;
var INVENTORY_X = 2;

var FALLS_PER_CELL = 4;
var WALKS_PER_CELL = 2;
var VERTICAL_MOVEMENTS_PER_CELL = 1;
var MOVEMENTS_PER_CELL = 40;

var TOTAL_X = X + INVENTORY_X;
var ratio = TOTAL_X / Y;

var MOVEMENTS = {
    FALL: 'fall',
    WALK: 'walk',
    MOVE_VERTICALLY: 'moveVertically'
};

function findBestFitDimensions() {
    var currWidth = window.innerWidth;
    var currHeight = currWidth / ratio;
    if (currHeight > window.innerHeight) {
        currHeight = window.innerHeight;
        currWidth = currHeight * ratio;
    }
    return {
        width: currWidth,
        height: currHeight
    };
}

var bestFitDimensions = findBestFitDimensions();
var appWidth = bestFitDimensions.width;
var height = bestFitDimensions.height;
var unit = height / Y;
var width = appWidth * (X / TOTAL_X);

module.exports = {
    // Width & height are scaled to minimum dimension
    width: width,
    height: height,
    // Adding 2 units of width to playable grid
    appWidth: appWidth,
    // Units are provided so that level positioning and size can be scaled to the size of the map
    unit: unit,
    X: X,
    Y: Y,
    FALLS_PER_CELL: FALLS_PER_CELL,
    WALKS_PER_CELL: WALKS_PER_CELL,
    VERTICAL_MOVEMENTS_PER_CELL: VERTICAL_MOVEMENTS_PER_CELL,
    MOVEMENTS_PER_CELL: MOVEMENTS_PER_CELL,
    MOVEMENTS: MOVEMENTS
};
