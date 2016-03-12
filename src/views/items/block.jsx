var React = require('react');
var Item = require('./item.jsx');

var Block = React.createClass({
    bgColor: function() {
        if (this.props.isDroppable) {
            return 'blue';
        }
        return 'black';
    },
    render: function() {
    	var styles = {
    		position: this.props.position || 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
            backgroundColor: this.bgColor(),
    	};
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = Block;
