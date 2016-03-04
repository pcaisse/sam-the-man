var MAP = require('../constants/map');

function Falls() {
    this.fall = function() {
        if (!this.canFall) {
            throw new Error('Item cannot fall.');
        }
        this.top += MAP.fallIncrement;
    };
}

module.exports = Falls;
