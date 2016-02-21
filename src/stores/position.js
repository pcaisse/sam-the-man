var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var actionTypes = require('../constants/actionTypes');
var MapData = require('../constants/mapData');

var CHANGE_EVENT = 'change';

var _currLevel = 0;


// TODO: Move all of the actually deterministic playing-out-of-events logic
// 		 into a separate module that just handles positioning and the final outcome.
// 		 This is where window.requestAnimationFrame will happen (should probably be state on a level).
// 		 This really could all live in Level. Level's initial setup will be the map data. Any
// 		 user setup to modify positioning will change its state and then one the user hits "play"
// 		 with every new animation frame state will be updated and children will re-render as needed,
// 		 reflecting the updates that trickle down via props.
var PositionStore = assign({}, EventEmitter.prototype, {
	
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
};

PositionStore.dispatchPosition = Dispatcher.register(function(payload) {
	var action = payload.action;
	if (action === actionTypes.MOVE) {
		move(action.data);
	}
	PositionStore.emitChange();
});

module.exports = PositionStore;