var React = require('react');
var Item = require('./item.jsx');

var BreakableBlock = React.createClass({
    render: function() {
    	var styles = {
    		position: this.props.position || 'absolute',
            backgroundColor: 'red',
            visibility: this.props.isBroken ? 'hidden' : 'visible'
    	};
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = BreakableBlock;
