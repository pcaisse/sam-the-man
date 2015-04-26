var React = require('react');
var Moveable = require('../js/moveable.js');

Man = React.createClass({
	WALK_INCREMENT: 3,
	mixins: [Moveable],
	getInitialState: function(){
		return {
			top: this.props.maxTop - this.props.height,
			left: 0,
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
    componentDidMount: function() {
    	this.walkRight();
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
