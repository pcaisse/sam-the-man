var React = require('react');
var Item = require('./item.jsx');

Elevator = React.createClass({
    render: function() {
    	var styles = {
            position: this.props.position || 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
            boxShadow: 'inset 0px 0px 0px 1px brown'
    	};
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = Elevator;
