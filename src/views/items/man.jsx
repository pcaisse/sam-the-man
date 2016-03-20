var React = require('react');
var Item = require('./item.jsx');
var mapUtils = require('../../utils/map');

var Man = React.createClass({
    render: function() {
        var backgroundSize = mapUtils.scaleToMap(this.props.width) + 'px ' +
            mapUtils.scaleToMap(this.props.height) + 'px';
    	var styles = {
            position: this.props.position || 'absolute',
			backgroundImage: 'url("img/running_man.png")',
            backgroundSize: backgroundSize
    	};
    	if (!this.props.isFacingRight) {
    		styles.transform = 'scaleX(-1)';
    	}
        return (
            <Item style={styles} {...this.props} />
        );
    }
});

module.exports = Man;
