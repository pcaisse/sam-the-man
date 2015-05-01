var React = require('react');

Block = React.createClass({
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
            backgroundColor: 'black'
    	};
        return (
            <div style={styles} />
        );
    }
});

module.exports = Block;
