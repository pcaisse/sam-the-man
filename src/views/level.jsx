var React = require('react');

var Man = require('./items/man.jsx');
var Block = require('./items/block.jsx');
var Elevator = require('./items/elevator.jsx');
var Goal = require('./items/goal.jsx');

var Inventory = require('./ui/inventory.jsx');
var ItemPreview = require('./ui/preview.jsx');
var Modal = require('./ui/modal.jsx');

var models = require('../models/items');
var MAP = require('../constants/map');
var utils = require('../utils');

/*
TODO:
-Fix dimension bug on mobile/tablet
 */
var Level = React.createClass({

    getInitialState: function() {
        return {
            items: this.props.items.copy(),
            inventory: this.props.inventory.copy(),
            allItemsPlaced: false,
            isPlacementMode: true,
            preview: null,
            isComplete: false
        };
    },

    componentWillUpdate: function(nextProps, nextState) {
        if (this.state.isPlacementMode && !nextState.isPlacementMode) {
            // Just left placement mode, so time to start the show...
            this.play();
        }
    },

    componentWillUnmount: this.stop,

    start: function() {
        this.setState({isPlacementMode: false});
    },

    reset: function() {
        this.stop();
        this.setState(this.getInitialState());
    },

    play: function() {
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    stop: function() {
        window.cancelAnimationFrame(this._animationRequestId);
    },

    updateItems: function() {
        if (!this.state.isComplete) {
            var items = this.state.items;
            items.update();
            this.setState({
                items: items,
                isComplete: items.isGoalAchieved()
            });
            this._animationRequestId = window.requestAnimationFrame(this.updateItems);
        }
    },

    handleDragStart: function(event, itemType) {
        // Used to identify the type of item (Block vs Man vs Elevator)
        event.dataTransfer.setData('modelName', itemType.name);
    },

    handleRedragStart: function(event, item) {
        // Used to identify the item on re-drag
        event.dataTransfer.setData('id', item.id);
        event.dataTransfer.setData('modelName', item.constructor.name);
    },

    handleDragOver: function(event) {
        event.preventDefault();
        // Snap preview to grid
        var preview = {
            left: utils.snapToGrid(event.clientX) + 'px',
            top: utils.snapToGrid(event.clientY) + 'px'
        };
        this.setState({preview: preview});
    },

    handleDragEnd: function(event) {
        this.setState({preview: null});
    },

    handleDrop: function(event) {
        var left = utils.findCellIndex(event.clientX);
        var top = utils.findCellIndex(event.clientY);
        var model = models[event.dataTransfer.getData('modelName')];
        var itemId = event.dataTransfer.getData('id'); // Item has been re-dragged
        // Whatever happens, hide preview after drop
        var newState = {
            preview: null
        };
        try {
            var items = this.state.items;
            var item = new model({
                top: top,
                left: left,
                isInventoryItem: true
            });
            items.add(item); // this may fail if placed in taken cell
            if (itemId) {
                // Item was re-dragged
                // Delete old item
                items.remove(itemId);
            }
            newState.items = items;
            // Remove one item of this type
            // only on initial drag
            if (!itemId) {
                var inventory = this.state.inventory;
                inventory.removeOneOfType(item.constructor);
                newState.inventory = inventory;
                newState.allItemsPlaced = inventory.length === 0;
            }
        } catch (e) {
            // Adding of item failed, presumably due to that cell being taken
            // TODO: Catch errors
        } finally {
            this.setState(newState);
        }
    },

    modelsToComponents: function(model) {
        var Component = utils.modelToComponent(model);
        var handleRedragStart = this.handleRedragStart;
        var handleDragEnd = this.handleDragEnd;
        return this.state.items.filter(function(item) {
            return item instanceof model;
        }).map(function(item, index) {
            var props = utils.clone(item);
            if (item.isInventoryItem) {
                props.draggable = true;
                props.onDragStart = function(event) {
                    handleRedragStart(event, item);
                };
                props.onDragEnd = handleDragEnd;
            }
            return <Component key={index} {...props} />;
        });
    },

    render: function() {
        var containerStyles = {
            display: 'flex'
        };
        var styles = {
            position: 'relative',
            width: this.props.map.width,
            height: this.props.map.height,
            backgroundColor: '#e4e4e4',
            flex: 'auto'
        };
        var placementPreviewItem = this.state.preview ? <ItemPreview {...this.state.preview} /> : null;
        var levelComplete = this.state.isComplete ?
            <Modal text="Level Complete!" nextLevel={++this.props.currLevel} /> : null;
        return (
            <div style={containerStyles}>
                <div style={styles} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                    {this.modelsToComponents(models.Man)}
                    {this.modelsToComponents(models.Block)}
                    {this.modelsToComponents(models.Elevator)}
                    {this.modelsToComponents(models.Goal)}
                    {placementPreviewItem}
                    {levelComplete}
                </div>
                <Inventory
                    inventory={this.state.inventory}
                    onStart={this.start}
                    onReset={this.reset}
                    allItemsPlaced={this.state.allItemsPlaced}
                    isPlacementMode={this.state.isPlacementMode}
                    onDragStart={this.handleDragStart}
                    onDragEnd={this.handleDragEnd}
                />
            </div>
        );
    },
});

module.exports = Level;
