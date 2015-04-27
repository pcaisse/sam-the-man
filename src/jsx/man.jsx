var React = require('react');
var Moveable = require('../js/moveable.js');

Man = React.createClass({
	WALK_INCREMENT: 3,
	FALL_INCREMENT: 3,
	mixins: [Moveable],
	getInitialState: function(){
		return {
			top: 100,//this.props.maxTop - this.props.height,
			left: 100,
			direction: this.DIRECTIONS.RIGHT
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
    	if (this.direction === this.DIRECTIONS.LEFT) {
    		styles.transform = 'scaleX(-1)';
    	}
        return (
            <img id="man" src="img/running_man_small_right.png" alt="{this.props.name}" style={styles} />
        );
    },
    isFalling: function() {
    	return this.state.top < this.props.maxTop - this.props.height;
    },
    componentDidMount: function() {
    	if (this.isFalling()) {
    		this.fall();
    	} else {
	    	this.walk();
    	}
    },
    fall: function() {
    	var count = 0;
    	var fallAgain = function(timestamp) {
    		var fallDistance = this.FALL_INCREMENT + count / 10;
    		var totalFallDistance = this.props.maxTop - this.state.top - this.props.height;
    		if (fallDistance > totalFallDistance) {
    			fallDistance = totalFallDistance;
    		}
	    	this.move(this.DIRECTIONS.DOWN, fallDistance);
	    	if (this.isFalling()) {
	    		count++;
		    	window.requestAnimationFrame(fallAgain);
	    	} else {
	    		this.walk();
	    	}
    	}.bind(this);
    	fallAgain();
    },
    walk: function() {
		if (this.state.direction === this.DIRECTIONS.RIGHT) {
	    	this.walkRight();
    	} else if (this.state.direction === this.DIRECTIONS.LEFT) {
    		this.walkLeft();
    	}
    },
    walkRight: function(timestamp) {
		this.move(this.DIRECTIONS.RIGHT, this.WALK_INCREMENT);
    	if (this.state.left + this.props.width + this.WALK_INCREMENT <= this.props.maxLeft) {
	    	window.requestAnimationFrame(this.walkRight);
    	} else {
    		this.direction = this.DIRECTIONS.LEFT;
	    	window.requestAnimationFrame(this.walkLeft);
    	}
    },
    walkLeft: function(timestamp) {
		this.move(this.DIRECTIONS.LEFT, this.WALK_INCREMENT);
    	if (this.state.left + this.WALK_INCREMENT > 0) {
	    	window.requestAnimationFrame(this.walkLeft);
    	} else {
    		this.direction = this.DIRECTIONS.RIGHT;
	    	window.requestAnimationFrame(this.walkRight);
    	}
    }
});

module.exports = Man;
