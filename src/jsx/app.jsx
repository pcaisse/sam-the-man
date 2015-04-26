var React = require('react');
var Man = require('./man.jsx');

App = React.createClass({
	render: function() {
		var styles = {
			position: 'relative',
			width: this.props.width,
			height: this.props.height,
			border: '1px solid #CCC'
		};
		return (
			<div id="app" style={styles}>
				<Man name={"Sam"} width={51} height={51} maxLeft={this.props.width} maxTop={this.props.height} />
			</div> 
		);
	}
});

React.render(
    <App width={800} height={600} />, 
    document.getElementById('main')
);

module.exports = App;
