var React = require('react');
var Man = require('./man.jsx');
var Block = require('./block.jsx');
var Elevator = require('./elevator.jsx');
var Inventory = require('./inventory.jsx');
var ItemPreview = require('./preview.jsx');

var models = require('../models');
var MAP = require('../constants/map');
var utils = require('../utils');

var Level = React.createClass({

    getInitialState: function() {
        return {
            items: this.props.items,
            inventory: this.props.inventory,
            isPlacementMode: true,
            preview: null
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

    updateItems: function() {
        var items = this.state.items;
        items.update();
        this.setState(items);
        this._animationRequestId = window.requestAnimationFrame(this.updateItems);
    },

    handleDragOver: function(event) {
        event.preventDefault();
        var preview = {
            visibility: 'visible',
            left: utils.snapToGrid(event.clientX) + 'px',
            top: utils.snapToGrid(event.clientY) + 'px'
        };
        this.setState({preview: preview});
    },

    handleDrop: function(event) {
        var left = utils.findCell(event.clientX);
        var top = utils.findCell(event.clientY);
        var model = models[event.dataTransfer.getData('modelName')];
        var item = new model({
            top: top,
            left: left
        });
        // Whatever happens, hide preview after drop
        var newState = {
            preview: {
                visibility: 'hidden'
            }
        };
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
            newState.items = items;
            newState.inventory = inventory;
            newState.isPlacementMode = inventory.length > 0;
        } catch (e) {
            // Adding of item failed, presumably due to that cell being taken
        } finally {
            this.setState(newState);
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
        var inventory = this.state.isPlacementMode ? <Inventory inventory={this.state.inventory} /> : null;
        var placementPreviewItem = this.state.isPlacementMode ? <ItemPreview {...this.state.preview} /> : null;
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
