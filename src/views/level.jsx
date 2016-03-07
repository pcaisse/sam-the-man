var React = require('react');
var Man = require('./man.jsx');
var Block = require('./block.jsx');
var Elevator = require('./elevator.jsx');
var ItemPreview = require('./preview.jsx');

var models = require('../models');
var MAP = require('../constants/map');
var utils = require('../utils');

var Level = React.createClass({

    getInitialState: function() {
        return {
            items: this.props.items,
            inventory: this.props.inventory,
            isPlacementMode: true
        };
    },

    componentWillUpdate: function(nextProps, nextState) {
        if (this.state.isPlacementMode && !nextState.isPlacementMode) {
            this.play();
        }
    },

    componentWillUnmount: this.pause,

    play: function() {
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    pause: function() {
        window.cancelAnimationFrame(this._animationRequestId);
    },

    inventory: function() {
        var styles = {
            width: '20%',
            position: 'absolute',
            top: '25%',
            left: '65%',
            padding: parseInt(MAP.unit / 5),
            backgroundColor: '#fff',
            border: '1px solid black'
        };
        var inventory = this.state.inventory;
        var blocks = utils.filterByType(inventory, models.Block);
        var men = utils.filterByType(inventory, models.Man);
        var elevators = utils.filterByType(inventory, models.Elevator);
        var inventoryItems = [blocks, men, elevators].map(function(itemTypes, index) {
            if (!itemTypes.length) {
                return null;
            }
            var itemType = itemTypes[0];
            var Component = utils.modelToComponent(itemType);
            return (
                <span>
                    <Component
                        key={itemType}
                        width={MAP.unit}
                        height={MAP.unit}
                        position='relative'
                        onDragStart={function(event) {
                            event.dataTransfer.setData('modelName', itemType.name);
                        }}
                        draggable={true} />
                    <span>x {itemTypes.length}</span>
                </span>
            );
        }.bind(this));
        return (
            <div style={styles}>
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

    handleDragOver: function(event) {
        // Only allow placement within grid
        event.preventDefault();
        var placementPreviewItem = React.findDOMNode(this.refs.preview);
        placementPreviewItem.style.visibility = 'visible';
        placementPreviewItem.style.left = utils.snapToGrid(event.clientX) + 'px';
        placementPreviewItem.style.top = utils.snapToGrid(event.clientY) + 'px';
    },

    handleDrop: function(event) {
        var left = utils.findCell(event.clientX);
        var top = utils.findCell(event.clientY);
        var model = models[event.dataTransfer.getData('modelName')];
        var item = new model({
            top: top,
            left: left
        });
        try {
            var items = this.state.items;
            var inventory = this.state.inventory;
            items.add(item);
            // Remove one item of this type
            var itemOfTypeFoundCount = 0;
            inventory = inventory.filter(function(currItem) {
                var isSameType = item.constructor === currItem;
                itemOfTypeFoundCount++;
                return !isSameType || (isSameType && itemOfTypeFoundCount > 1);
            });
            // Update state
            this.setState({
                items: items,
                inventory: inventory,
                isPlacementMode: inventory.length > 0
            });
        } catch (e) {
            // Adding of item failed, presumably due to that cell being taken
        } finally {
            React.findDOMNode(this.refs.preview).style.visibility = 'hidden';
        }
    },

    modelsToComponents: function(model) {
        var Component = utils.modelToComponent(model);
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
        var placementPreviewItem = this.state.isPlacementMode ? <ItemPreview ref='preview' /> : null;
        return (
            <div style={styles} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                {this.modelsToComponents(models.Man)}
                {this.modelsToComponents(models.Block)}
                {this.modelsToComponents(models.Elevator)}
                {inventory}
                {placementPreviewItem}
            </div> 
        );
    },
});

module.exports = Level;
