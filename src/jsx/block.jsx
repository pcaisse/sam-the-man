var React = require('react');

Block = React.createClass({
	getInitialState: function() {
        return {
            top: this.props.initialPos.top,
            left: this.props.initialPos.left
        }
    },
    getDefaultProps: function() {
		return {
			width: 50,
			height: 50
		}
	},
    render: function() {
    	var styles = {
    		position: 'absolute',
    		top: this.state.top,
    		left: this.state.left,
    		width: this.props.width,
			height: this.props.height,
            backgroundColor: 'black'
    	};
        return (
            <div style={styles} />
        );
    }
});

module.exports = Block;
