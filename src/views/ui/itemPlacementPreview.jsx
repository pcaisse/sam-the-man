var React = require('react');
var mapUtils = require('../../utils/map');

var ItemPlacementPreview = React.createClass({
    render: function() {
        var mapUnit = this.props.mapDimensions.unit;
        var styles = {
            width: mapUtils.scaleToMap(1, mapUnit),
            height: mapUtils.scaleToMap(1, mapUnit),
            backgroundColor: 'red',
            opacity: 0.8,
            position: 'absolute',
            top: mapUtils.scaleToMap(this.props.styles.top, mapUnit),
            left: mapUtils.scaleToMap(this.props.styles.left, mapUnit)
        };
        return <div style={styles} />;
    }
});

module.exports = ItemPlacementPreview;
