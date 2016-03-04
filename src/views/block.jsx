var React = require('react');

Block = React.createClass({
    bgColor: function() {
        if (this.props.isDroppable) {
            return 'blue';
        }
        return 'black';
    },
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
            backgroundColor: this.bgColor(),
    	};
        return (
            <div style={styles} />
        );
    }
});

module.exports = Block;
