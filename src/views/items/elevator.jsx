var React = require('react');
var Item = require('./item.jsx');

var Elevator = React.createClass({
    render: function() {
    	var styles = {
            position: this.props.position || 'absolute',
            boxShadow: 'inset 0px 0px 0px 1px brown'
    	};
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = Elevator;
