var React = require('react');
var Man = require('./man.jsx');
var Block = require('./block.jsx');

App = React.createClass({
	getDefaultProps: function() {
		return {
			width: 600,
			height: 400
		}
	},
	render: function() {
		var styles = {
			position: 'relative',
			width: this.props.width,
			height: this.props.height,
			border: '1px solid #CCC'
		};
		var mapDimensions = {
			width: this.props.width,
			height: this.props.height
		};
		var blocks = [
			{top: 200, left: 100}
		];
		return (
			<div id="app" style={styles}>
				<Man name={"Sam"} mapDimensions={mapDimensions} initialPos={{top: 0, left: 100}} blocks={blocks} />
				{blocks.map(function(block) {
					return <Block mapDimensions={mapDimensions} initialPos={{top: block.top, left: block.left}} />;
				})}
			</div> 
		);
	}
});

React.render(
    <App spacialMatrix={{}} />, 
    document.getElementById('main')
);

module.exports = App;
