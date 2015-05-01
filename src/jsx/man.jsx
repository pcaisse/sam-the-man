var React = require('react');
var Moveable = require('../js/moveable.js');

Man = React.createClass({
	WALK_INCREMENT: 2,
	FALL_INCREMENT: 3,
	mixins: [Moveable],
	getInitialState: function() {
		return {
			direction: this.DIRECTIONS.RIGHT
		}
	},
	getDefaultProps: function() {
		return {
			width: 50,
			height: 50
		}
	},
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.state.top,
    		left: this.state.left,
    		width: this.props.width,
			height: this.props.height
    	};
    	if (this.state.direction === this.DIRECTIONS.LEFT) {
    		styles.transform = 'scaleX(-1)';
    	}
        return (
            <img id="man" src="img/running_man_small_right.png" alt="{this.props.name}" style={styles} />
        );
    },
    componentWillMount: function() {
    	this.state.top = this.state.top || this.props.initialPos.top;
    	this.state.left = this.state.left || this.props.initialPos.left;
    },
    componentDidMount: function() {
    	if (this.isFalling()) {
    		this.fall();
    	} else {
	    	this.walk();
    	}
    },
    isFalling: function() {
    	return this.state.top < this.props.mapDimensions.height - this.props.height;
    },
    willCollide: function(rect) {
    	var intersect = function(a, b) {
    		return ((b.top >= a.top && b.top <= a.top + a.height) ||
    			(b.top <= a.top && b.top + b.height >= a.top)) &&
    			((b.left >= a.left && b.left <= a.left + a.width) ||
    			(b.left <= a.left && b.left + b.width >= a.left));
    	};
    	return this.props.blocks.some(function(block) {
    		return intersect(rect, block);
    	}); 
    },
    canFall: function(fallDistance) {
    	var rectThis = {
			top: this.state.top + (fallDistance || this.FALL_INCREMENT),
			left: this.state.left,
			width: this.props.width,
			height: this.props.height
		};
    	return this.isFalling() && !this.willCollide(rectThis);
    },
    fall: function() {
    	var count = 0;
    	var fallAgain = function(timestamp) {
    		var fallDistance = this.FALL_INCREMENT + count / 10;
    		var totalFallDistance = this.props.mapDimensions.height - this.state.top - this.props.height;
    		if (fallDistance > totalFallDistance) {
    			fallDistance = totalFallDistance;
    		}
	    	if (this.canFall(fallDistance)) {
		    	this.move(this.DIRECTIONS.DOWN, fallDistance);
	    		count++;
		    	window.requestAnimationFrame(fallAgain);
	    	} else {
	    		this.walk();
	    	}
    	}.bind(this);
    	fallAgain();
    },
    canWalk: function(direction) {
    	var canWalk;
    	if (this.state.direction === this.DIRECTIONS.RIGHT) {
	    	canWalk = this.state.left + this.props.width + this.WALK_INCREMENT <= this.props.mapDimensions.width;
    	} else {
	    	canWalk = this.state.left + this.WALK_INCREMENT > 0;
    	}
    	var rectThis = {
			top: this.state.top,
			width: this.props.width,
			height: this.props.height
		};
		if (direction === this.DIRECTIONS.RIGHT) {
			rectThis.left = this.state.left + this.WALK_INCREMENT;
		} else {
			rectThis.left = this.state.left - this.WALK_INCREMENT;
		}
    	return canWalk && !this.willCollide(rectThis);
    },
    changeDirection: function() {
    	if (this.state.direction == this.DIRECTIONS.RIGHT) {
    		this.state.direction = this.DIRECTIONS.LEFT;
    	} else {
    		this.state.direction = this.DIRECTIONS.RIGHT;
    	}
    },
    walk: function() {
    	var walkAgain = function(timestamp) {
    		this.move(this.state.direction, this.WALK_INCREMENT);
	    	if (this.canFall()) {
	    		this.fall();
	    	} else {
	    		if (!this.canWalk(this.state.direction)) {
		    		this.changeDirection();
		    	}
		    	window.requestAnimationFrame(walkAgain);
	    	}
    	}.bind(this);
		walkAgain();
    }
});

module.exports = Man;
