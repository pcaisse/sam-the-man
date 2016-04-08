var Item = require('./item');

function Goal(data) {
    Item.call(this, data);
    this.constructor = Goal;
}

Goal.prototype = Object.create(Item.prototype);

Goal.prototype.isAchievable = true;

Goal.prototype.onAchieved = function() {
    this.isAchieved = true;
};

module.exports = Goal;