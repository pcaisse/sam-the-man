var React = require('react');

var Man = React.createClass({
    render: function() {
        var backgroundSize = this.props.width + 'px ' + this.props.height + 'px';
    	var styles = {
    		position: 'absolute',
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
            <div style={styles} />
        );
    },
});

module.exports = Man;
