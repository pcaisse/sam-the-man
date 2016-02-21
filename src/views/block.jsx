var React = require('react');

Block = React.createClass({
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width || 50,
			height: this.props.height || 50,
            backgroundColor: 'black'
    	};
        return (
            <div style={styles} />
        );
    }
});

module.exports = Block;
