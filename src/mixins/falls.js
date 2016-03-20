var MAP = require('../constants/map');

function Falls() {
    this.fall = function() {
        if (!this.canFall) {
            throw new Error('Item cannot fall.');
        }
        this.move(MAP.MOVEMENTS.FALL);
    };
}

module.exports = Falls;
