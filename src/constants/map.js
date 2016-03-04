// Map is a 12x8 grid
var X = 12;
var Y = 8;

var isLandscape = window.innerWidth > window.innerHeight;
var minDimension = findMinDimension(Math.min(window.innerWidth, window.innerHeight));
var unit = isLandscape ? (minDimension / Y) : (minDimension / X);
var fallIncrement = findFallIncrement(unit);

function findMinDimension(value) {
    while (value) {
        if (value % X === 0 && value % Y === 0) {
            return value;
        }
        value--;
    }
}

function findFallIncrement(unit) {
    var increment = 5;
    while (increment) {
        if (unit % increment === 0) {
            return increment;
        }
        increment--;
    }
}

var MAP = {
    // Width & height are scaled to minimum dimension
    width: !isLandscape ? minDimension : minDimension * 1.5,
    height: isLandscape ? minDimension : minDimension / 1.5,
    // Units are provided so that level positioning and size can be scaled to the size of the map
    unit: unit,
    // Increments for different types of movement
    fallIncrement: fallIncrement,
    walkIncrement: fallIncrement / 2,
    verticalMoveIncrement: fallIncrement / 4,
};

module.exports = MAP;
