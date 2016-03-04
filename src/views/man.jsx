var React = require('react');

var Man = React.createClass({
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.props.top,
    		left: this.props.left,
    		width: this.props.width,
			height: this.props.height,
			backgroundImage: 'url("img/running_man.png")',
            backgroundSize: `${this.props.width}px ${this.props.height}px`
    	};
    	if (!this.props.isFacingRight) {
    		styles.transform = 'scaleX(-1)';
    	}
        return (
            <div alt="{this.props.name}" style={styles} />
        );
    },
});

module.exports = Man;
