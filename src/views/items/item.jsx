var React = require('react');
var MAP = require('../../constants/map');
var mapUtils = require('../../utils/map');

var Item = React.createClass({

    scaledDimensions: function() {
        var mapUnit = this.props.mapDimensions.unit;
        var width = mapUtils.scaleToMap(this.props.width, mapUnit);
        var height = mapUtils.scaleToMap(this.props.height, mapUnit);
        var top = mapUtils.scaleToMap(this.props.top, mapUnit) +
                mapUtils.scaleToMap(this.props.topFraction / MAP.MOVEMENTS_PER_CELL, mapUnit);
        var left = mapUtils.scaleToMap(this.props.left, mapUnit) +
                mapUtils.scaleToMap(this.props.leftFraction / MAP.MOVEMENTS_PER_CELL, mapUnit);
        return {
            width: width,
            height: height,
            top: top,
            left: left
        };
    },

    render: function() {
        var scaledDimensions = this.scaledDimensions();
        var styles = this.props.style;
        if (this.props.isInInventory) {
            styles.width = this.props.width;
            styles.height = this.props.height;
        } else {
            styles.top = scaledDimensions.top;
            styles.left = scaledDimensions.left;
            styles.width = scaledDimensions.width;
            styles.height = scaledDimensions.height;
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
            >
                {this.props.children}
            </div>
        );
    }
});

module.exports = Item;
