var React = require('react');
var MapData = require('../mapData');
var Man = require('./man.jsx');
var Block = require('./block.jsx');
var Elevator = require('./elevator.jsx');

var intersect = function(a, b) {
    return ((b.top >= a.top && b.top <= a.top + a.height) ||
        (b.top <= a.top && b.top + b.height >= a.top)) &&
        ((b.left >= a.left && b.left <= a.left + a.width) ||
        (b.left <= a.left && b.left + b.width >= a.left));
};

Level = React.createClass({
	render: function() {
		var styles = {
			position: 'relative',
			width: Map.width,
			height: Map.height,
			border: '1px solid #CCC'
		};
		return (
			<div id="level" style={styles}>
				<Man name={"Sam"} initialPos={this.props.man.initialPos} willCollide={this.objectWillCollide} />
				{this.props.blocks.map(function(block) {
					return <Block {...block} />;
				})}
				{this.props.elevators.map(function(elevator) {
					return <Elevator {...elevator} />;
				})}
			</div> 
		);
	},
	objectWillCollide: function(rect) {
        return this.props.blocks.some(function(block) {
            return intersect(rect, block);
        }); 
    }
});

module.exports = Level;
