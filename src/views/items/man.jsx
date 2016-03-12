var React = require('react');
var Item = require('./item.jsx');

var Man = React.createClass({
    render: function() {
        var backgroundSize = this.props.width + 'px ' + this.props.height + 'px';
    	var styles = {
            position: this.props.position || 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
			backgroundImage: 'url("img/running_man.png")',
            backgroundSize: backgroundSize
    	};
    	if (!this.props.isFacingRight) {
    		styles.transform = 'scaleX(-1)';
    	}
        return (
            <Item style={styles} {...this.props} />
        );
    },
});

module.exports = Man;
