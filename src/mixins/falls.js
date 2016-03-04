var FALL_INCREMENT = 5;

function Falls() {
    this.fall = function() {
        if (!this.canFall) {
            throw new Error('Item cannot fall.');
        }
        this.top += FALL_INCREMENT;
    };
};

module.exports = Falls;
