var React = require('react');

var Man = require('./items/man.jsx');
var Block = require('./items/block.jsx');
var Elevator = require('./items/elevator.jsx');
var Goal = require('./items/goal.jsx');

var Inventory = require('./ui/inventory.jsx');
var ItemPlacementPreview = require('./ui/itemPlacementPreview.jsx');
var LevelCompleteModal = require('./ui/levelCompleteModal.jsx');

var models = require('../models/items');

var mapUtils = require('../utils/map');
var modelViewUtils = require('../utils/modelView');

var INITIAL_STATE = {
    isComplete: false,
    isPlacementMode: true,
    itemPlacementPreview: null
};

var Level = React.createClass({

    _animationRequestId: null,
    _dragData: {},

    getInitialLevelState: function(props) {
        var initialState = INITIAL_STATE;
        initialState.inventory = props.inventory.copy();
        initialState.items = props.items.copy();
        return initialState;
    },

    getInitialState: function() {
        return this.getInitialLevelState(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.currLevel !== nextProps.currLevel) {
            // Level changed
            this.setLevel(nextProps);
        }
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

    setLevel: function(props) {
        this.stop();
        this.setState(this.getInitialLevelState(props));
    },

    play: function() {
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    stop: function() {
        window.cancelAnimationFrame(this._animationRequestId);
    },

    areSomeItemsPlaced: function() {
        return this.state.inventory && this.state.inventory.length < this.props.inventory.length;
    },

    updateItems: function() {
        if (!this.state.isComplete) {
            this._animationRequestId = window.requestAnimationFrame(this.updateItems);
            var items = this.state.items;
            items.update();
            this.setState({
                items: items,
                isComplete: items.isGoalAchieved()
            });
        }
    },

    isOnMap: function(x, y) {
        var mapUnit = this.props.mapDimensions.unit;
        return mapUtils.isWithinMapBounds(
            mapUtils.findCellIndex(y, mapUnit),
            mapUtils.findCellIndex(x, mapUnit)
        );
    },

    handleTouchStart: function(event, itemType) {
        event.preventDefault();
        this.startDragTouch(itemType);
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
        this.startDragTouch(itemType);
    },

    startDragTouch: function(itemType) {
        // Clear out drag data
        this._dragData = {};
        // Used to identify the type of item (Block vs Man vs Elevator)
        this._dragData.modelName = itemType;
    },

    setItemData: function(item) {
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
        var mapUnit = this.props.mapDimensions.unit;
        var left = mapUtils.findCellIndex(x, mapUnit);
        var top = mapUtils.findCellIndex(y, mapUnit);
        var model = this._dragData.modelName;
        var itemId = this._dragData.itemId;
        // Whatever happens, hide preview after drop
        var newState = {
            itemPlacementPreview: null
        };
        var items = this.state.items;
        var item = new model({
            top: top,
            left: left,
            isInventoryItem: true
        });
        var isCellTaken = items.isCellTaken(item);
        if (!isCellTaken) {
            items.add(item);
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
            }
        }
        this.setState(newState);
    },

    editItem: function(itemId, newValues) {
        var items = this.state.items;
        var item = items.find(itemId);
        var editedItem = item.edit(newValues);
        items.remove(itemId);
        items.add(editedItem);
        this.setState({items: items});
    },

    snapPreviewToGrid: function(x, y) {
        // Snap preview to grid
        var mapUnit = this.props.mapDimensions.unit;
        var itemPlacementPreview = {
            left: mapUtils.findCellIndex(x, mapUnit),
            top: mapUtils.findCellIndex(y, mapUnit)
        };
        this.setState({itemPlacementPreview: itemPlacementPreview});
    },

    hidePreview: function() {
        this.setState({itemPlacementPreview: null});
    },

    modelsToComponents: function(model) {
        var Component = modelViewUtils.modelToComponent(model);
        var setItemData = this.setItemData;
        var handleDragEnd = this.handleDragEnd;
        var handleTouchEnd = this.handleTouchEnd;
        var handleTouchMove = this.handleTouchMove;
        var mapDimensions = this.props.mapDimensions;
        var isPlacementMode = this.state.isPlacementMode;
        var editItem = this.editItem;
        return this.state.items.filter(function(item) {
            return item instanceof model;
        }).map(function(item, index) {
            // Define props to be passed to component
            var props = {
                id: item.id,
                top: item.top,
                topFraction: item.topFraction,
                left: item.left,
                leftFraction: item.leftFraction,
                width: item.width,
                height: item.height,
                mapDimensions: mapDimensions,
                isFacingRight: item.isFacingRight,
                isGoingDown: item.isGoingDown,
                isBroken: item.isBroken,
                isInventoryItem: item.isInventoryItem,
                isPlacementMode: isPlacementMode
            };
            if (item.isInventoryItem) {
                props.draggable = true;
                props.onDragStart = function(event) {
                    setItemData(item);
                };
                props.onDragEnd = handleDragEnd;
                props.onTouchStart = function(event) {
                    setItemData(item);
                };
                props.onTouchMove = handleTouchMove;
                props.onTouchEnd = handleTouchEnd;
                props.editItem = editItem;
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
            width: this.props.mapDimensions.width,
            height: this.props.mapDimensions.height,
            backgroundColor: '#e4e4e4',
            flex: 'auto'
        };
        var placementPreviewItem = this.state.itemPlacementPreview ?
            <ItemPlacementPreview
                styles={this.state.itemPlacementPreview}
                mapDimensions={this.props.mapDimensions} /> : null;
        var levelComplete = this.state.isComplete ?
            <LevelCompleteModal
                isLastLevel={this.props.isLastLevel}
                nextLevel={this.props.currLevel + 1}
                mapDimensions={this.props.mapDimensions} /> : null;
        return (
            <div style={containerStyles}>
                <div style={styles} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                    {this.modelsToComponents(models.Man)}
                    {this.modelsToComponents(models.DroppableBlock)}
                    {this.modelsToComponents(models.BreakableBlock)}
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
                    areSomeItemsPlaced={this.areSomeItemsPlaced()}
                    isPlacementMode={this.state.isPlacementMode}
                    mapDimensions={this.props.mapDimensions}
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
