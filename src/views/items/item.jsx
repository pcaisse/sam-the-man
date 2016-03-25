var React = require('react');

var Item = React.createClass({
    render: function() {
        var styles = this.props.style;
        if (this.props.isInInventory) {
            styles.width = this.props.width;
            styles.height = this.props.height;
        } else {
            styles.top = this.props.scaledTop();
            styles.left = this.props.scaledLeft();
            styles.width = this.props.scaledWidth();
            styles.height = this.props.scaledHeight();
        }
        // TODO: Pass through all props except certain ones we've already read
        return (
            <div
                style={styles}
                onDragStart={this.props.onDragStart}
                onDragEnd={this.props.onDragEnd}
                onTouchStart={this.props.onTouchStart}
                onTouchMove={this.props.onTouchMove}
                onTouchEnd={this.props.onTouchEnd}
                draggable={this.props.draggable}
            />
        );
    }
});

module.exports = Item;
