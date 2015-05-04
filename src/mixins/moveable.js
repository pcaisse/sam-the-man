var Moveable = {
	DIRECTIONS: {
		UP: 0,
		DOWN: 1,
		LEFT: 2,
		RIGHT: 3
	},
    move: function(direction, increment) {
    	var newState = {};
    	if (direction === this.DIRECTIONS.LEFT) {
    		newState.left = this.state.left - increment;
    	}
    	if (direction === this.DIRECTIONS.RIGHT) {
    		newState.left = this.state.left + increment;
    	}
    	if (direction === this.DIRECTIONS.UP) {
    		newState.top = this.state.top - increment;
    	}
    	if (direction === this.DIRECTIONS.DOWN) {
    		newState.top = this.state.top + increment;
    	}
		this.setState(newState);
    },
    toRect: function(changeInPosition) {
        // eg. changeInPosition = { 'top': 5 } or { 'left': -1 }
        return {
            top: this.state.top + (changeInPosition.top || 0),
            left: this.state.left + (changeInPosition.left || 0),
            width: this.props.width,
            height: this.props.height
        };
    }
};

module.exports = Moveable;
