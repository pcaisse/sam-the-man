var models = require('../models/items');
var views = require('../views/items');

module.exports = {
    modelToComponent: function(model) {
        if (model === models.Block) {
            return views.Block;
        }
        if (model === models.Elevator) {
            return views.Elevator;
        }
        if (model === models.Man) {
            return views.Man;
        }
        if (model === models.Goal) {
            return views.Goal;
        }
        throw new TypeError('Model-view pair not found');
    }
};
