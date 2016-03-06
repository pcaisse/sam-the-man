// Map is a 12x8 grid.
// Dimensions must be evenly divisible by the rows/cols in the grid
// and the grid cells must also be evenly divisible by movement increments (falling, walking, etc).
// Otherwise we get floating point issues.
var X = 12;
var Y = 8;

var isLandscape = window.innerWidth > window.innerHeight;
var minDimension = findMinDimension(Math.min(window.innerWidth, window.innerHeight));
var unit = isLandscape ? (minDimension / Y) : (minDimension / X);
var fallIncrement = findFallIncrement(unit);

function findMinDimension(value) {
    while (value) {
        if (value % X === 0 && value % Y === 0 &&
                (value / Y) % 2 === 0 && (value / X) % 2 === 0) { // Even numbers make for more appropriate fallIncrement
            return value;
        }
        value--;
    }
}

function findFallIncrement(unit) {
    var increment = Math.min(6, parseInt(unit / 8)); // Max value keeps speed from getting too fast at small dimensions
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