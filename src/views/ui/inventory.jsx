var React = require('react');

var models = require('../../models/items');
var MAP = require('../../constants/map');
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
        var width = MAP.appWidth - MAP.width;
        var height = MAP.height;
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
            height: innerHeight
        };
        var headingStyles = {
            overflow: 'hidden',
            fontWeight: 'bold',
            fontFamily: 'Courier New',
            wordWrap: 'break-word'
        };
        var inventory = this.props.inventory;
        var blocks = inventory.filterByType(models.Block);
        var men = inventory.filterByType(models.Man);
        var elevators = inventory.filterByType(models.Elevator);
        // Event handlers
        var onDragStart = this.props.onDragStart;
        var onDragEnd = this.props.onDragEnd;
        var onTouchStart = this.props.onTouchStart;
        var onTouchMove = this.props.onTouchMove;
        var onTouchEnd = this.props.onTouchEnd;
        // Inventory items as components
        var inventoryItems = [blocks, men, elevators].filter(function(itemTypes) {
                return itemTypes.length;
            }).map(function(itemTypes) {
                var itemType = itemTypes[0];
                var Component = modelViewUtils.modelToComponent(itemType);
                return (
                    <span key={'wrapper' + itemType.name}>
                        <Component
                            key={itemType.name}
                            width={MAP.unit}
                            height={MAP.unit}
                            isInInventory={true}
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
                        <span>x {itemTypes.length}</span>
                    </span>
                );
            });
        return (
            <div style={containerStyles}>
                <div style={styles}>
                    <div style={headingStyles}>Inventory</div>
                    {inventoryItems}
                    {this.goButton()}
                </div>
            </div>
        );
    }
});

module.exports = Inventory;
