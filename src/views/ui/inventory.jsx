var React = require('react');

var models = require('../../models/items');
var modelViewUtils = require('../../utils/modelView');

var Inventory = React.createClass({
    goButton: function() {
        if (!this.props.allItemsPlaced) {
            return null;
        }
        if (this.props.isPlacementMode) {
            return <button onClick={this.props.onStart}>Go!</button>;
        }
        return <button onClick={this.props.onReset}>Reset</button>;
    },
    render: function() {
        // TODO: Refactor this function
        var mapDimensions = this.props.mapDimensions;
        var width = mapDimensions.appWidth - mapDimensions.width;
        var height = mapDimensions.height;
        var borderThickness = 1;
        var border = borderThickness + 'px solid black';
        var containerStyles = {
            width: width,
            height: height 
        };
        var paddingPercentOfHeight = 0.04;
        var padding = height * paddingPercentOfHeight;
        var innerHeight = height * (1 - paddingPercentOfHeight * 2) - (borderThickness * 2);
        var styles = {
            padding: padding,
            backgroundColor: '#fff',
            border: border,
            height: innerHeight,
            overflow: 'hidden'
        };
        var fontStyles = {
            fontWeight: 'bold',
            fontFamily: 'Courier New',
            fontSize: mapDimensions.unit / 4
        };
        var inventory = this.props.inventory;
        var blocks = inventory.filterByType(models.Block);
        var men = inventory.filterByType(models.Man);
        var elevators = inventory.filterByType(models.Elevator);
        var breakableBlocks = inventory.filterByType(models.BreakableBlock);
        var droppableBlocks = inventory.filterByType(models.DroppableBlock);
        // Event handlers
        var onDragStart = this.props.onDragStart;
        var onDragEnd = this.props.onDragEnd;
        var onTouchStart = this.props.onTouchStart;
        var onTouchMove = this.props.onTouchMove;
        var onTouchEnd = this.props.onTouchEnd;
        // Inventory items as components
        var inventoryItems = [blocks, breakableBlocks, droppableBlocks, men, elevators].filter(function(itemTypes) {
                return itemTypes.length;
            }).map(function(itemTypes) {
                var itemType = itemTypes[0];
                // TODO: Refactor to have separate PlacedItem and InventoryItem views
                var Component = modelViewUtils.modelToComponent(itemType);
                return (
                    <span key={'wrapper' + itemType.name}>
                        <Component
                            key={itemType.name}
                            width={mapDimensions.unit}
                            height={mapDimensions.unit}
                            isInInventory={true}
                            mapDimensions={mapDimensions}
                            position='relative'
                            onDragStart={function(event) {
                                onDragStart(event, itemType);
                            }}
                            onDragEnd={onDragEnd}
                            onTouchStart={function(event) {
                                onTouchStart(event, itemType);
                            }}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            draggable={true} />
                        <span style={fontStyles}>x {itemTypes.length}</span>
                    </span>
                );
            });
        return (
            <div style={containerStyles}>
                <div style={styles}>
                    <div style={fontStyles}>Inventory</div>
                    {inventoryItems}
                    {this.goButton()}
                </div>
            </div>
        );
    }
});

module.exports = Inventory;
