var React = require('react');
var Moveable = require('../mixins/moveable');
var Map = require('../mapData').Map;

Man = React.createClass({
	WALK_INCREMENT: 2,
	FALL_INCREMENT: 3,
	mixins: [Moveable],
	getInitialState: function() {
		return {
			direction: this.DIRECTIONS.RIGHT,
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
			height: this.props.height,
			backgroundImage: 'url("img/running_man_small_right.png")'
    	};
    	if (this.state.direction === this.DIRECTIONS.LEFT) {
    		styles.transform = 'scaleX(-1)';
    	}
        return (
            <div id="man" alt="{this.props.name}" style={styles} />
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
    	return this.state.top < Map.height - this.props.height;
    },
    canFall: function(fallDistance) {
        var changeInTop = fallDistance || this.FALL_INCREMENT;
        var rect = this.toRect({ 'top': changeInTop });
    	return this.isFalling() && !this.props.willCollide(rect);
    },
    fall: function() {
    	var count = 0;
    	var fallAgain = function(timestamp) {
    		var fallDistance = this.FALL_INCREMENT + count / 10;
    		var totalFallDistance = Map.height - this.state.top - this.props.height;
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
	    	canWalk = this.state.left + this.props.width + this.WALK_INCREMENT <= Map.width;
    	} else {
	    	canWalk = this.state.left + this.WALK_INCREMENT > 0;
    	}
    	var changeInLeft = this.WALK_INCREMENT;
		if (direction === this.DIRECTIONS.LEFT) {
			changeInLeft *= -1;
		}
        var rect = this.toRect({ 'left': changeInLeft });
    	return canWalk && !this.props.willCollide(rect);
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
