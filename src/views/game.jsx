var React = require('react');

var Level = require('./level.jsx');
var MAP = require('../constants/map');
var LEVELS = require('../constants/levels');

var Game = React.createClass({
    render: function() {
        var mapDimensions = this.props.mapDimensions;
        var styles = {
            width: mapDimensions.appWidth
        };
        var currLevelIndex = parseInt(this.props.params.currLevel, 10) || 0;
        var currLevel = LEVELS[currLevelIndex];
        if (!currLevel) {
            throw new Error('Level not implemented');
        }
        var isLastLevel = currLevelIndex === LEVELS.length - 1;
        var items = currLevel.items;
        var inventory = currLevel.inventory;
        return (
            <div style={styles}>
                <Level
                    items={items}
                    map={MAP}
                    inventory={inventory}
                    currLevel={currLevelIndex}
                    isLastLevel={isLastLevel}
                    mapDimensions={mapDimensions} />
            </div> 
        );
    }
});

module.exports = Game;
