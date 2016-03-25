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
var utils = require('../utils/utils');
var mapUtils = require('../utils/map');
var modelViewUtils = require('../utils/modelView');

var Level = React.createClass({

    _dragData: {},

    getInitialState: function() {
        return {
            allItemsPlaced: false,
            inventory: this.props.inventory.copy(),
            isComplete: false,
            isPlacementMode: true,
            items: this.props.items.copy(),
            preview: null
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

    isOnMap: function(x, y) {
        return mapUtils.findCellIndex(x) >= 0 && mapUtils.findCellIndex(x) < MAP.X &&
            mapUtils.findCellIndex(y) >= 0 && mapUtils.findCellIndex(y) < MAP.Y;
    },

    handleTouchStart: function(event, itemType) {
        event.preventDefault();
        this._dragData.modelName = itemType;
    },

    handleTouchMove: function(event) {
        event.preventDefault();
        if (event.targetTouches.length === 1) {
            // There's exactly one finger inside this element
            var touch = event.targetTouches[0];
            if (this.isOnMap(touch.pageX, touch.pageY)) {
                this.snapPreviewToGrid(touch.pageX, touch.pageY);
            } else {
                this.hidePreview();
            }
        }
    },

    handleTouchEnd: function(event) {
        event.preventDefault();
        if (event.changedTouches.length === 1) {
            var touch = event.changedTouches[0];
            if (this.isOnMap(touch.pageX, touch.pageY)) {
                this.placeItem(touch.pageX, touch.pageY);
            } else {
                this.hidePreview();
            }
        }
    },

    handleDragStart: function(event, itemType) {
        // Used to identify the type of item (Block vs Man vs Elevator)
        this._dragData.modelName = itemType;
    },

    handleRedragStart: function(event, item) {
        // Used to identify the item on re-drag
        this._dragData.itemId = item.id;
        this._dragData.modelName = item.constructor;
    },

    handleDragOver: function(event) {
        event.preventDefault();
        this.snapPreviewToGrid(event.clientX, event.clientY);
    },

    handleDragEnd: function(event) {
        this.hidePreview();
    },

    handleDrop: function(event) {
        this.placeItem(event.clientX, event.clientY);
    },

    placeItem: function(x, y) {
        var left = mapUtils.findCellIndex(x);
        var top = mapUtils.findCellIndex(y);
        var model = this._dragData.modelName;
        var itemId = this._dragData.itemId;
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
            console.log(e);
        } finally {
            this.setState(newState);
        }
    },

    snapPreviewToGrid: function(x, y) {
        // Snap preview to grid
        var preview = {
            left: mapUtils.findCellIndex(x),
            top: mapUtils.findCellIndex(y)
        };
        this.setState({preview: preview});
    },

    hidePreview: function() {
        this.setState({preview: null});
    },

    modelsToComponents: function(model) {
        var Component = modelViewUtils.modelToComponent(model);
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
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                    onTouchEnd={this.handleTouchEnd}
                />
            </div>
        );
    },
});

module.exports = Level;
