var React = require('react');
var Item = require('./item.jsx');

var Block = React.createClass({
    render: function() {
    	var styles = {
    		position: this.props.position || 'absolute',
            backgroundColor: 'black'
    	};
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = Block;
