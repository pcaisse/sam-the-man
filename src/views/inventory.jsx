var React = require('react');

var models = require('../models');
var MAP = require('../constants/map');
var utils = require('../utils');

var Inventory = React.createClass({
    render: function() {
        var styles = {
            width: '20%',
            position: 'absolute',
            top: '25%',
            left: '65%',
            padding: parseInt(MAP.unit / 5),
            backgroundColor: '#fff',
            border: '1px solid black'
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
            <div style={styles}>
                <div>Inventory</div>
                {inventoryItems}
            </div>
        );
    }
});

module.exports = Inventory;
