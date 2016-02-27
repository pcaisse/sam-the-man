var React = require('react');

Elevator = React.createClass({
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
            boxShadow: 'inset 0px 0px 0px 1px brown'
    	};
        return (
            <div style={styles} />
        );
    }
});

module.exports = Elevator;
