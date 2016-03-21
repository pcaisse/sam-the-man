var React = require('react');

var Level = require('./level.jsx');
var MAP = require('../constants/map');
var LEVELS = require('../constants/levels');

var App = React.createClass({
    render: function() {
        var styles = {
            width: MAP.appWidth
        };
        var currLevelIndex = this.props.params.currLevel || 0;
        var currLevel = LEVELS[currLevelIndex];
        if (!currLevel) {
            throw new Error('Level not implemented');
        }
        var items = currLevel.items;
        var inventory = currLevel.inventory;
        return (
            <div style={styles}>
                <Level items={items} map={MAP} inventory={inventory} currLevel={currLevelIndex} />
            </div> 
        );
    }
});

module.exports = App;
