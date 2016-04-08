var MAP = require('../constants/map');

function Falls() {}

Falls.prototype.fall = function() {
    if (!this.canFall) {
        throw new Error('Item cannot fall.');
    }
    this.move(MAP.MOVEMENTS.FALL);
};

module.exports = Falls;
