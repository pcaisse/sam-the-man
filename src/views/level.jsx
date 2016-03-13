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
-Make inventory draggable within map
-Allow inventory items to be moved/returned to inventory if placed erroneously
-Fix dimension bug on mobile/tablet
 */
var Level = React.createClass({

    getInitialState: function() {
        return {
            items: this.props.items,
            inventory: this.props.inventory,
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

    componentWillUnmount: this.cancel,

    play: function() {
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    cancel: function() {
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

    handleDragOver: function(event) {
        event.preventDefault();
        // Snap preview to grid
        var preview = {
            visibility: 'visible',
            left: utils.snapToGrid(event.clientX) + 'px',
            top: utils.snapToGrid(event.clientY) + 'px'
        };
        this.setState({preview: preview});
    },

    handleDrop: function(event) {
        var left = utils.findCellIndex(event.clientX);
        var top = utils.findCellIndex(event.clientY);
        var model = models[event.dataTransfer.getData('modelName')];
        var itemId = event.dataTransfer.getData('id'); // Item has been re-dragged
        // Whatever happens, hide preview after drop
        var newState = {
            preview: {
                visibility: 'hidden'
            }
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
                newState.isPlacementMode = inventory.length > 0;
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
        return this.props.items.filter(function(item) {
            return item instanceof model;
        }).map(function(item, index) {
            var props = utils.clone(item);
            if (item.isInventoryItem) {
                props.draggable = true;
                props.onDragStart = function(event) {
                    // Used to identify the item on potential re-drag
                    event.dataTransfer.setData('id', item.id);
                    event.dataTransfer.setData('modelName', item.constructor.name);
                };
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
        var placementPreviewItem = this.state.isPlacementMode ? <ItemPreview {...this.state.preview} /> : null;
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
                <Inventory inventory={this.state.inventory} />
            </div>
        );
    },
});

module.exports = Level;
