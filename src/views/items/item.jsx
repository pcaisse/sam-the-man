var React = require('react');

var Item = React.createClass({
    render: function() {
        return (
            <div
                style={this.props.style}
                onDragStart={this.props.onDragStart}
                onDragEnd={this.props.onDragEnd}
                draggable={this.props.draggable}
            />
        );
    }
});

module.exports = Item;
