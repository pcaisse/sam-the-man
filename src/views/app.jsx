var React = require('react');
var Level = require('./level.jsx');

App = React.createClass({
	getInitialState: function() {
		return {
			currLevel: 0
		}
	},
	render: function() {
		var map = this.props.mapData.Map;
		var styles = {
			position: 'relative',
			width: map.width,
			height: map.height,
			border: '1px solid #000'
		};
		var levelData = this.props.mapData.Levels[this.state.currLevel];
		return (
			<div id="app" style={styles}>
				<Level man={levelData.man} blocks={levelData.blocks} elevators={levelData.elevators} />
			</div> 
		);
	}
});

module.exports = App;
