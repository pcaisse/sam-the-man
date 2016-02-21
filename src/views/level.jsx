var React = require('react');
var Man = require('./man.jsx');
var Block = require('./block.jsx');
var Elevator = require('./elevator.jsx');

var models = require('../models');

var Level = React.createClass({

	getInitialState: function() {
		return {
			items: this.props.items
		};
	},

	componentDidMount: function() {
		window.requestAnimationFrame(this.update);
	},

	update: function() {
		var items = this.state.items;
		items.forEach(this.updateItem);
		this.setState(items);
		window.requestAnimationFrame(this.update);
	},

	updateItem: function(item, index, items) {
    	if (item.canFall && this.isFalling(item, items)) {
    		item.fall();
    	} else if (item.canWalk) {
			if (!this.canWalkStraight(item, items)) {
				item.turn();
			}
	    	item.walk();
    	}
	},

	itemCollidesWithImmovableItem: function(item, items) {
		// Assume movable items cannot collide...?
		return items.filter(function(item) {
			return !item.isMovable;
		}).some(function(immovableItem) {
			return item.collidesWith(immovableItem);
		});
	},

    itemIsWithinMapY: function(item) {
    	return item.top >= 0 && item.top < this.props.map.height - item.height;
    },

    itemIsWithinMapX: function(item) {
		return item.left >= 0 && item.left < this.props.map.width - item.width;
    },

    itemIsWithinMapBounds: function(item) {
    	return this.itemIsWithinMapX(item) && this.itemIsWithinMapY(item);
    },

    canWalkStraight: function(item, items) {
		var futureItem = Object.assign({}, item);
		futureItem.walk();
		return this.itemIsWithinMapBounds(futureItem) && !this.itemCollidesWithImmovableItem(futureItem, items);
    },

    isFalling: function(item, items) {
    	var futureItem = Object.assign({}, item);
    	futureItem.fall();
    	return this.itemIsWithinMapBounds(futureItem) && !this.itemCollidesWithImmovableItem(futureItem, items);
    },

    modelToComponent: function(model, Component) {
    	return this.props.items.filter(function(item) {
			return item instanceof model;
		}).map(function(item, index) {
			return <Component key={index} {...item} />;
		});
    },

	render: function() {
		var styles = {
			position: 'relative',
			width: this.props.map.width,
			height: this.props.map.height,
			border: '1px solid #CCC'
		};
		return (
			<div style={styles}>
				{this.modelToComponent(models.Man, Man)}
				{this.modelToComponent(models.Block, Block)}
				{this.modelToComponent(models.Elevator, Elevator)}
			</div> 
		);
	},
});

module.exports = Level;
