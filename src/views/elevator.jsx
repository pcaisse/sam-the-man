var React = require('react');

Elevator = React.createClass({
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width || 50,
			height: this.props.height || 50,
            borderColor: 'brown',
            borderWidth: 1,
            borderTopStyle: 'solid',
            borderBottomStyle: 'solid',
            borderLeftStyle: 'dashed',
            borderRightStyle: 'dashed'
    	};
        return (
            <div style={styles} />
        );
    }
});

module.exports = Elevator;
