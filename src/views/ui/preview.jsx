var React = require('react');
var mapUtils = require('../../utils/map');

var ItemPreview = React.createClass({
    render: function() {
        var styles = {
            width: mapUtils.scaleToMap(1),
            height: mapUtils.scaleToMap(1),
            backgroundColor: 'red',
            opacity: 0.8,
            position: 'absolute',
            top: mapUtils.scaleToMap(this.props.top),
            left: mapUtils.scaleToMap(this.props.left)
        };
        return <div style={styles} />;
    }
});

module.exports = ItemPreview;
