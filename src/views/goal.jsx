var React = require('react');

var Goal = React.createClass({
    render: function() {
        var styles = {
            position: 'absolute',
            top: this.props.top,
            left: this.props.left,
            width: this.props.width,
            height: this.props.height,
            boxShadow: 'inset 0px 0px 0px 1px green'
        };
        return (
            <div style={styles} {...this.props} />
        );
    }
});

module.exports = Goal;
