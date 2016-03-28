var React = require('react');

var Level = require('./level.jsx');
var MAP = require('../constants/map');
var LEVELS = require('../constants/levels');

var mapUtils = require('../utils/map');

var App = React.createClass({

    getInitialState: function() {
        return {
            mapDimensions: mapUtils.findMapDimensions()
        };
    },

    componentDidMount: function() {
        window.onresize = function() {
            this.setState({
                mapDimensions: mapUtils.findMapDimensions()
            });
        }.bind(this);
    },

    render: function() {
        var mapDimensions = this.state.mapDimensions;
        var styles = {
            width: mapDimensions.appWidth
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
                <Level
                    items={items}
                    map={MAP}
                    inventory={inventory}
                    currLevel={currLevelIndex}
                    mapDimensions={mapDimensions} />
            </div> 
        );
    }
});

module.exports = App;
