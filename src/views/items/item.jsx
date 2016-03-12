var React = require('react');

var Item = React.createClass({
    render: function() {
        return (
            <div style={this.props.style} onDragStart={this.props.onDragStart} draggable={this.props.draggable} />
        );
    }
});

module.exports = Item;
