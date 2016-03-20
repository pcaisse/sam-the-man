var React = require('react');
var Item = require('./item.jsx');

var Goal = React.createClass({
    render: function() {
        var styles = {
            position: 'absolute',
            boxShadow: 'inset 0px 0px 0px 1px green'
        };
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = Goal;
