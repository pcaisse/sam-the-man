var React = require('react');

var models = require('../../models/items');
var MAP = require('../../constants/map');
var utils = require('../../utils');

var Inventory = React.createClass({
    render: function() {
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
        var blocks = utils.filterByType(inventory, models.Block);
        var men = utils.filterByType(inventory, models.Man);
        var elevators = utils.filterByType(inventory, models.Elevator);
        var inventoryItems = [blocks, men, elevators].filter(function(itemTypes) {
                return itemTypes.length;
            }).map(function(itemTypes) {
                var itemType = itemTypes[0];
                var Component = utils.modelToComponent(itemType);
                return (
                    <span key={'wrapper' + itemType.name}>
                        <Component
                            key={itemType.name}
                            width={MAP.unit}
                            height={MAP.unit}
                            position='relative'
                            onDragStart={function(event) {
                                // Used to identify the type of item (Block vs Man vs Elevator)
                                event.dataTransfer.setData('modelName', itemType.name);
                            }}
                            draggable={true} />
                        <span>x {itemTypes.length}</span>
                    </span>
                );
            }.bind(this));
        return (
            <div style={containerStyles}>
                <div style={styles}>
                    <div style={headingStyles}>Inventory</div>
                    {inventoryItems}
                </div>
            </div>
        );
    }
});

module.exports = Inventory;
