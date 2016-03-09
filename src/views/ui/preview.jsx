var React = require('react');
var MAP = require('../../constants/map');

var ItemPreview = React.createClass({
    render: function() {
        var styles = {
            width: MAP.unit,
            height: MAP.unit,
            backgroundColor: 'red',
            visibility: this.props.visibility || 'hidden',
            opacity: 0.8,
            position: 'absolute',
            top: this.props.top,
            left: this.props.left
        };
        return <div style={styles} />;
    }
});

module.exports = ItemPreview;
