var Item = require('./item');

function Goal(data) {
    data.isAchievable = true;
    Item.call(this, data);

    this.onAchieved = function() {
        this.isAchieved = true;
    };
}

module.exports = Goal;