var React = require('react');
var Item = require('./item.jsx');

var DroppableBlock = React.createClass({
    render: function() {
    	var styles = {
    		position: this.props.position || 'absolute',
            backgroundColor: 'blue'
    	};
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = DroppableBlock;
