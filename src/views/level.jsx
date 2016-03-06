var React = require('react');
var Man = require('./man.jsx');
var Block = require('./block.jsx');
var Elevator = require('./elevator.jsx');

var models = require('../models');

var Level = React.createClass({

    getInitialState: function() {
        return {
            items: this.props.items,
            isPlacementMode: true
        };
    },

    componentDidMount: function() {
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    componentWillUnmount: function() {
        window.cancelAnimationFrame(this._animationRequestId);
    },

    inventory: function() {
        var styles = {
            width: '20%',
            position: 'absolute',
            top: '25%',
            left: '75%',
            backgroundColor: '#fff',
            border: '1px solid black'
        };
        var inventory = this.props.inventory;
        var inventoryItems = Object.keys(inventory).map(function(itemType) {
            var numberOfType = inventory[itemType];
            return <div>{itemType + ' x ' + numberOfType}</div>;
        });
        return (
            <div style={styles} draggable>
                <div>Inventory</div>
                {inventoryItems}
            </div>
        );
    },

    updateItems: function() {
        var items = this.state.items;
        items.update();
        this.setState(items);
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    modelsToComponents: function(model, Component) {
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
        };
        var inventory = this.state.isPlacementMode ? this.inventory() : null;
        return (
            <div style={styles}>
                {this.modelsToComponents(models.Man, Man)}
                {this.modelsToComponents(models.Block, Block)}
                {this.modelsToComponents(models.Elevator, Elevator)}
                {inventory}
            </div> 
        );
    },
});

module.exports = Level;
