var Dispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var COLLISION_EVENT = 'collision';

var CollisionStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit(COLLISION_EVENT);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		this.on(COLLISION_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(COLLISION_EVENT, callback);
	},
};

CollisionStore.dispatchCollision = Dispatcher.register(function(action) {
	CollisionStore.emitChange();
});

module.exports = CollisionStore;